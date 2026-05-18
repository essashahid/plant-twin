"use client";

import { useState } from "react";
import { Leaf, Camera, ClipboardList, Plus } from "lucide-react";
import { usePlant } from "@/context/PlantContext";
import { StatusTone, ProgressUpdate } from "@/types/plant";
import AddProgressUpdateModal from "./AddProgressUpdateModal";
import { generatePlantInsights } from "@/utils/generatePlantInsights";

const statusPillTone: Record<StatusTone, string> = {
  good: "bg-status-good/10 text-status-good ring-status-good/20",
  warning: "bg-status-warning/10 text-status-warning ring-status-warning/20",
  danger: "bg-status-danger/10 text-status-danger ring-status-danger/20",
  info: "bg-status-info/10 text-status-info ring-status-info/20",
};

const statusDotTone: Record<StatusTone, string> = {
  good: "bg-status-good",
  warning: "bg-status-warning",
  danger: "bg-status-danger",
  info: "bg-status-info",
};

export default function Header() {
  const { dashboardData, setDashboardData, progressUpdates, addProgressUpdate } = usePlant();
  const [showModal, setShowModal] = useState(false);
  const plant = dashboardData?.plant;

  const handleSaveProgressUpdate = (update: ProgressUpdate) => {
    // Calculate health score based on the update and current state
    let score = Math.max(35, Math.min(98, plant?.healthScore ?? 85));
    if (update.overallCondition === "Looks better") score += 8;
    if (update.overallCondition === "Looks worse") score -= 8;
    update.healthScore = score;

    addProgressUpdate(update);
    setShowModal(false);

    // Regenerate dashboard with new progress update
    if (dashboardData) {
      const updatedFormData = {
        name: dashboardData.plant.name,
        type: dashboardData.plant.type,
        location: dashboardData.plant.location,
        age: `${dashboardData.plant.ageWeeks} weeks`,
        plantedDate: "",
        potSize: "",
        drainageHoles: "",
        soilType: "",
        soilCondition: update.soilCondition,
        compostAdded: update.compostAddedToday ? "Yes" : "No",
        sunlightHours: dashboardData.plant.sunlightHours,
        windExposure: dashboardData.plant.windExposure,
        shadeRisk: dashboardData.plant.shadeRisk,
        temperature: dashboardData.plant.temperature,
        humidity: dashboardData.plant.humidity,
        city: "",
        lastWatered: "",
        wateringFreq: "",
        lastFertilizer: "",
        fertilizerType: "",
        lastPesticide: "",
        careNotes: "",
        photos: {
          full: dashboardData.plant.photoFull,
        },
      };

      const updatedDashboard = generatePlantInsights(
        updatedFormData,
        [update, ...progressUpdates]
      );
      setDashboardData(updatedDashboard);
    }
  };

  return (
    <header className="animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Logo + Plant Info */}
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 ring-1 ring-brand-500/20">
            <Leaf className="h-5 w-5 text-brand-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-text-primary tracking-tight">
                PlantTwin
              </h1>
              {plant && (
                <>
                  <span className="text-text-dim">·</span>
                  <span className="text-sm text-text-muted">{plant.type}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <h2 className="text-sm font-medium text-text-secondary">
                {plant ? plant.name : "Setup New Plant"}
              </h2>
              {plant && (
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${statusPillTone[plant.statusTone]}`}>
                  <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${statusDotTone[plant.statusTone]}`} />
                  {plant.status}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {plant && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-500 shadow-lg shadow-brand-600/20"
            >
              <Plus className="h-4 w-4" />
              Add Progress Update
            </button>
          </div>
        )}

        <AddProgressUpdateModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveProgressUpdate}
        />
      </div>
    </header>
  );
}
