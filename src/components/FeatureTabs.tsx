"use client";

import { Camera, Droplets, FlaskConical, Bug, TrendingUp, Settings } from "lucide-react";

const tabs = [
  { label: "Photos", icon: Camera },
  { label: "Watering", icon: Droplets },
  { label: "Fertilizer", icon: FlaskConical },
  { label: "Pesticides", icon: Bug },
  { label: "Growth", icon: TrendingUp },
  { label: "Settings", icon: Settings },
];

export default function FeatureTabs() {
  return (
    <div className="animate-fade-in-up animate-delay-800">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className="inline-flex items-center gap-2 rounded-lg bg-surface-card px-4 py-2.5 text-sm font-medium text-text-muted ring-1 ring-surface-border transition-all hover:bg-surface-card-hover hover:text-text-primary hover:ring-brand-500/20"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>
      <p className="text-[11px] text-text-dim mt-2">
        More features coming soon — these sections are under development.
      </p>
    </div>
  );
}
