"use client";

import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { ProgressUpdate } from "@/types/plant";

interface ProgressComparisonCardProps {
  previousUpdate: ProgressUpdate | null;
  currentUpdate: ProgressUpdate;
  initialHealthScore: number;
}

export default function ProgressComparisonCard({
  previousUpdate,
  currentUpdate,
  initialHealthScore,
}: ProgressComparisonCardProps) {
  const prevScore = previousUpdate ? previousUpdate.healthScore : initialHealthScore;
  const currScore = currentUpdate.healthScore;
  const scoreDiff = currScore - prevScore;
  const isImproving = scoreDiff >= 0;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "2-digit" });
  };

  let summary = "";
  if (isImproving && scoreDiff > 5) {
    const actions = [];
    if (currentUpdate.wateredToday) actions.push("watering");
    if (currentUpdate.compostAddedToday) actions.push("adding compost");
    if (currentUpdate.overallCondition === "Looks better") actions.push("improving condition");
    const actionStr = actions.length > 0 ? ` after ${actions.join(" and ")}` : "";
    summary = `Your plant's health improved by +${scoreDiff} points${actionStr}. Continue monitoring and upload another photo in 3–4 days.`;
  } else if (isImproving && scoreDiff > 0) {
    summary = `Your plant is stable with a slight improvement (+${scoreDiff}). Keep the current routine and monitor for further progress.`;
  } else if (scoreDiff === 0) {
    summary = `Your plant's health score remained steady. Monitor the ${currentUpdate.visibleIssue !== "None" ? `${currentUpdate.visibleIssue.toLowerCase()} and ` : ""}continue care.`;
  } else {
    const reasons = [];
    if (currentUpdate.visibleIssue !== "None") reasons.push(currentUpdate.visibleIssue.toLowerCase());
    if (currentUpdate.soilCondition === "Dry" || currentUpdate.soilCondition === "Wet") {
      reasons.push(currentUpdate.soilCondition.toLowerCase() + " soil");
    }
    const reasonStr = reasons.length > 0 ? ` (${reasons.join(" and ")})` : "";
    summary = `Your plant's health declined by ${Math.abs(scoreDiff)} points${reasonStr}. Priority: address watering and nutrients, then check again in 3 days.`;
  }

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in-up">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-text-primary">Progress Comparison</h3>
        <p className="text-xs text-text-muted mt-0.5">Previous check-in vs now</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Previous */}
        <div className="rounded-xl bg-surface-primary/40 p-4 ring-1 ring-surface-border/40">
          <p className="text-[11px] uppercase tracking-wider text-text-dim font-semibold mb-3">
            Previous Check-in
          </p>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-text-dim">Date</p>
              <p className="text-sm font-medium text-text-primary">
                {previousUpdate ? formatDate(previousUpdate.date) : "Initial setup"}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-dim">Health Score</p>
              <p className="text-sm font-medium text-text-primary">{prevScore}/100</p>
            </div>
            <div>
              <p className="text-xs text-text-dim">Soil</p>
              <p className="text-sm font-medium text-text-primary">
                {previousUpdate ? previousUpdate.soilCondition : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-dim">Main Issue</p>
              <p className="text-sm font-medium text-text-primary">
                {previousUpdate && previousUpdate.visibleIssue !== "None"
                  ? previousUpdate.visibleIssue
                  : "None noted"}
              </p>
            </div>
          </div>
        </div>

        {/* Current */}
        <div className="rounded-xl bg-surface-primary/40 p-4 ring-1 ring-surface-border/40">
          <p className="text-[11px] uppercase tracking-wider text-text-dim font-semibold mb-3">
            Current Check-in
          </p>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-text-dim">Date</p>
              <p className="text-sm font-medium text-text-primary">{formatDate(currentUpdate.date)}</p>
            </div>
            <div>
              <p className="text-xs text-text-dim">Health Score</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-text-primary">{currScore}/100</p>
                {scoreDiff !== 0 && (
                  <div className="flex items-center gap-0.5">
                    {isImproving ? (
                      <>
                        <TrendingUp className="h-3.5 w-3.5 text-status-good" />
                        <span className="text-xs font-medium text-status-good">+{scoreDiff}</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-3.5 w-3.5 text-status-danger" />
                        <span className="text-xs font-medium text-status-danger">{scoreDiff}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs text-text-dim">Soil</p>
              <p className="text-sm font-medium text-text-primary">{currentUpdate.soilCondition}</p>
            </div>
            <div>
              <p className="text-xs text-text-dim">Main Issue</p>
              <p className="text-sm font-medium text-text-primary">
                {currentUpdate.visibleIssue !== "None" ? currentUpdate.visibleIssue : "None noted"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-lg bg-brand-500/5 border border-brand-500/20 px-4 py-3">
        <p className="text-sm text-text-secondary leading-relaxed">{summary}</p>
      </div>
    </div>
  );
}
