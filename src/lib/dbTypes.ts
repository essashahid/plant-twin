// Row shapes that mirror the Supabase tables (snake_case columns).
// Both the Supabase and localStorage backends deal exclusively in these rows;
// plantService maps them to/from the camelCase app types.

export interface PlantRow {
  id: string;
  user_id: string;
  name: string | null;
  type: string;
  location_type: string | null;
  city: string | null;
  estimated_age_weeks: number | null;
  planted_date: string | null;
  pot_size: string | null;
  drainage_holes: boolean | null;
  soil_type: string | null;
  soil_condition: string | null;
  compost_added_recently: boolean | null;
  sunlight_hours: number | null;
  wind_exposure: string | null;
  shade_risk: string | null;
  temperature_feel: string | null;
  humidity: string | null;
  watering_frequency: string | null;
  last_watered: string | null;
  last_fertilizer_date: string | null;
  fertilizer_type: string | null;
  last_pesticide_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type PhotoType =
  | "full_plant"
  | "leaf_closeup"
  | "soil"
  | "pot"
  | "growing_area";

export interface PlantPhotoRow {
  id: string;
  plant_id: string;
  progress_update_id: string | null;
  photo_type: PhotoType;
  image_url: string | null;
  local_preview_url: string | null;
  created_at: string;
}

export interface ProgressUpdateRow {
  id: string;
  plant_id: string;
  date: string;
  notes: string | null;
  soil_condition: string | null;
  watered_today: boolean;
  fertilized_today: boolean;
  compost_added_today: boolean;
  pesticide_applied_today: boolean;
  visible_issue: string | null;
  overall_condition: string | null;
  health_score: number | null;
  created_at: string;
}

export type CareActionType =
  | "watered"
  | "fertilized"
  | "compost_added"
  | "pesticide_applied"
  | "photo_uploaded"
  | "issue_reported"
  | "soil_checked";

export interface CareLogRow {
  id: string;
  plant_id: string;
  progress_update_id: string | null;
  action_type: CareActionType;
  action_date: string;
  notes: string | null;
  created_at: string;
}

export type ReminderStatus = "pending" | "completed" | "dismissed";
export type ReminderSource = "setup" | "rule_engine" | "progress_update" | "manual";

export interface ReminderRow {
  id: string;
  plant_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: ReminderStatus;
  source: ReminderSource;
  priority: "high" | "medium" | "low";
  created_at: string;
  updated_at: string;
}

export interface GeneratedInsightsRow {
  id: string;
  plant_id: string;
  progress_update_id: string | null;
  health_score: number | null;
  status: string | null;
  growth_stage: string | null;
  ideal_stage: string | null;
  confidence: string | null;
  main_issues: unknown;
  recommended_actions: unknown;
  risk_levels: unknown;
  actual_vs_ideal: unknown;
  coach_message: string | null;
  created_at: string;
}
