"use client";

import { TrendingUp } from "lucide-react";
import { ProgressUpdate } from "@/types/plant";

interface HealthTrendCardProps {
  initialScore: number;
  currentScore: number;
  progressUpdates: ProgressUpdate[];
}

export default function HealthTrendCard({
  initialScore,
  currentScore,
  progressUpdates,
}: HealthTrendCardProps) {
  const trendPoints = [
    { label: "Initial", score: initialScore },
    ...progressUpdates
      .slice()
      .reverse()
      .map((update, i) => ({
        label:
          progressUpdates.length - i === 1
            ? "Latest"
            : `Update ${progressUpdates.length - i}`,
        score: update.healthScore,
      })),
  ];

  const maxScore = Math.max(...trendPoints.map((p) => p.score), 100);
  const minScore = Math.min(...trendPoints.map((p) => p.score), 35);
  const range = maxScore - minScore;

  const getScoreStatus = (score: number) => {
    if (score >= 85) return { label: "Healthy", color: "bg-status-good" };
    if (score >= 70) return { label: "Stable", color: "bg-status-warning" };
    if (score >= 55) return { label: "Stressed", color: "bg-status-warning" };
    return { label: "Urgent", color: "bg-status-danger" };
  };

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp className="h-4 w-4 text-brand-400" />
        <h3 className="text-lg font-semibold text-text-primary">Health Trend</h3>
      </div>
      <p className="text-xs text-text-muted mb-5">Score progression over time</p>

      {trendPoints.length > 1 ? (
        <>
          {/* Chart */}
          <div className="mb-6">
            <div className="flex items-end gap-2 h-40 justify-between">
              {trendPoints.map((point, i) => {
                const heightPercent =
                  range > 0
                    ? ((point.score - minScore) / range) * 100
                    : 50;
                const status = getScoreStatus(point.score);
                const isLatest = i === trendPoints.length - 1;

                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div className="w-full flex justify-center">
                      <div
                        className={`rounded-t-lg transition-all ${status.color} ${
                          isLatest ? "w-full" : "w-3/4"
                        }`}
                        style={{ height: `${Math.max(heightPercent, 5)}%` }}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-semibold text-text-primary">
                        {point.score}
                      </p>
                      <p className="text-[9px] text-text-dim mt-0.5">
                        {point.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-surface-primary/40 px-3 py-2.5 ring-1 ring-surface-border/40">
              <p className="text-[10px] uppercase tracking-wider text-text-dim font-semibold">
                Start
              </p>
              <p className="text-sm font-bold text-text-primary mt-1">
                {trendPoints[0].score}
              </p>
            </div>
            <div className="rounded-lg bg-surface-primary/40 px-3 py-2.5 ring-1 ring-surface-border/40">
              <p className="text-[10px] uppercase tracking-wider text-text-dim font-semibold">
                Current
              </p>
              <p className="text-sm font-bold text-text-primary mt-1">
                {currentScore}
              </p>
            </div>
            <div className="rounded-lg bg-surface-primary/40 px-3 py-2.5 ring-1 ring-surface-border/40">
              <p className="text-[10px] uppercase tracking-wider text-text-dim font-semibold">
                Change
              </p>
              <p
                className={`text-sm font-bold mt-1 ${
                  currentScore > trendPoints[0].score
                    ? "text-status-good"
                    : currentScore < trendPoints[0].score
                    ? "text-status-danger"
                    : "text-text-primary"
                }`}
              >
                {currentScore > trendPoints[0].score
                  ? `+${currentScore - trendPoints[0].score}`
                  : currentScore < trendPoints[0].score
                  ? currentScore - trendPoints[0].score
                  : "—"}
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-sm text-text-muted">
            Add progress updates to see the trend over time.
          </p>
        </div>
      )}
    </div>
  );
}
