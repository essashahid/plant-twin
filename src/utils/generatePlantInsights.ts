import {
  PlantFormData,
  DashboardData,
  StatusTone,
  ComparisonRow,
  Reminder,
  RiskItem,
  CoachData,
} from "@/types/plant";

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

function parseAgeWeeks(age: string, plantedDate: string): number {
  if (plantedDate) {
    const planted = new Date(plantedDate).getTime();
    if (!isNaN(planted)) {
      const diffMs = Date.now() - planted;
      const weeks = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24 * 7)));
      if (weeks > 0) return weeks;
    }
  }
  if (!age) return 0;
  const text = age.toLowerCase();
  const match = text.match(/(\d+(?:\.\d+)?)/);
  if (!match) return 0;
  const n = parseFloat(match[1]);
  if (text.includes("month")) return Math.round(n * 4.3);
  if (text.includes("day")) return Math.max(1, Math.round(n / 7));
  if (text.includes("year")) return Math.round(n * 52);
  return Math.round(n); // assume weeks
}

function stageFromWeeks(weeks: number): string {
  if (weeks <= 2) return "Seedling";
  if (weeks <= 5) return "Early vegetative";
  if (weeks <= 8) return "Late vegetative";
  if (weeks <= 12) return "Flowering / early fruiting";
  return "Fruiting / mature";
}

const STAGE_ORDER = [
  "Seedling",
  "Early vegetative",
  "Late vegetative",
  "Flowering / early fruiting",
  "Fruiting / mature",
];

function stageRank(stage: string): number {
  const idx = STAGE_ORDER.indexOf(stage);
  if (idx >= 0) return idx;
  // Tolerate looser labels coming from older inputs.
  const lower = stage.toLowerCase();
  if (lower.includes("seed")) return 0;
  if (lower.includes("early") && lower.includes("veg")) return 1;
  if (lower.includes("veg")) return 2;
  if (lower.includes("flower")) return 3;
  if (lower.includes("fruit") || lower.includes("mature")) return 4;
  return -1;
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function daysSince(iso: string): number | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (isNaN(t)) return null;
  return Math.max(0, Math.floor((Date.now() - t) / (1000 * 60 * 60 * 24)));
}

export function generatePlantInsights(data: PlantFormData): DashboardData {
  const issues: string[] = [];
  const recommendedActions: string[] = [];
  const reminders: Reminder[] = [];
  const risks: RiskItem[] = [];
  const positives: string[] = [];

  let healthScore = 85;

  // === 1. Sunlight ===
  const sun = typeof data.sunlightHours === "number" ? data.sunlightHours : -1;
  let sunlightLabel = "Unknown";
  let sunlightTone: StatusTone = "info";
  let sunlightNote = "Need a sunlight estimate to assess.";

  if (sun >= 0) {
    if (sun < 4) {
      sunlightLabel = "Low";
      sunlightTone = "danger";
      sunlightNote = "Below the comfort range for chillies.";
      issues.push("Low sunlight may slow growth");
      recommendedActions.push("Move plant to a brighter spot if possible");
      reminders.push({
        text: "Move plant to brighter spot",
        timeframe: "Today",
        priority: "high",
      });
      healthScore -= 15;
    } else if (sun < 6) {
      sunlightLabel = "Slightly low";
      sunlightTone = "warning";
      sunlightNote = "A little under ideal — growth may be slower.";
      issues.push("Sunlight slightly below ideal");
      healthScore -= 8;
    } else if (sun <= 8) {
      sunlightLabel = "Ideal";
      sunlightTone = "good";
      sunlightNote = "Right in the chilli sweet spot.";
      positives.push("Sunlight is in the ideal 6–8 hr range");
      healthScore += 5;
    } else {
      sunlightLabel = "High";
      sunlightTone = "warning";
      sunlightNote = "Plenty of light — watch for heat stress.";
      if (data.temperature === "Hot") {
        issues.push("Heat stress risk from strong sun");
        recommendedActions.push("Provide light afternoon shade on hot days");
        risks.push({
          label: "Heat stress",
          level: "Medium",
          note: "Long sun hours combined with hot temperature.",
        });
      }
    }
  }

  // === 2. Soil & watering ===
  const soil = data.soilCondition;
  let soilTone: StatusTone = "good";
  let soilStatusText = soil || "Unknown";
  let wateringStatus = "On schedule";
  let wateringTone: StatusTone = "good";

  if (soil === "Dry") {
    wateringStatus = "Due now";
    wateringTone = "danger";
    soilTone = "danger";
    issues.push("Soil is dry — watering overdue");
    recommendedActions.push("Water thoroughly today");
    reminders.push({
      text: "Water today",
      timeframe: "Today",
      priority: "high",
    });
    healthScore -= 12;
  } else if (soil === "Slightly dry") {
    wateringStatus = "Due soon";
    wateringTone = "warning";
    soilTone = "warning";
    reminders.push({
      text: "Water tomorrow morning",
      timeframe: "Tomorrow",
      priority: "medium",
    });
    healthScore -= 6;
  } else if (soil === "Wet") {
    soilTone = "warning";
    if (data.wateringFreq === "Daily") {
      wateringStatus = "Overwatering risk";
      wateringTone = "danger";
      issues.push("Possible overwatering risk");
      recommendedActions.push("Check drainage and let soil dry between waterings");
      reminders.push({
        text: "Check drainage after next watering",
        timeframe: "Next watering",
        priority: "medium",
      });
      healthScore -= 12;
    } else {
      wateringStatus = "Hold off";
      wateringTone = "warning";
    }
  } else if (soil === "Moist") {
    wateringStatus = "On schedule";
    wateringTone = "good";
    positives.push("Soil moisture looks balanced");
  } else if (soil === "Compacted") {
    soilTone = "warning";
    issues.push("Compacted soil may limit roots");
    recommendedActions.push("Gently loosen the top layer of soil");
  }

  if (data.drainageHoles === "No") {
    risks.push({
      label: "Poor drainage",
      level: "High",
      note: "Pot has no drainage holes — root rot risk.",
    });
    issues.push("No drainage holes");
    recommendedActions.push("Move to a pot with drainage holes when possible");
    healthScore -= 10;
  } else if (data.drainageHoles === "Yes") {
    positives.push("Good pot drainage");
    healthScore += 4;
  }

  if (data.wateringFreq === "Every 2-3 days" || data.wateringFreq === "Weekly") {
    positives.push("Regular watering rhythm");
    healthScore += 4;
  }

  // === 3. Fertilizer / nutrients ===
  let nutrientStatus = "On track";
  let nutrientTone: StatusTone = "good";
  const fertDays = daysSince(data.lastFertilizer);
  const ageWeeks = parseAgeWeeks(data.age, data.plantedDate);
  const hasRecentFertilizer = fertDays !== null && fertDays <= 21;

  if (!hasRecentFertilizer) {
    nutrientStatus = "Needs review";
    nutrientTone = "warning";
    reminders.push({
      text: "Fertilizer check",
      timeframe: "In 5 days",
      priority: "medium",
    });
    if (ageWeeks > 4) {
      issues.push("Nutrients may be limiting growth");
      recommendedActions.push("Add a balanced feed within the next week");
      healthScore -= 8;
      nutrientTone = "danger";
    }
  } else {
    positives.push("Fertilizer added recently");
  }

  if (data.compostAdded === "Yes") {
    positives.push("Recent compost may support soil health");
    healthScore += 4;
  }

  // === 4. Growth stage ===
  const expectedStage = stageFromWeeks(ageWeeks);
  // Try to infer user's current stage from explicit age — for now both match,
  // but if sunlight/water are poor we treat the plant as "behind".
  let currentStage = expectedStage;
  let stageStatus = "On track";
  let stageTone: StatusTone = "good";

  const stress = (sun >= 0 && sun < 4) || soil === "Dry" || data.wateringFreq === "Irregular";
  if (stress && stageRank(expectedStage) > 0) {
    const backIdx = Math.max(0, stageRank(expectedStage) - 1);
    currentStage = STAGE_ORDER[backIdx];
    stageStatus = "Slightly behind";
    stageTone = "warning";
    issues.push("Growth appears behind expected stage");
    recommendedActions.push("Address sunlight, watering, and nutrients to catch up");
    healthScore -= 6;
  }

  // === 5. Environment ===
  if (data.windExposure === "High") {
    risks.push({
      label: "Wind stress",
      level: "Medium",
      note: "High wind exposure can dry soil and damage stems.",
    });
    recommendedActions.push("Place near partial wind protection");
    healthScore -= 8;
  }

  if (data.shadeRisk === "High") {
    issues.push("Shade may be limiting growth");
    healthScore -= 8;
    risks.push({
      label: "Shade",
      level: "High",
      note: "Surrounding shade is blocking light most of the day.",
    });
  } else if (data.shadeRisk === "Medium") {
    risks.push({
      label: "Shade",
      level: "Medium",
      note: "Partial shade through part of the day.",
    });
  }

  if (data.temperature === "Hot" && (soil === "Dry" || soil === "Slightly dry")) {
    healthScore -= 6;
    recommendedActions.push("Water early morning to beat the heat");
    // Bump existing watering reminder to high priority if present.
    const r = reminders.find((x) => x.text.toLowerCase().includes("water"));
    if (r) r.priority = "high";
  }

  if (data.humidity === "High" && soil === "Wet") {
    risks.push({
      label: "Fungal risk",
      level: "Medium",
      note: "High humidity with wet soil favors fungal growth.",
    });
    recommendedActions.push("Improve airflow around the plant");
  }

  // === 6. Pest / pesticide ===
  const pesticideDays = daysSince(data.lastPesticide);
  const recentPesticide = pesticideDays !== null && pesticideDays <= 14;
  if (recentPesticide) {
    positives.push("Pest prevention logged");
  } else if (data.location === "Balcony" || data.location === "Garden" || data.location === "Rooftop") {
    reminders.push({
      text: "Inspect underside of leaves",
      timeframe: "In 7 days",
      priority: "low",
    });
  }

  // === Always-on photo reminders ===
  reminders.push({
    text: "Upload new full plant photo",
    timeframe: "In 3–4 days",
    priority: "low",
  });
  if (!data.photos.leaf) {
    reminders.push({
      text: "Upload leaf close-up",
      timeframe: "In 3 days",
      priority: "low",
    });
  }

  // === 7. Health score finalize ===
  healthScore = clamp(Math.round(healthScore), 35, 98);

  let status: string;
  let statusTone: StatusTone;
  if (healthScore >= 85) {
    status = "Healthy and on track";
    statusTone = "good";
  } else if (healthScore >= 70) {
    status = "Stable — needs attention";
    statusTone = "warning";
  } else if (healthScore >= 55) {
    status = "Stressed — behind ideal growth";
    statusTone = "warning";
  } else {
    status = "Needs urgent care review";
    statusTone = "danger";
  }

  // === 8. Coach message ===
  const topIssues = issues.slice(0, 3);
  const plantLabel = data.name?.trim() || data.type || "your plant";

  let summary: string;
  if (topIssues.length === 0) {
    summary = `${plantLabel} is doing well. Keep the current routine and check growth again in 3–4 days.`;
  } else if (topIssues.length === 1) {
    summary = `${plantLabel} is mostly stable, but ${topIssues[0].toLowerCase()}. ${
      recommendedActions[0] ?? "Keep an eye on it"
    } and check again in 3–4 days.`;
  } else {
    const issueList = topIssues
      .map((s, i) => (i === topIssues.length - 1 ? `and ${s.toLowerCase()}` : s.toLowerCase()))
      .join(topIssues.length > 2 ? ", " : " ");
    const action = recommendedActions[0] ?? "watch closely";
    summary = `${plantLabel} is ${
      healthScore >= 70 ? "stable but slightly behind ideal" : "showing signs of stress"
    }. The main factors are ${issueList}. ${action} and check again in 3–4 days.`;
  }

  const confidence: CoachData["confidence"] =
    sun < 0 || !data.soilCondition ? "Medium" : data.photos.full || data.photos.leaf ? "High" : "Medium";

  const coachData: CoachData = {
    summary,
    confidence,
    mainIssue: topIssues[0] ?? "No critical issues",
    nextAction: recommendedActions[0] ?? "Maintain routine",
    followUp: "Upload progress photo in 3–4 days",
  };

  // === 9. Actual vs Ideal ===
  const comparisonData: ComparisonRow[] = [
    {
      metric: "Growth Stage",
      yours: currentStage,
      ideal: expectedStage,
      status: stageStatus,
      statusTone: stageTone,
      note:
        stageTone === "good"
          ? "Tracking the expected pace."
          : "May be lagging — review light and water.",
    },
    {
      metric: "Sunlight",
      yours: sun >= 0 ? `${sun} hrs/day` : "Not set",
      ideal: "6–8 hrs/day",
      status: sunlightLabel,
      statusTone: sunlightTone,
      note: sunlightNote,
    },
    {
      metric: "Watering",
      yours: data.wateringFreq || "Not set",
      ideal: "Every 2–3 days",
      status: wateringStatus,
      statusTone: wateringTone,
      note:
        wateringTone === "good"
          ? "Rhythm looks healthy."
          : "Adjust frequency based on soil moisture.",
    },
    {
      metric: "Soil",
      yours: soilStatusText,
      ideal: "Lightly moist",
      status: soilTone === "good" ? "Good" : soilTone === "warning" ? "Watch" : "Action needed",
      statusTone: soilTone,
      note: soil === "Wet" ? "Let the top layer dry before next watering." : "Check moisture with a finger test.",
    },
    {
      metric: "Drainage",
      yours: data.drainageHoles === "Yes" ? "Drainage holes" : "No drainage",
      ideal: "Holes + airy mix",
      status: data.drainageHoles === "Yes" ? "Good" : "Risky",
      statusTone: data.drainageHoles === "Yes" ? "good" : "danger",
      note:
        data.drainageHoles === "Yes"
          ? "Excess water can escape freely."
          : "Roots may sit in water — repot when possible.",
    },
    {
      metric: "Nutrients",
      yours: hasRecentFertilizer ? `Last fed ${formatDate(data.lastFertilizer)}` : "No recent feed",
      ideal: "Light feeding every 2 weeks",
      status: nutrientStatus,
      statusTone: nutrientTone,
      note: hasRecentFertilizer
        ? "Continue light feeding cycles."
        : "Plan a balanced feed in the next few days.",
    },
    {
      metric: "Wind Exposure",
      yours: data.windExposure || "Not set",
      ideal: "Low–medium",
      status: data.windExposure === "High" ? "High" : "OK",
      statusTone: data.windExposure === "High" ? "warning" : "good",
      note:
        data.windExposure === "High"
          ? "Consider a wind break or sheltered corner."
          : "Wind level is comfortable.",
    },
    {
      metric: "Shade Risk",
      yours: data.shadeRisk || "Not set",
      ideal: "Low",
      status: data.shadeRisk === "Low" ? "Good" : data.shadeRisk === "Medium" ? "Watch" : "High",
      statusTone:
        data.shadeRisk === "Low" ? "good" : data.shadeRisk === "Medium" ? "warning" : "danger",
      note:
        data.shadeRisk === "Low"
          ? "Plenty of open sky."
          : "Surrounding shade may shorten effective sun hours.",
    },
  ];

  // === Heat stress / pest summary risks ===
  const heatStressRisk =
    data.temperature === "Hot" && sun >= 9
      ? "Medium"
      : data.windExposure === "High"
      ? "Medium"
      : "Low";

  // === Care timeline ===
  const careTimeline: DashboardData["careTimeline"] = [
    { date: "Today", event: "Setup PlantTwin profile", icon: "camera" },
    ...(data.lastWatered
      ? [{ date: formatDate(data.lastWatered), event: "Watered", icon: "water" as const }]
      : []),
    ...(data.lastFertilizer
      ? [
          {
            date: formatDate(data.lastFertilizer),
            event: `Fertilizer added${data.fertilizerType ? ` (${data.fertilizerType})` : ""}`,
            icon: "nutrient" as const,
          },
        ]
      : []),
    ...(data.lastPesticide
      ? [{ date: formatDate(data.lastPesticide), event: "Pesticide spray applied", icon: "pest" as const }]
      : []),
    ...(data.compostAdded === "Yes"
      ? [{ date: "Recently", event: "Compost added", icon: "soil" as const }]
      : []),
  ];

  // Cap reminders to the most useful 5, prioritized by high → medium → low.
  const sortedReminders = [...reminders].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 } as const;
    return order[a.priority] - order[b.priority];
  });
  const dedupedReminders: Reminder[] = [];
  const seen = new Set<string>();
  for (const r of sortedReminders) {
    if (seen.has(r.text)) continue;
    seen.add(r.text);
    dedupedReminders.push(r);
    if (dedupedReminders.length >= 5) break;
  }

  return {
    plant: {
      name: data.name || data.type,
      type: data.type,
      location: data.location,
      stage: currentStage,
      idealStage: expectedStage,
      ageWeeks,
      healthScore,
      status,
      statusTone,
      lastPhotoCheck: "Just now",
      sunlightHours: data.sunlightHours,
      sunlightLabel,
      sunlightTone,
      idealSunlight: "6–8 hrs/day",
      wateringStatus,
      wateringTone,
      soilStatus: soilStatusText,
      soilTone,
      nutrientStatus,
      nutrientTone,
      windExposure: data.windExposure,
      temperature: data.temperature,
      humidity: data.humidity,
      heatStressRisk,
      shadeRisk: data.shadeRisk,
      photoFull: data.photos.full,
    },
    comparisonData,
    careTimeline,
    reminders: dedupedReminders,
    photoProgress: [
      { week: "Current", note: "Setup photo", image: data.photos.full || "/chilli-hero.png" },
    ],
    environmentData: [
      { label: "Location", value: data.location, icon: "location" },
      { label: "Est. Sunlight", value: sun >= 0 ? `${sun} hrs/day` : "Not set", icon: "sun" },
      { label: "Wind Exposure", value: data.windExposure, icon: "wind" },
      { label: "Temperature", value: data.temperature, icon: "temp" },
      { label: "Humidity", value: data.humidity, icon: "humidity" },
      { label: "Heat Stress Risk", value: heatStressRisk, icon: "heat" },
      { label: "Shade Risk", value: data.shadeRisk, icon: "shade" },
    ],
    coachData,
    issues: topIssues,
    recommendedActions: recommendedActions.slice(0, 4),
    risks,
    positives,
  };
}
