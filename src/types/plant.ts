export interface PlantFormData {
  name: string;
  type: string;
  location: string;
  age: string;
  plantedDate: string;

  potSize: string;
  drainageHoles: string;
  soilType: string;
  soilCondition: string;
  compostAdded: string;

  sunlightHours: number | "";
  windExposure: string;
  shadeRisk: string;
  temperature: string;
  humidity: string;
  city: string;

  lastWatered: string;
  wateringFreq: string;
  lastFertilizer: string;
  fertilizerType: string;
  lastPesticide: string;
  careNotes: string;

  photos: {
    full?: string;
    leaf?: string;
    soil?: string;
    pot?: string;
    area?: string;
  };
}

export type StatusTone = "good" | "warning" | "danger" | "info";

export interface PlantSummary {
  name: string;
  type: string;
  location: string;
  stage: string;
  idealStage: string;
  ageWeeks: number;
  healthScore: number;
  status: string;
  statusTone: StatusTone;
  lastPhotoCheck: string;
  sunlightHours: number | "";
  sunlightLabel: string;
  sunlightTone: StatusTone;
  idealSunlight: string;
  wateringStatus: string;
  wateringTone: StatusTone;
  soilStatus: string;
  soilTone: StatusTone;
  nutrientStatus: string;
  nutrientTone: StatusTone;
  windExposure: string;
  temperature: string;
  humidity: string;
  heatStressRisk: string;
  shadeRisk: string;
  photoFull?: string;
}

export interface ComparisonRow {
  metric: string;
  yours: string;
  ideal: string;
  status: string;
  statusTone: StatusTone;
  note?: string;
}

export interface TimelineEntry {
  date: string;
  event: string;
  icon: "water" | "camera" | "soil" | "nutrient" | "pest";
}

export interface Reminder {
  text: string;
  timeframe: string;
  priority: "high" | "medium" | "low";
}

export interface PhotoProgressItem {
  week: string;
  note: string;
  image: string;
}

export interface EnvironmentItem {
  label: string;
  value: string;
  icon: "location" | "sun" | "wind" | "temp" | "humidity" | "heat" | "shade";
}

export interface RiskItem {
  label: string;
  level: "Low" | "Medium" | "High";
  note: string;
}

export interface CoachData {
  summary: string;
  confidence: "Low" | "Medium" | "High";
  mainIssue: string;
  nextAction: string;
  followUp: string;
}

export interface DashboardData {
  plant: PlantSummary;
  comparisonData: ComparisonRow[];
  careTimeline: TimelineEntry[];
  reminders: Reminder[];
  photoProgress: PhotoProgressItem[];
  environmentData: EnvironmentItem[];
  coachData: CoachData;
  issues: string[];
  recommendedActions: string[];
  risks: RiskItem[];
  positives: string[];
}
