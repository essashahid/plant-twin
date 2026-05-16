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

export interface DashboardData {
  plant: any;
  comparisonData: any[];
  careTimeline: any[];
  reminders: any[];
  photoProgress: any[];
  environmentData: any[];
  coachData: any;
}
