"use client";

import Link from "next/link";
import { Leaf, Heart, ArrowRight, Clock } from "lucide-react";
import { PlantListItem } from "@/types/plant";

function healthColor(score: number | null): string {
  if (score == null) return "text-text-dim";
  if (score >= 80) return "text-status-good";
  if (score >= 60) return "text-status-warning";
  return "text-status-danger";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function PlantCard({ plant }: { plant: PlantListItem }) {
  return (
    <Link
      href={`/plants/${plant.id}`}
      className="glass-card rounded-2xl p-5 animate-fade-in-up group block transition-all hover:ring-1 hover:ring-brand-500/30"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 ring-1 ring-brand-500/20">
            <Leaf className="h-5 w-5 text-brand-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-primary">{plant.name}</h3>
            <p className="text-xs text-text-muted">
              {plant.type}
              {plant.location ? ` · ${plant.location}` : ""}
            </p>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-text-dim transition-transform group-hover:translate-x-0.5 group-hover:text-brand-400" />
      </div>

      <div className="flex items-center justify-between rounded-lg bg-surface-primary/40 px-3.5 py-3 ring-1 ring-surface-border/40">
        <div className="flex items-center gap-2">
          <Heart className={`h-4 w-4 ${healthColor(plant.healthScore)}`} />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-text-dim">Health</p>
            <p className={`text-sm font-bold ${healthColor(plant.healthScore)}`}>
              {plant.healthScore != null ? `${plant.healthScore}/100` : "Not assessed"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-text-dim">Status</p>
          <p className="text-xs font-medium text-text-secondary max-w-[160px] truncate">
            {plant.status || "Pending"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-3 text-[11px] text-text-dim">
        <Clock className="h-3 w-3" />
        Updated {formatDate(plant.updatedAt)}
      </div>
    </Link>
  );
}
