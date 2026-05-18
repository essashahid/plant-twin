"use client";

import { Leaf, Camera, ClipboardList } from "lucide-react";
import { usePlant } from "@/context/PlantContext";
import { StatusTone } from "@/types/plant";

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
  const { dashboardData } = usePlant();
  const plant = dashboardData?.plant;

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
            <button className="inline-flex items-center gap-2 rounded-lg bg-surface-card px-3.5 py-2 text-sm font-medium text-text-primary ring-1 ring-surface-border transition-all hover:bg-surface-card-hover hover:ring-brand-500/20">
              <Camera className="h-4 w-4 text-text-muted" />
              Upload Photo
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-500 shadow-lg shadow-brand-600/20">
              <ClipboardList className="h-4 w-4" />
              Log Care
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
