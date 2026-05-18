"use client";

import Image from "next/image";
import { Heart, Leaf, AlertCircle, Droplets, FlaskConical, Bug, CheckCircle2 } from "lucide-react";
import { ProgressUpdate } from "@/types/plant";

interface ProgressUpdateCardProps {
  update: ProgressUpdate;
}

const issueIcon: Record<ProgressUpdate["visibleIssue"], React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  None: CheckCircle2,
  "Yellow leaves": Leaf,
  "Drooping leaves": AlertCircle,
  "Dry soil": AlertCircle,
  "Wet soil": Droplets,
  "Spots on leaves": Leaf,
  "Pest signs": Bug,
  "Slow growth": AlertCircle,
  Wilting: AlertCircle,
};

const conditionColor: Record<ProgressUpdate["overallCondition"], string> = {
  "Looks better": "bg-status-good/10 text-status-good",
  "Looks same": "bg-status-info/10 text-status-info",
  "Looks worse": "bg-status-danger/10 text-status-danger",
};

export default function ProgressUpdateCard({ update }: ProgressUpdateCardProps) {
  const IssueIcon = issueIcon[update.visibleIssue] || AlertCircle;
  const formatDateShort = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  const actions = [];
  if (update.wateredToday) actions.push("Watered");
  if (update.fertilizedToday) actions.push("Fertilized");
  if (update.compostAddedToday) actions.push("Compost added");
  if (update.pesticideAppliedToday) actions.push("Pesticide applied");

  return (
    <div className="glass-card rounded-xl p-4 animate-fade-in-up">
      <div className="flex gap-4">
        {/* Photo */}
        {update.photos.plant && (
          <div className="relative w-24 h-24 rounded-lg overflow-hidden ring-1 ring-surface-border shrink-0">
            <Image
              src={update.photos.plant}
              alt="Update photo"
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm font-semibold text-text-primary">
                {formatDateShort(update.date)}
              </p>
              <p className="text-xs text-text-dim mt-0.5">
                Health: {update.healthScore}/100
              </p>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${conditionColor[update.overallCondition]}`}>
              {update.overallCondition}
            </span>
          </div>

          {/* Soil Condition */}
          <p className="text-xs text-text-muted mb-2">
            <span className="font-medium">Soil:</span> {update.soilCondition}
          </p>

          {/* Issue */}
          {update.visibleIssue !== "None" && (
            <div className="flex items-center gap-1.5 mb-2">
              <IssueIcon className="h-3.5 w-3.5 text-status-warning" />
              <span className="text-xs text-status-warning font-medium">
                {update.visibleIssue}
              </span>
            </div>
          )}

          {/* Actions */}
          {actions.length > 0 && (
            <p className="text-xs text-text-secondary mb-2">
              <span className="font-medium">Actions:</span> {actions.join(", ")}
            </p>
          )}

          {/* Notes */}
          {update.notes && (
            <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
              {update.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
