export const plant = {
  name: "Balcony Chilli Plant",
  type: "Chilli Plant",
  location: "Balcony",
  stage: "Early Vegetative",
  idealStage: "Early Flowering",
  healthScore: 72,
  status: "Slightly behind ideal growth",
  lastPhotoCheck: "2 days ago",
  sunlightHours: 4,
  idealSunlight: "6–8 hrs/day",
  wateringStatus: "Due Tomorrow",
  soilStatus: "Slightly dry",
  nutrientStatus: "Needs review",
  windExposure: "Medium",
  temperature: "Warm",
  humidity: "Moderate",
  heatStressRisk: "Low",
  shadeRisk: "Medium",
};

export const comparisonData = [
  {
    metric: "Growth Stage",
    yours: "Early vegetative",
    ideal: "Early flowering",
    status: "Behind",
    statusColor: "amber" as const,
  },
  {
    metric: "Sunlight",
    yours: "4 hrs/day",
    ideal: "6–8 hrs/day",
    status: "Low",
    statusColor: "red" as const,
  },
  {
    metric: "Watering",
    yours: "Irregular",
    ideal: "Every 2–3 days",
    status: "Needs consistency",
    statusColor: "amber" as const,
  },
  {
    metric: "Soil",
    yours: "Dry top layer",
    ideal: "Lightly moist",
    status: "Needs water soon",
    statusColor: "amber" as const,
  },
  {
    metric: "Nutrients",
    yours: "No recent fertilizer",
    ideal: "Light feeding every 2 weeks",
    status: "Review needed",
    statusColor: "red" as const,
  },
];

export const careTimeline = [
  { date: "Today", event: "Soil checked — top layer looked dry", icon: "soil" as const },
  { date: "2 days ago", event: "Plant photo uploaded", icon: "camera" as const },
  { date: "3 days ago", event: "Watered", icon: "water" as const },
  { date: "7 days ago", event: "Compost added", icon: "nutrient" as const },
  { date: "12 days ago", event: "Leaf photo uploaded", icon: "camera" as const },
  { date: "14 days ago", event: "Pesticide spray applied", icon: "pest" as const },
];

export const reminders = [
  { text: "Water plant tomorrow morning", timeframe: "Tomorrow", priority: "high" as const },
  { text: "Upload leaf close-up", timeframe: "In 3 days", priority: "medium" as const },
  { text: "Fertilizer check", timeframe: "In 5 days", priority: "medium" as const },
  { text: "Pest inspection", timeframe: "In 7 days", priority: "low" as const },
];

export const photoProgress = [
  { week: "Week 1", note: "Recently transplanted", image: "/chilli-week1.png" },
  { week: "Week 2", note: "New leaves appeared", image: "/chilli-week2.png" },
  { week: "Week 3", note: "Slight yellowing noticed", image: "/chilli-week3.png" },
  { week: "Current", note: "Growth slower than expected", image: "/chilli-hero.png" },
];

export const environmentData = [
  { label: "Location", value: "Balcony", icon: "location" as const },
  { label: "Est. Sunlight", value: "4 hrs/day", icon: "sun" as const },
  { label: "Wind Exposure", value: "Medium", icon: "wind" as const },
  { label: "Temperature", value: "Warm", icon: "temp" as const },
  { label: "Humidity", value: "Moderate", icon: "humidity" as const },
  { label: "Heat Stress Risk", value: "Low", icon: "heat" as const },
  { label: "Shade Risk", value: "Medium", icon: "shade" as const },
];

export const coachData = {
  summary:
    "Your chilli plant appears slightly behind the expected growth stage. The most likely reasons are low sunlight and inconsistent watering. Water tomorrow morning, move the plant to a brighter spot if possible, and upload another photo in 3–4 days.",
  confidence: "Medium",
  mainIssue: "Low sunlight + irregular watering",
  nextAction: "Water tomorrow morning",
  followUp: "Upload photo in 3–4 days",
};
