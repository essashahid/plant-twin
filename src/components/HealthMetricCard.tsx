"use client";

import { Heart, Sprout, Droplets, Sun } from "lucide-react";
import { plant } from "@/data/plantData";

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  accent: string;
  delay: string;
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  accent,
  delay,
}: MetricCardProps) {
  return (
    <div className={`glass-card rounded-xl p-5 animate-fade-in-up ${delay} group`}>
      <div className="flex items-start justify-between mb-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent}`}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wider text-text-dim">
          {title}
        </span>
      </div>
      <p className="text-2xl font-bold text-text-primary mb-1.5 group-hover:glow-text transition-all">
        {value}
      </p>
      <p className="text-xs text-text-muted leading-relaxed">{description}</p>
    </div>
  );
}

export default function HealthMetricCards() {
  const metrics = [
    {
      title: "Health Score",
      value: `${plant.healthScore}/100`,
      description:
        "Plant looks stable, but growth is slower than expected for this stage.",
      icon: Heart,
      accent: "bg-brand-500/15 text-brand-400 ring-1 ring-brand-500/20",
      delay: "animate-delay-200",
    },
    {
      title: "Growth Stage",
      value: plant.stage,
      description:
        "Currently in early vegetative. Should ideally be approaching early flowering by now.",
      icon: Sprout,
      accent: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20",
      delay: "animate-delay-300",
    },
    {
      title: "Watering",
      value: plant.wateringStatus,
      description:
        "Next watering is due tomorrow. Maintain a regular 2–3 day schedule.",
      icon: Droplets,
      accent: "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/20",
      delay: "animate-delay-400",
    },
    {
      title: "Sunlight",
      value: `${plant.sunlightHours} hrs/day`,
      description:
        "Below the ideal 6–8 hours. Consider moving to a sunnier spot.",
      icon: Sun,
      accent: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20",
      delay: "animate-delay-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <MetricCard key={m.title} {...m} />
      ))}
    </div>
  );
}
