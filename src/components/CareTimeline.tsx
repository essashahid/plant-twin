"use client";

import { Droplets, Camera, Sprout, Bug, FlaskConical, Eye } from "lucide-react";
import { usePlant } from "@/context/PlantContext";
import { CareActionType, CareLog } from "@/types/plant";

const iconMap: Record<CareActionType, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  watered: Droplets,
  fertilized: FlaskConical,
  compost_added: Sprout,
  pesticide_applied: Bug,
  photo_uploaded: Camera,
  issue_reported: Eye,
  soil_checked: Sprout,
};

const colorMap: Record<CareActionType, string> = {
  watered: "bg-blue-500/15 text-blue-400 ring-blue-500/20",
  fertilized: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/20",
  compost_added: "bg-amber-500/15 text-amber-400 ring-amber-500/20",
  pesticide_applied: "bg-red-500/15 text-red-400 ring-red-500/20",
  photo_uploaded: "bg-purple-500/15 text-purple-400 ring-purple-500/20",
  issue_reported: "bg-amber-500/15 text-amber-400 ring-amber-500/20",
  soil_checked: "bg-amber-500/15 text-amber-400 ring-amber-500/20",
};

function describe(log: CareLog): string {
  switch (log.actionType) {
    case "watered":
      return "Watered";
    case "fertilized":
      return log.notes ? `Fertilizer added (${log.notes})` : "Fertilizer added";
    case "compost_added":
      return "Compost added";
    case "pesticide_applied":
      return "Pesticide applied";
    case "photo_uploaded":
      return log.notes || "Photo uploaded";
    case "issue_reported":
      return `Observed: ${log.notes || "issue noted"}`;
    case "soil_checked":
      return log.notes ? `Soil checked — ${log.notes}` : "Soil checked";
    default:
      return "Care activity";
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function CareTimeline() {
  const { careLogs } = usePlant();

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in-up animate-delay-500">
      <h3 className="text-lg font-semibold text-text-primary mb-1">Care Timeline</h3>
      <p className="text-xs text-text-muted mb-5">Recent care activity</p>

      {careLogs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-sm text-text-muted">No care activity logged yet.</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-[15px] top-2 bottom-2 w-px timeline-line" />
          <div className="space-y-4">
            {careLogs.map((log) => {
              const Icon = iconMap[log.actionType] || Camera;
              return (
                <div key={log.id} className="flex items-start gap-4 relative group">
                  <div
                    className={`relative z-10 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg ring-1 ${colorMap[log.actionType] || colorMap.photo_uploaded} transition-all group-hover:scale-110`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="pt-1">
                    <p className="text-sm text-text-primary">{describe(log)}</p>
                    <p className="text-[11px] text-text-dim mt-0.5">
                      {formatDate(log.actionDate)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
