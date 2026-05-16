import { PlantFormData, DashboardData } from "@/types/plant";

export function generatePlantInsights(data: PlantFormData): DashboardData {
  // Simple rule-based logic
  
  // Sunlight logic
  let sunlightStatus = "Good";
  let sunlightColor: "green" | "amber" | "red" = "green";
  if (data.sunlightHours !== "" && data.sunlightHours < 5) {
    sunlightStatus = "Low";
    sunlightColor = "red";
  }

  // Watering/Soil logic
  let wateringStatus = "Optimal";
  let soilStatusText = data.soilCondition;
  let wateringColor: "green" | "amber" | "red" = "green";
  let soilColor: "green" | "amber" | "red" = "green";
  if (data.soilCondition === "Dry" || data.soilCondition === "Slightly dry") {
    wateringStatus = "Due soon";
    wateringColor = "amber";
    soilColor = "amber";
  } else if (data.soilCondition === "Wet") {
    wateringStatus = "Hold off";
    wateringColor = "amber";
    soilColor = "red";
  }

  // Age/Stage logic
  let stage = "Vegetative";
  let idealStage = "Vegetative";
  let stageStatus = "On track";
  let stageColor: "green" | "amber" | "red" = "green";
  
  if (data.age.includes("5") || data.age.includes("6") || data.age.includes("7")) {
    idealStage = "Early flowering";
    if (data.sunlightHours !== "" && data.sunlightHours < 5) {
      stageStatus = "Behind";
      stageColor = "amber";
    }
  }

  // Fertilizer logic
  let nutrientStatusText = "Optimal";
  let nutrientColor: "green" | "amber" | "red" = "green";
  if (data.compostAdded === "No") {
    nutrientStatusText = "Needs review";
    nutrientColor = "red";
  }

  // Wind exposure
  let heatStressRisk = "Low";
  if (data.windExposure === "High") {
    heatStressRisk = "Medium (Wind stress)";
  }

  // Shade risk
  let coachSummary = `Your ${data.name || data.type} looks to be on track.`;
  if (data.shadeRisk === "Medium" || data.shadeRisk === "High") {
    coachSummary = `Growth may be slower due to ${data.shadeRisk.toLowerCase()} shade risk.`;
  }

  // Example Prompt scenario
  if (data.sunlightHours !== "" && data.sunlightHours < 5 && data.wateringFreq === "Irregular") {
    coachSummary = "Your chilli plant may be slightly behind ideal growth because of low sunlight and inconsistent watering. Water soon, move it to a brighter spot if possible, and upload another photo in 3–4 days.";
  }

  // Health Score
  let healthScore = 85;
  if (sunlightStatus === "Low") healthScore -= 10;
  if (wateringStatus === "Due soon") healthScore -= 5;
  if (nutrientStatusText === "Needs review") healthScore -= 10;

  return {
    plant: {
      name: data.name || data.type,
      type: data.type,
      location: data.location,
      stage: stage,
      idealStage: idealStage,
      healthScore: healthScore,
      status: stageStatus === "Behind" ? "Slightly behind ideal growth" : "Growing well",
      lastPhotoCheck: "Just now",
      sunlightHours: data.sunlightHours,
      idealSunlight: "6–8 hrs/day",
      wateringStatus: wateringStatus,
      soilStatus: soilStatusText,
      nutrientStatus: nutrientStatusText,
      windExposure: data.windExposure,
      temperature: data.temperature,
      humidity: data.humidity,
      heatStressRisk: heatStressRisk,
      shadeRisk: data.shadeRisk,
    },
    comparisonData: [
      {
        metric: "Growth Stage",
        yours: stage,
        ideal: idealStage,
        status: stageStatus,
        statusColor: stageColor,
      },
      {
        metric: "Sunlight",
        yours: `${data.sunlightHours} hrs/day`,
        ideal: "6–8 hrs/day",
        status: sunlightStatus,
        statusColor: sunlightColor,
      },
      {
        metric: "Watering",
        yours: data.wateringFreq || "Regular",
        ideal: "Every 2–3 days",
        status: wateringStatus,
        statusColor: wateringColor,
      },
      {
        metric: "Soil",
        yours: data.soilCondition,
        ideal: "Lightly moist",
        status: soilStatusText === "Dry" ? "Needs water soon" : "Good",
        statusColor: soilColor,
      },
      {
        metric: "Nutrients",
        yours: data.compostAdded === "Yes" ? "Recently added" : "No recent fertilizer",
        ideal: "Light feeding every 2 weeks",
        status: nutrientStatusText,
        statusColor: nutrientColor,
      },
    ],
    careTimeline: [
      { date: "Today", event: "Setup PlantTwin profile", icon: "camera" as const },
      ...(data.lastWatered ? [{ date: data.lastWatered, event: "Watered", icon: "water" as const }] : []),
      ...(data.lastFertilizer ? [{ date: data.lastFertilizer, event: "Fertilizer added", icon: "nutrient" as const }] : []),
      ...(data.lastPesticide ? [{ date: data.lastPesticide, event: "Pesticide spray applied", icon: "pest" as const }] : []),
    ],
    reminders: [
      ...(wateringStatus === "Due soon" ? [{ text: "Water plant soon", timeframe: "Tomorrow", priority: "high" as const }] : []),
      ...(nutrientStatusText === "Needs review" ? [{ text: "Fertilizer check", timeframe: "In 3 days", priority: "medium" as const }] : []),
      { text: "Upload progress photo", timeframe: "In 7 days", priority: "low" as const },
    ],
    photoProgress: [
      { week: "Current", note: "Setup photo", image: data.photos.full || "/chilli-hero.png" },
    ],
    environmentData: [
      { label: "Location", value: data.location, icon: "location" as const },
      { label: "Est. Sunlight", value: `${data.sunlightHours} hrs/day`, icon: "sun" as const },
      { label: "Wind Exposure", value: data.windExposure, icon: "wind" as const },
      { label: "Temperature", value: data.temperature, icon: "temp" as const },
      { label: "Humidity", value: data.humidity, icon: "humidity" as const },
      { label: "Heat Stress Risk", value: heatStressRisk, icon: "heat" as const },
      { label: "Shade Risk", value: data.shadeRisk, icon: "shade" as const },
    ],
    coachData: {
      summary: coachSummary,
      confidence: "High",
      mainIssue: sunlightStatus === "Low" ? "Low sunlight" : "None",
      nextAction: wateringStatus === "Due soon" ? "Water soon" : "Monitor growth",
      followUp: "Upload photo in 3–4 days",
    },
  };
}
