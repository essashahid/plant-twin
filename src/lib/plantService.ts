import {
  PlantFormData,
  ProgressUpdate,
  CareLog,
  ReminderRecord,
  ReminderStatus,
  GeneratedInsightsRecord,
  PlantListItem,
  PlantLoadResult,
  DashboardData,
  RiskItem,
  ComparisonRow,
} from "@/types/plant";
import {
  PlantRow,
  PlantPhotoRow,
  ProgressUpdateRow,
  CareLogRow,
  ReminderRow,
  GeneratedInsightsRow,
  PhotoType,
  CareActionType,
} from "./dbTypes";
import { getBackend } from "./backend";
import {
  getDemoUserId,
  isSupabaseConfigured,
  supabase,
  PHOTO_BUCKET,
} from "./supabaseClient";
import { generatePlantInsights } from "@/utils/generatePlantInsights";

// ===========================================================================
// helpers
// ===========================================================================

const uuid = () => crypto.randomUUID();
const now = () => new Date().toISOString();
const emptyToNull = (s: string | undefined | null) =>
  s && String(s).trim() ? s : null;
const yesNo = (s: string) => (s === "Yes" ? true : s === "No" ? false : null);

function parseAgeWeeks(age: string): number | null {
  if (!age) return null;
  const m = age.toLowerCase().match(/(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  const t = age.toLowerCase();
  if (t.includes("month")) return Math.round(n * 4.3);
  if (t.includes("day")) return Math.max(1, Math.round(n / 7));
  if (t.includes("year")) return Math.round(n * 52);
  return Math.round(n);
}

/**
 * When Supabase Storage is available, uploads a data URL and returns the public
 * URL. Otherwise (or on any failure) returns the data URL unchanged so photos
 * still render. This is the single seam to swap in richer storage logic.
 */
async function persistPhoto(dataUrl: string, pathHint: string): Promise<string> {
  if (!dataUrl) return "";
  if (!isSupabaseConfigured || !supabase || !dataUrl.startsWith("data:")) {
    return dataUrl;
  }
  try {
    const blob = await (await fetch(dataUrl)).blob();
    const ext = (blob.type.split("/")[1] || "png").replace("+xml", "");
    const path = `${pathHint}-${uuid()}.${ext}`;
    const { error } = await supabase.storage
      .from(PHOTO_BUCKET)
      .upload(path, blob, { upsert: true, contentType: blob.type });
    if (error) throw error;
    return supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl;
  } catch (err) {
    console.warn("PlantTwin: photo storage upload failed, keeping data URL", err);
    return dataUrl;
  }
}

// ===========================================================================
// mappers
// ===========================================================================

function formDataToPlantRow(
  data: PlantFormData,
  id: string,
  userId: string
): PlantRow {
  const ts = now();
  return {
    id,
    user_id: userId,
    name: emptyToNull(data.name),
    type: data.type || "Chilli Plant",
    location_type: emptyToNull(data.location),
    city: emptyToNull(data.city),
    estimated_age_weeks: parseAgeWeeks(data.age),
    planted_date: emptyToNull(data.plantedDate),
    pot_size: emptyToNull(data.potSize),
    drainage_holes: yesNo(data.drainageHoles),
    soil_type: emptyToNull(data.soilType),
    soil_condition: emptyToNull(data.soilCondition),
    compost_added_recently: yesNo(data.compostAdded),
    sunlight_hours: data.sunlightHours === "" ? null : Number(data.sunlightHours),
    wind_exposure: emptyToNull(data.windExposure),
    shade_risk: emptyToNull(data.shadeRisk),
    temperature_feel: emptyToNull(data.temperature),
    humidity: emptyToNull(data.humidity),
    watering_frequency: emptyToNull(data.wateringFreq),
    last_watered: emptyToNull(data.lastWatered),
    last_fertilizer_date: emptyToNull(data.lastFertilizer),
    fertilizer_type: emptyToNull(data.fertilizerType),
    last_pesticide_date: emptyToNull(data.lastPesticide),
    notes: emptyToNull(data.careNotes),
    created_at: ts,
    updated_at: ts,
  };
}

const SETUP_PHOTO_MAP: Record<string, PhotoType> = {
  full: "full_plant",
  leaf: "leaf_closeup",
  soil: "soil",
  pot: "pot",
  area: "growing_area",
};

function plantRowToFormData(
  row: PlantRow,
  setupPhotos: PlantPhotoRow[]
): PlantFormData {
  const photos: PlantFormData["photos"] = {};
  for (const p of setupPhotos) {
    if (!p.image_url) continue;
    if (p.photo_type === "full_plant") photos.full = p.image_url;
    else if (p.photo_type === "leaf_closeup") photos.leaf = p.image_url;
    else if (p.photo_type === "soil") photos.soil = p.image_url;
    else if (p.photo_type === "pot") photos.pot = p.image_url;
    else if (p.photo_type === "growing_area") photos.area = p.image_url;
  }
  return {
    name: row.name ?? "",
    type: row.type,
    location: row.location_type ?? "",
    age: row.estimated_age_weeks != null ? `${row.estimated_age_weeks} weeks` : "",
    plantedDate: row.planted_date ?? "",
    potSize: row.pot_size ?? "",
    drainageHoles: row.drainage_holes == null ? "" : row.drainage_holes ? "Yes" : "No",
    soilType: row.soil_type ?? "",
    soilCondition: row.soil_condition ?? "",
    compostAdded:
      row.compost_added_recently == null ? "No" : row.compost_added_recently ? "Yes" : "No",
    sunlightHours: row.sunlight_hours == null ? "" : row.sunlight_hours,
    windExposure: row.wind_exposure ?? "",
    shadeRisk: row.shade_risk ?? "",
    temperature: row.temperature_feel ?? "",
    humidity: row.humidity ?? "",
    city: row.city ?? "",
    lastWatered: row.last_watered ?? "",
    wateringFreq: row.watering_frequency ?? "",
    lastFertilizer: row.last_fertilizer_date ?? "",
    fertilizerType: row.fertilizer_type ?? "",
    lastPesticide: row.last_pesticide_date ?? "",
    careNotes: row.notes ?? "",
    photos,
  };
}

function rowToProgressUpdate(
  row: ProgressUpdateRow,
  photos: PlantPhotoRow[]
): ProgressUpdate {
  const own = photos.filter((p) => p.progress_update_id === row.id);
  const find = (t: PhotoType) => own.find((p) => p.photo_type === t)?.image_url || undefined;
  return {
    id: row.id,
    date: row.date,
    photos: {
      plant: find("full_plant"),
      leaf: find("leaf_closeup"),
      soil: find("soil"),
    },
    notes: row.notes ?? "",
    soilCondition: (row.soil_condition as ProgressUpdate["soilCondition"]) ?? "Moist",
    wateredToday: row.watered_today,
    fertilizedToday: row.fertilized_today,
    compostAddedToday: row.compost_added_today,
    pesticideAppliedToday: row.pesticide_applied_today,
    visibleIssue: (row.visible_issue as ProgressUpdate["visibleIssue"]) ?? "None",
    overallCondition:
      (row.overall_condition as ProgressUpdate["overallCondition"]) ?? "Looks same",
    healthScore: row.health_score ?? 0,
  };
}

// ===========================================================================
// Plants
// ===========================================================================

export async function createPlant(data: PlantFormData): Promise<string> {
  const backend = getBackend();
  const id = uuid();
  const row = formDataToPlantRow(data, id, getDemoUserId());
  await backend.insertPlant(row);

  // Persist setup photos
  const photoRows: PlantPhotoRow[] = [];
  for (const [key, photoType] of Object.entries(SETUP_PHOTO_MAP)) {
    const dataUrl = data.photos[key as keyof PlantFormData["photos"]];
    if (!dataUrl) continue;
    const imageUrl = await persistPhoto(dataUrl, `${id}/setup-${key}`);
    photoRows.push({
      id: uuid(),
      plant_id: id,
      progress_update_id: null,
      photo_type: photoType,
      image_url: imageUrl,
      local_preview_url: null,
      created_at: now(),
    });
  }
  if (photoRows.length > 0) await backend.insertPhotos(photoRows);

  return id;
}

export async function getPlants(): Promise<PlantListItem[]> {
  const backend = getBackend();
  const rows = await backend.selectPlants(getDemoUserId());
  const items: PlantListItem[] = [];
  for (const row of rows) {
    const insight = await backend.selectLatestInsights(row.id);
    items.push({
      id: row.id,
      name: row.name || row.type,
      type: row.type,
      location: row.location_type ?? "",
      healthScore: insight?.health_score ?? null,
      status: insight?.status ?? null,
      updatedAt: row.updated_at,
    });
  }
  return items;
}

export async function getPlantById(id: string): Promise<PlantLoadResult | null> {
  const backend = getBackend();
  const row = await backend.selectPlant(id);
  if (!row) return null;
  const photos = await backend.selectPhotos(id);
  const setupPhotos = photos.filter((p) => p.progress_update_id == null);
  return {
    plantId: row.id,
    formData: plantRowToFormData(row, setupPhotos),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function updatePlant(
  id: string,
  data: PlantFormData
): Promise<void> {
  const backend = getBackend();
  const row = formDataToPlantRow(data, id, getDemoUserId());
  const { id: _id, created_at: _c, user_id: _u, ...patch } = row;
  void _id;
  void _c;
  void _u;
  await backend.updatePlant(id, patch);
}

export async function deletePlant(id: string): Promise<void> {
  await getBackend().deletePlant(id);
}

// ===========================================================================
// Progress updates
// ===========================================================================

export async function createProgressUpdate(
  plantId: string,
  data: ProgressUpdate
): Promise<string> {
  const backend = getBackend();
  const id = data.id && data.id.startsWith("update-") ? uuid() : data.id || uuid();
  const row: ProgressUpdateRow = {
    id,
    plant_id: plantId,
    date: data.date,
    notes: emptyToNull(data.notes),
    soil_condition: data.soilCondition,
    watered_today: data.wateredToday,
    fertilized_today: data.fertilizedToday,
    compost_added_today: data.compostAddedToday,
    pesticide_applied_today: data.pesticideAppliedToday,
    visible_issue: data.visibleIssue,
    overall_condition: data.overallCondition,
    health_score: data.healthScore,
    created_at: now(),
  };
  await backend.insertProgressUpdate(row);

  const photoRows: PlantPhotoRow[] = [];
  const photoEntries: [keyof ProgressUpdate["photos"], PhotoType][] = [
    ["plant", "full_plant"],
    ["leaf", "leaf_closeup"],
    ["soil", "soil"],
  ];
  for (const [key, photoType] of photoEntries) {
    const dataUrl = data.photos[key];
    if (!dataUrl) continue;
    const imageUrl = await persistPhoto(dataUrl, `${plantId}/${id}-${key}`);
    photoRows.push({
      id: uuid(),
      plant_id: plantId,
      progress_update_id: id,
      photo_type: photoType,
      image_url: imageUrl,
      local_preview_url: null,
      created_at: now(),
    });
  }
  if (photoRows.length > 0) await backend.insertPhotos(photoRows);

  return id;
}

export async function getProgressUpdates(
  plantId: string
): Promise<ProgressUpdate[]> {
  const backend = getBackend();
  const [rows, photos] = await Promise.all([
    backend.selectProgressUpdates(plantId),
    backend.selectPhotos(plantId),
  ]);
  return rows.map((r) => rowToProgressUpdate(r, photos));
}

// ===========================================================================
// Care logs
// ===========================================================================

export async function createCareLog(
  plantId: string,
  data: {
    actionType: CareActionType;
    actionDate: string;
    notes?: string;
    progressUpdateId?: string;
  }
): Promise<void> {
  const backend = getBackend();
  await backend.insertCareLog({
    id: uuid(),
    plant_id: plantId,
    progress_update_id: data.progressUpdateId ?? null,
    action_type: data.actionType,
    action_date: data.actionDate,
    notes: emptyToNull(data.notes),
    created_at: now(),
  });
}

export async function getCareLogs(plantId: string): Promise<CareLog[]> {
  const rows = await getBackend().selectCareLogs(plantId);
  return rows.map((r: CareLogRow) => ({
    id: r.id,
    actionType: r.action_type,
    actionDate: r.action_date,
    notes: r.notes ?? "",
  }));
}

// ===========================================================================
// Reminders
// ===========================================================================

export interface ReminderInput {
  title: string;
  description?: string;
  dueDate?: string | null;
  status?: ReminderStatus;
  source?: ReminderRow["source"];
  priority?: "high" | "medium" | "low";
}

function reminderInputToRow(plantId: string, input: ReminderInput): ReminderRow {
  const ts = now();
  return {
    id: uuid(),
    plant_id: plantId,
    title: input.title,
    description: input.description ?? null,
    due_date: input.dueDate ?? null,
    status: input.status ?? "pending",
    source: input.source ?? "rule_engine",
    priority: input.priority ?? "medium",
    created_at: ts,
    updated_at: ts,
  };
}

export async function createReminder(
  plantId: string,
  data: ReminderInput
): Promise<void> {
  await getBackend().insertReminders([reminderInputToRow(plantId, data)]);
}

export async function createReminders(
  plantId: string,
  items: ReminderInput[]
): Promise<void> {
  if (items.length === 0) return;
  await getBackend().insertReminders(
    items.map((i) => reminderInputToRow(plantId, i))
  );
}

export async function getReminders(plantId: string): Promise<ReminderRecord[]> {
  const rows = await getBackend().selectReminders(plantId);
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description ?? "",
    dueDate: r.due_date,
    status: r.status,
    source: r.source,
    priority: r.priority,
  }));
}

export async function updateReminderStatus(
  reminderId: string,
  status: ReminderStatus
): Promise<void> {
  await getBackend().updateReminder(reminderId, { status });
}

// ===========================================================================
// Generated insights
// ===========================================================================

export async function saveGeneratedInsights(
  plantId: string,
  dashboard: DashboardData,
  progressUpdateId?: string | null
): Promise<void> {
  const row: GeneratedInsightsRow = {
    id: uuid(),
    plant_id: plantId,
    progress_update_id: progressUpdateId ?? null,
    health_score: dashboard.plant.healthScore,
    status: dashboard.plant.status,
    growth_stage: dashboard.plant.stage,
    ideal_stage: dashboard.plant.idealStage,
    confidence: dashboard.coachData.confidence,
    main_issues: dashboard.issues,
    recommended_actions: dashboard.recommendedActions,
    risk_levels: dashboard.risks,
    actual_vs_ideal: dashboard.comparisonData,
    coach_message: dashboard.coachData.summary,
    created_at: now(),
  };
  await getBackend().insertInsights(row);
}

export async function getLatestGeneratedInsights(
  plantId: string
): Promise<GeneratedInsightsRecord | null> {
  const row = await getBackend().selectLatestInsights(plantId);
  if (!row) return null;
  return {
    healthScore: row.health_score ?? 0,
    status: row.status ?? "",
    growthStage: row.growth_stage ?? "",
    idealStage: row.ideal_stage ?? "",
    confidence: row.confidence ?? "",
    mainIssues: Array.isArray(row.main_issues) ? (row.main_issues as string[]) : [],
    recommendedActions: Array.isArray(row.recommended_actions)
      ? (row.recommended_actions as string[])
      : [],
    riskLevels: Array.isArray(row.risk_levels) ? (row.risk_levels as RiskItem[]) : [],
    actualVsIdeal: Array.isArray(row.actual_vs_ideal)
      ? (row.actual_vs_ideal as ComparisonRow[])
      : [],
    coachMessage: row.coach_message ?? "",
    createdAt: row.created_at,
  };
}

// ===========================================================================
// Orchestration
// ===========================================================================

/**
 * Full new-plant setup: persists the plant + photos, runs the rule engine,
 * saves the generated insights, and seeds reminders and care logs.
 * Returns the new plant id.
 */
export async function setupNewPlant(formData: PlantFormData): Promise<string> {
  const plantId = await createPlant(formData);
  const dashboard = generatePlantInsights(formData, []);
  await saveGeneratedInsights(plantId, dashboard, null);

  await createReminders(
    plantId,
    dashboard.reminders.map((r) => ({
      title: r.text,
      description: r.timeframe,
      status: "pending" as const,
      source: "setup" as const,
      priority: r.priority,
    }))
  );

  const today = new Date().toISOString().split("T")[0];
  const logs: {
    actionType: CareActionType;
    actionDate: string;
    notes?: string;
  }[] = [{ actionType: "photo_uploaded", actionDate: today, notes: "Setup PlantTwin profile" }];
  if (formData.lastWatered)
    logs.push({ actionType: "watered", actionDate: formData.lastWatered });
  if (formData.lastFertilizer)
    logs.push({
      actionType: "fertilized",
      actionDate: formData.lastFertilizer,
      notes: formData.fertilizerType || undefined,
    });
  if (formData.lastPesticide)
    logs.push({ actionType: "pesticide_applied", actionDate: formData.lastPesticide });
  if (formData.compostAdded === "Yes")
    logs.push({ actionType: "compost_added", actionDate: today });
  for (const log of logs) await createCareLog(plantId, log);

  return plantId;
}

export { isSupabaseConfigured };
