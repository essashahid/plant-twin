import { supabase, isSupabaseConfigured } from "./supabaseClient";
import {
  PlantRow,
  PlantPhotoRow,
  ProgressUpdateRow,
  CareLogRow,
  ReminderRow,
  GeneratedInsightsRow,
  ReminderStatus,
} from "./dbTypes";

/**
 * Storage-agnostic data layer. Both implementations speak the same row shapes
 * so plantService never needs to know which backend is active.
 */
export interface Backend {
  insertPlant(row: PlantRow): Promise<PlantRow>;
  selectPlants(userId: string): Promise<PlantRow[]>;
  selectPlant(id: string): Promise<PlantRow | null>;
  updatePlant(id: string, patch: Partial<PlantRow>): Promise<PlantRow>;
  deletePlant(id: string): Promise<void>;

  insertProgressUpdate(row: ProgressUpdateRow): Promise<ProgressUpdateRow>;
  selectProgressUpdates(plantId: string): Promise<ProgressUpdateRow[]>;

  insertCareLog(row: CareLogRow): Promise<CareLogRow>;
  selectCareLogs(plantId: string): Promise<CareLogRow[]>;

  insertReminders(rows: ReminderRow[]): Promise<ReminderRow[]>;
  selectReminders(plantId: string): Promise<ReminderRow[]>;
  updateReminder(id: string, patch: Partial<ReminderRow>): Promise<ReminderRow>;

  insertInsights(row: GeneratedInsightsRow): Promise<GeneratedInsightsRow>;
  selectLatestInsights(plantId: string): Promise<GeneratedInsightsRow | null>;

  insertPhotos(rows: PlantPhotoRow[]): Promise<PlantPhotoRow[]>;
  selectPhotos(plantId: string): Promise<PlantPhotoRow[]>;
}

// ===========================================================================
// localStorage backend
// ===========================================================================

const KEYS = {
  plants: "planttwin:plants",
  photos: "planttwin:plant_photos",
  progress: "planttwin:progress_updates",
  careLogs: "planttwin:care_logs",
  reminders: "planttwin:reminders",
  insights: "planttwin:generated_insights",
} as const;

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, rows: T[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(rows));
  } catch (err) {
    // Most likely a quota error from large base64 photos — keep the app alive.
    console.warn("PlantTwin: localStorage write failed", err);
  }
}

class LocalBackend implements Backend {
  async insertPlant(row: PlantRow): Promise<PlantRow> {
    const rows = read<PlantRow>(KEYS.plants);
    rows.push(row);
    write(KEYS.plants, rows);
    return row;
  }

  async selectPlants(userId: string): Promise<PlantRow[]> {
    return read<PlantRow>(KEYS.plants)
      .filter((p) => p.user_id === userId)
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  }

  async selectPlant(id: string): Promise<PlantRow | null> {
    return read<PlantRow>(KEYS.plants).find((p) => p.id === id) ?? null;
  }

  async updatePlant(id: string, patch: Partial<PlantRow>): Promise<PlantRow> {
    const rows = read<PlantRow>(KEYS.plants);
    const idx = rows.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Plant not found");
    rows[idx] = { ...rows[idx], ...patch, updated_at: new Date().toISOString() };
    write(KEYS.plants, rows);
    return rows[idx];
  }

  async deletePlant(id: string): Promise<void> {
    write(
      KEYS.plants,
      read<PlantRow>(KEYS.plants).filter((p) => p.id !== id)
    );
    write(
      KEYS.progress,
      read<ProgressUpdateRow>(KEYS.progress).filter((r) => r.plant_id !== id)
    );
    write(
      KEYS.careLogs,
      read<CareLogRow>(KEYS.careLogs).filter((r) => r.plant_id !== id)
    );
    write(
      KEYS.reminders,
      read<ReminderRow>(KEYS.reminders).filter((r) => r.plant_id !== id)
    );
    write(
      KEYS.insights,
      read<GeneratedInsightsRow>(KEYS.insights).filter((r) => r.plant_id !== id)
    );
    write(
      KEYS.photos,
      read<PlantPhotoRow>(KEYS.photos).filter((r) => r.plant_id !== id)
    );
  }

  async insertProgressUpdate(row: ProgressUpdateRow): Promise<ProgressUpdateRow> {
    const rows = read<ProgressUpdateRow>(KEYS.progress);
    rows.push(row);
    write(KEYS.progress, rows);
    return row;
  }

  async selectProgressUpdates(plantId: string): Promise<ProgressUpdateRow[]> {
    return read<ProgressUpdateRow>(KEYS.progress)
      .filter((r) => r.plant_id === plantId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  async insertCareLog(row: CareLogRow): Promise<CareLogRow> {
    const rows = read<CareLogRow>(KEYS.careLogs);
    rows.push(row);
    write(KEYS.careLogs, rows);
    return row;
  }

  async selectCareLogs(plantId: string): Promise<CareLogRow[]> {
    return read<CareLogRow>(KEYS.careLogs)
      .filter((r) => r.plant_id === plantId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  async insertReminders(newRows: ReminderRow[]): Promise<ReminderRow[]> {
    const rows = read<ReminderRow>(KEYS.reminders);
    rows.push(...newRows);
    write(KEYS.reminders, rows);
    return newRows;
  }

  async selectReminders(plantId: string): Promise<ReminderRow[]> {
    return read<ReminderRow>(KEYS.reminders)
      .filter((r) => r.plant_id === plantId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  async updateReminder(id: string, patch: Partial<ReminderRow>): Promise<ReminderRow> {
    const rows = read<ReminderRow>(KEYS.reminders);
    const idx = rows.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error("Reminder not found");
    rows[idx] = { ...rows[idx], ...patch, updated_at: new Date().toISOString() };
    write(KEYS.reminders, rows);
    return rows[idx];
  }

  async insertInsights(row: GeneratedInsightsRow): Promise<GeneratedInsightsRow> {
    const rows = read<GeneratedInsightsRow>(KEYS.insights);
    rows.push(row);
    write(KEYS.insights, rows);
    return row;
  }

  async selectLatestInsights(plantId: string): Promise<GeneratedInsightsRow | null> {
    const rows = read<GeneratedInsightsRow>(KEYS.insights)
      .filter((r) => r.plant_id === plantId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
    return rows[0] ?? null;
  }

  async insertPhotos(newRows: PlantPhotoRow[]): Promise<PlantPhotoRow[]> {
    const rows = read<PlantPhotoRow>(KEYS.photos);
    rows.push(...newRows);
    write(KEYS.photos, rows);
    return newRows;
  }

  async selectPhotos(plantId: string): Promise<PlantPhotoRow[]> {
    return read<PlantPhotoRow>(KEYS.photos).filter((r) => r.plant_id === plantId);
  }
}

// ===========================================================================
// Supabase backend
// ===========================================================================

class SupabaseBackend implements Backend {
  private get db() {
    if (!supabase) throw new Error("Supabase client unavailable");
    return supabase;
  }

  async insertPlant(row: PlantRow): Promise<PlantRow> {
    const { data, error } = await this.db.from("plants").insert(row).select().single();
    if (error) throw error;
    return data as PlantRow;
  }

  async selectPlants(userId: string): Promise<PlantRow[]> {
    const { data, error } = await this.db
      .from("plants")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as PlantRow[];
  }

  async selectPlant(id: string): Promise<PlantRow | null> {
    const { data, error } = await this.db.from("plants").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return (data as PlantRow) ?? null;
  }

  async updatePlant(id: string, patch: Partial<PlantRow>): Promise<PlantRow> {
    const { data, error } = await this.db
      .from("plants")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as PlantRow;
  }

  async deletePlant(id: string): Promise<void> {
    const { error } = await this.db.from("plants").delete().eq("id", id);
    if (error) throw error;
  }

  async insertProgressUpdate(row: ProgressUpdateRow): Promise<ProgressUpdateRow> {
    const { data, error } = await this.db
      .from("progress_updates")
      .insert(row)
      .select()
      .single();
    if (error) throw error;
    return data as ProgressUpdateRow;
  }

  async selectProgressUpdates(plantId: string): Promise<ProgressUpdateRow[]> {
    const { data, error } = await this.db
      .from("progress_updates")
      .select("*")
      .eq("plant_id", plantId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as ProgressUpdateRow[];
  }

  async insertCareLog(row: CareLogRow): Promise<CareLogRow> {
    const { data, error } = await this.db.from("care_logs").insert(row).select().single();
    if (error) throw error;
    return data as CareLogRow;
  }

  async selectCareLogs(plantId: string): Promise<CareLogRow[]> {
    const { data, error } = await this.db
      .from("care_logs")
      .select("*")
      .eq("plant_id", plantId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as CareLogRow[];
  }

  async insertReminders(rows: ReminderRow[]): Promise<ReminderRow[]> {
    if (rows.length === 0) return [];
    const { data, error } = await this.db.from("reminders").insert(rows).select();
    if (error) throw error;
    return (data ?? []) as ReminderRow[];
  }

  async selectReminders(plantId: string): Promise<ReminderRow[]> {
    const { data, error } = await this.db
      .from("reminders")
      .select("*")
      .eq("plant_id", plantId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as ReminderRow[];
  }

  async updateReminder(id: string, patch: Partial<ReminderRow>): Promise<ReminderRow> {
    const { data, error } = await this.db
      .from("reminders")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as ReminderRow;
  }

  async insertInsights(row: GeneratedInsightsRow): Promise<GeneratedInsightsRow> {
    const { data, error } = await this.db
      .from("generated_insights")
      .insert(row)
      .select()
      .single();
    if (error) throw error;
    return data as GeneratedInsightsRow;
  }

  async selectLatestInsights(plantId: string): Promise<GeneratedInsightsRow | null> {
    const { data, error } = await this.db
      .from("generated_insights")
      .select("*")
      .eq("plant_id", plantId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return (data as GeneratedInsightsRow) ?? null;
  }

  async insertPhotos(rows: PlantPhotoRow[]): Promise<PlantPhotoRow[]> {
    if (rows.length === 0) return [];
    const { data, error } = await this.db.from("plant_photos").insert(rows).select();
    if (error) throw error;
    return (data ?? []) as PlantPhotoRow[];
  }

  async selectPhotos(plantId: string): Promise<PlantPhotoRow[]> {
    const { data, error } = await this.db
      .from("plant_photos")
      .select("*")
      .eq("plant_id", plantId);
    if (error) throw error;
    return (data ?? []) as PlantPhotoRow[];
  }
}

let backendInstance: Backend | null = null;

export function getBackend(): Backend {
  if (!backendInstance) {
    backendInstance = isSupabaseConfigured ? new SupabaseBackend() : new LocalBackend();
  }
  return backendInstance;
}

export type { ReminderStatus };
