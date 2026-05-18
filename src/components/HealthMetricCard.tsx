"use client";

import { Heart, Sprout, Droplets, Sun } from "lucide-react";
import { usePlant } from "@/context/PlantContext";
import { StatusTone } from "@/types/plant";

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

const accentForTone: Record<StatusTone, string> = {
  good: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20",
  warning: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20",
  danger: "bg-red-500/15 text-red-400 ring-1 ring-red-500/20",
  info: "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/20",
};

export default function HealthMetricCards() {
  const { dashboardData } = usePlant();
  if (!dashboardData) return null;
  const { plant } = dashboardData;

  const healthDescription =
    plant.healthScore >= 85
      ? "Healthy and tracking ideal growth — keep the routine going."
      : plant.healthScore >= 70
      ? "Stable, but a few care factors need attention soon."
      : plant.healthScore >= 55
      ? "Stressed — adjust the top issues to recover quickly."
      : "Needs urgent care. Review the top recommendations.";

  const stageDescription =
    plant.stage === plant.idealStage
      ? `On track for the ${plant.idealStage.toLowerCase()} stage.`
      : `Currently ${plant.stage.toLowerCase()} — expected to be ${plant.idealStage.toLowerCase()}.`;

  const wateringDescription =
    plant.wateringTone === "danger"
      ? "Watering is overdue — give it a drink today."
      : plant.wateringTone === "warning"
      ? "Watering due soon. Aim for a steady 2–3 day rhythm."
      : "Watering rhythm looks healthy.";

  const sunlightValue =
    plant.sunlightHours === "" ? "Not set" : `${plant.sunlightHours} hrs/day`;
  const sunlightDescription =
    plant.sunlightTone === "danger"
      ? "Well below the ideal 6–8 hours. Move to a brighter spot if possible."
      : plant.sunlightTone === "warning"
      ? "Slightly under ideal. Growth may be a touch slower."
      : plant.sunlightTone === "good"
      ? "Right in the chilli sweet spot."
      : "Add a sunlight estimate to refine insights.";

  const metrics = [
    {
      title: "Health Score",
      value: `${plant.healthScore}/100`,
      description: healthDescription,
      icon: Heart,
      accent: accentForTone[plant.statusTone],
      delay: "animate-delay-200",
    },
    {
      title: "Growth Stage",
      value: plant.stage,
      description: stageDescription,
      icon: Sprout,
      accent: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20",
      delay: "animate-delay-300",
    },
    {
      title: "Watering",
      value: plant.wateringStatus,
      description: wateringDescription,
      icon: Droplets,
      accent: accentForTone[plant.wateringTone],
      delay: "animate-delay-400",
    },
    {
      title: "Sunlight",
      value: sunlightValue,
      description: sunlightDescription,
      icon: Sun,
      accent: accentForTone[plant.sunlightTone],
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
