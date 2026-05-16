"use client";

import { Droplets, Camera, Sprout, Bug, FlaskConical } from "lucide-react";
import { usePlant } from "@/context/PlantContext";

const iconMap = {
  water: Droplets,
  camera: Camera,
  soil: Sprout,
  nutrient: FlaskConical,
  pest: Bug,
};

const colorMap = {
  water: "bg-blue-500/15 text-blue-400 ring-blue-500/20",
  camera: "bg-purple-500/15 text-purple-400 ring-purple-500/20",
  soil: "bg-amber-500/15 text-amber-400 ring-amber-500/20",
  nutrient: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/20",
  pest: "bg-red-500/15 text-red-400 ring-red-500/20",
};

export default function CareTimeline() {
  const { dashboardData } = usePlant();
  if (!dashboardData) return null;
  const { careTimeline } = dashboardData;

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in-up animate-delay-500">
      <h3 className="text-lg font-semibold text-text-primary mb-1">
        Care Timeline
      </h3>
      <p className="text-xs text-text-muted mb-5">Recent care activity</p>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-px timeline-line" />

        <div className="space-y-4">
          {careTimeline.map((entry, i) => {
            const Icon = iconMap[entry.icon as keyof typeof iconMap] || iconMap.camera;
            return (
              <div key={i} className="flex items-start gap-4 relative group">
                <div
                  className={`relative z-10 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg ring-1 ${colorMap[entry.icon as keyof typeof colorMap] || colorMap.camera} transition-all group-hover:scale-110`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="pt-1">
                  <p className="text-sm text-text-primary">{entry.event}</p>
                  <p className="text-[11px] text-text-dim mt-0.5">
                    {entry.date}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
