"use client";

import { MapPin, Sun, Wind, Thermometer, Droplets, Flame, CloudOff } from "lucide-react";
import { environmentData } from "@/data/plantData";

const iconMap = {
  location: MapPin,
  sun: Sun,
  wind: Wind,
  temp: Thermometer,
  humidity: Droplets,
  heat: Flame,
  shade: CloudOff,
};

export default function EnvironmentPanel() {
  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in-up animate-delay-700">
      <h3 className="text-lg font-semibold text-text-primary mb-1">Environment</h3>
      <p className="text-xs text-text-muted mb-5">Growing conditions overview</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {environmentData.map((item, i) => {
          const Icon = iconMap[item.icon];
          return (
            <div key={i} className="flex items-center gap-2.5 rounded-lg bg-surface-primary/40 px-3 py-2.5 ring-1 ring-surface-border/30">
              <Icon className="h-4 w-4 text-text-muted shrink-0" />
              <div>
                <p className="text-[10px] text-text-dim uppercase tracking-wider">{item.label}</p>
                <p className="text-sm font-medium text-text-primary">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
