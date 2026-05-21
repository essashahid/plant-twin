"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  DashboardData,
  PlantFormData,
  ProgressUpdate,
  CareLog,
  ReminderRecord,
  ReminderStatus,
  CareActionType,
} from "@/types/plant";
import { generatePlantInsights } from "@/utils/generatePlantInsights";
import {
  getPlantById,
  getProgressUpdates,
  getCareLogs,
  getReminders,
  createProgressUpdate,
  createCareLog,
  createReminders,
  saveGeneratedInsights,
  updateReminderStatus,
} from "@/lib/plantService";

interface PlantContextType {
  plantId: string | null;
  formData: PlantFormData | null;
  dashboardData: DashboardData | null;
  progressUpdates: ProgressUpdate[];
  careLogs: CareLog[];
  reminders: ReminderRecord[];
  loading: boolean;
  error: string | null;
  loadPlant: (id: string) => Promise<void>;
  addProgressUpdate: (update: ProgressUpdate) => Promise<void>;
  setReminderStatus: (id: string, status: ReminderStatus) => Promise<void>;
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

export function PlantProvider({ children }: { children: React.ReactNode }) {
  const [plantId, setPlantId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PlantFormData | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([]);
  const [careLogs, setCareLogs] = useState<CareLog[]>([]);
  const [reminders, setReminders] = useState<ReminderRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPlant = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const loaded = await getPlantById(id);
      if (!loaded) {
        setError("Plant not found.");
        setDashboardData(null);
        return;
      }
      const [updates, logs, rems] = await Promise.all([
        getProgressUpdates(id),
        getCareLogs(id),
        getReminders(id),
      ]);
      const dashboard = generatePlantInsights(loaded.formData, updates);
      setPlantId(id);
      setFormData(loaded.formData);
      setProgressUpdates(updates);
      setCareLogs(logs);
      setReminders(rems);
      setDashboardData({ ...dashboard, progressUpdates: updates });
    } catch (err) {
      console.error("PlantTwin: failed to load plant", err);
      setError("Could not load this plant. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const addProgressUpdate = useCallback(
    async (update: ProgressUpdate) => {
      if (!plantId || !formData) return;
      setError(null);
      try {
        // Provisional run to assign the health score recorded with the update.
        const provisional = generatePlantInsights(formData, [
          update,
          ...progressUpdates,
        ]);
        update.healthScore = provisional.plant.healthScore;

        const newId = await createProgressUpdate(plantId, update);
        const savedUpdate: ProgressUpdate = { ...update, id: newId };

        // Care logs from the actions in this update.
        const logEntries: { actionType: CareActionType; notes?: string }[] = [];
        if (savedUpdate.photos.plant)
          logEntries.push({ actionType: "photo_uploaded", notes: "Progress photo uploaded" });
        if (savedUpdate.wateredToday) logEntries.push({ actionType: "watered" });
        if (savedUpdate.fertilizedToday) logEntries.push({ actionType: "fertilized" });
        if (savedUpdate.compostAddedToday) logEntries.push({ actionType: "compost_added" });
        if (savedUpdate.pesticideAppliedToday)
          logEntries.push({ actionType: "pesticide_applied" });
        if (savedUpdate.visibleIssue !== "None")
          logEntries.push({
            actionType: "issue_reported",
            notes: savedUpdate.visibleIssue,
          });
        logEntries.push({ actionType: "soil_checked", notes: savedUpdate.soilCondition });
        for (const entry of logEntries) {
          await createCareLog(plantId, {
            actionType: entry.actionType,
            actionDate: savedUpdate.date,
            notes: entry.notes,
            progressUpdateId: newId,
          });
        }

        const newUpdates = [savedUpdate, ...progressUpdates];
        const dashboard = generatePlantInsights(formData, newUpdates);
        await saveGeneratedInsights(plantId, dashboard, newId);

        // Persist new reminders that aren't already pending (dedup by title).
        const pendingTitles = new Set(
          reminders.filter((r) => r.status === "pending").map((r) => r.title)
        );
        const freshReminders = dashboard.reminders.filter(
          (r) => !pendingTitles.has(r.text)
        );
        if (freshReminders.length > 0) {
          await createReminders(
            plantId,
            freshReminders.map((r) => ({
              title: r.text,
              description: r.timeframe,
              status: "pending" as const,
              source: "progress_update" as const,
              priority: r.priority,
            }))
          );
        }

        const [logs, rems] = await Promise.all([
          getCareLogs(plantId),
          getReminders(plantId),
        ]);
        setProgressUpdates(newUpdates);
        setCareLogs(logs);
        setReminders(rems);
        setDashboardData({ ...dashboard, progressUpdates: newUpdates });
      } catch (err) {
        console.error("PlantTwin: failed to save progress update", err);
        setError("Could not save this update. Please try again.");
      }
    },
    [plantId, formData, progressUpdates, reminders]
  );

  const setReminderStatus = useCallback(
    async (id: string, status: ReminderStatus) => {
      try {
        await updateReminderStatus(id, status);
        setReminders((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
      } catch (err) {
        console.error("PlantTwin: failed to update reminder", err);
      }
    },
    []
  );

  return (
    <PlantContext.Provider
      value={{
        plantId,
        formData,
        dashboardData,
        progressUpdates,
        careLogs,
        reminders,
        loading,
        error,
        loadPlant,
        addProgressUpdate,
        setReminderStatus,
      }}
    >
      {children}
    </PlantContext.Provider>
  );
}

export function usePlant() {
  const context = useContext(PlantContext);
  if (context === undefined) {
    throw new Error("usePlant must be used within a PlantProvider");
  }
  return context;
}
