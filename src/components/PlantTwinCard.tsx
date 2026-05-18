"use client";

import Image from "next/image";
import {
  Droplets,
  Sun,
  Sprout,
  FlaskConical,
  TrendingDown,
  TrendingUp,
  Clock,
  Heart,
} from "lucide-react";
import { usePlant } from "@/context/PlantContext";
import { StatusTone } from "@/types/plant";

function HealthRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative flex items-center justify-center">
      <svg width="130" height="130" className="health-ring -rotate-90">
        <circle
          cx="65"
          cy="65"
          r={radius}
          fill="none"
          stroke="rgba(34, 197, 94, 0.08)"
          strokeWidth="8"
        />
        <circle
          cx="65"
          cy="65"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-text-primary glow-text">
          {score}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
          Health
        </span>
      </div>
    </div>
  );
}

const toneToIndicator: Record<StatusTone, "good" | "warning" | "danger"> = {
  good: "good",
  warning: "warning",
  danger: "danger",
  info: "warning",
};

function Indicator({
  icon: Icon,
  label,
  value,
  status,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  status: "good" | "warning" | "danger";
}) {
  const statusColors = {
    good: "text-status-good bg-status-good/10 ring-status-good/20",
    warning: "text-status-warning bg-status-warning/10 ring-status-warning/20",
    danger: "text-status-danger bg-status-danger/10 ring-status-danger/20",
  };

  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-surface-card/60 px-3 py-2 ring-1 ring-surface-border/50">
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-md ring-1 ${statusColors[status]}`}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div>
        <p className="text-[11px] text-text-dim">{label}</p>
        <p className="text-xs font-medium text-text-primary">{value}</p>
      </div>
    </div>
  );
}

export default function PlantTwinCard() {
  const { dashboardData } = usePlant();
  if (!dashboardData) return null;
  const { plant } = dashboardData;

  const stageOnTrack = plant.stage === plant.idealStage;
  const TrendIcon = stageOnTrack ? TrendingUp : TrendingDown;
  const trendColor = stageOnTrack ? "text-status-good" : "text-status-warning";
  const trendLabel = stageOnTrack ? "On track" : "Behind ideal stage";

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in-up animate-delay-100">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            Your Plant Twin
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Digital mirror of your real plant
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-text-dim">
          <Clock className="h-3 w-3" />
          Last photo: {plant.lastPhotoCheck}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <div className="relative rounded-xl overflow-hidden bg-surface-primary ring-1 ring-surface-border group">
          <div className="aspect-[4/3] relative">
            <Image
              src={plant.photoFull || "/chilli-hero.png"}
              alt={plant.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-primary/80 via-transparent to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Sprout className="h-3.5 w-3.5 text-brand-400" />
                  <span className="text-xs font-medium text-brand-300">
                    {plant.stage}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendIcon className={`h-3.5 w-3.5 ${trendColor}`} />
                  <span className="text-xs text-text-muted">{trendLabel}</span>
                </div>
              </div>
              <HealthRing score={plant.healthScore} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="h-4 w-4 text-brand-400" />
            <h4 className="text-sm font-semibold text-text-primary">
              Live Status
            </h4>
          </div>

          <Indicator
            icon={Droplets}
            label="Soil Moisture"
            value={plant.soilStatus}
            status={toneToIndicator[plant.soilTone]}
          />
          <Indicator
            icon={Sun}
            label="Sunlight"
            value={plant.sunlightLabel}
            status={toneToIndicator[plant.sunlightTone]}
          />
          <Indicator
            icon={Droplets}
            label="Watering"
            value={plant.wateringStatus}
            status={toneToIndicator[plant.wateringTone]}
          />
          <Indicator
            icon={FlaskConical}
            label="Nutrients"
            value={plant.nutrientStatus}
            status={toneToIndicator[plant.nutrientTone]}
          />

          <div className="mt-auto rounded-lg bg-brand-500/5 px-3 py-2.5 ring-1 ring-brand-500/10">
            <p className="text-[11px] text-text-muted leading-relaxed">
              <span className="text-brand-400 font-medium">Tip:</span> Upload a
              new photo to get an updated health assessment from your Plant Coach.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
