"use client";

import { ShieldAlert, CheckCircle2, Sparkles } from "lucide-react";
import { usePlant } from "@/context/PlantContext";

const levelStyles = {
  Low: "bg-status-good/10 text-status-good ring-status-good/20",
  Medium: "bg-status-warning/10 text-status-warning ring-status-warning/20",
  High: "bg-status-danger/10 text-status-danger ring-status-danger/20",
} as const;

export default function RiskSummaryCard() {
  const { dashboardData } = usePlant();
  if (!dashboardData) return null;
  const { risks, recommendedActions, positives } = dashboardData;

  const hasRisks = risks.length > 0;
  const hasActions = recommendedActions.length > 0;
  const hasPositives = positives.length > 0;

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in-up animate-delay-400">
      <div className="flex items-center gap-2 mb-1">
        <ShieldAlert className="h-4 w-4 text-brand-400" />
        <h3 className="text-lg font-semibold text-text-primary">
          Risks & Recommendations
        </h3>
      </div>
      <p className="text-xs text-text-muted mb-5">
        What to watch and what to do next
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h4 className="text-[11px] uppercase tracking-wider text-text-dim font-semibold mb-2.5">
            Risk levels
          </h4>
          {hasRisks ? (
            <ul className="space-y-2">
              {risks.slice(0, 4).map((r, i) => (
                <li
                  key={i}
                  className="rounded-lg bg-surface-primary/40 px-3 py-2.5 ring-1 ring-surface-border/40"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-medium text-text-primary">
                      {r.label}
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ring-1 ${levelStyles[r.level]}`}
                    >
                      {r.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-dim leading-relaxed">
                    {r.note}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-text-muted rounded-lg bg-surface-primary/40 px-3 py-2.5 ring-1 ring-surface-border/40">
              No major risks detected right now.
            </p>
          )}
        </div>

        <div>
          <h4 className="text-[11px] uppercase tracking-wider text-text-dim font-semibold mb-2.5">
            Recommended actions
          </h4>
          {hasActions ? (
            <ul className="space-y-2">
              {recommendedActions.map((a, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-lg bg-surface-primary/40 px-3 py-2.5 ring-1 ring-surface-border/40"
                >
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-400 shrink-0" />
                  <p className="text-xs text-text-secondary leading-relaxed">{a}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-text-muted rounded-lg bg-surface-primary/40 px-3 py-2.5 ring-1 ring-surface-border/40">
              Keep up the current routine.
            </p>
          )}
        </div>

        <div>
          <h4 className="text-[11px] uppercase tracking-wider text-text-dim font-semibold mb-2.5 flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" /> What's going well
          </h4>
          {hasPositives ? (
            <ul className="space-y-2">
              {positives.slice(0, 4).map((p, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-lg bg-surface-primary/40 px-3 py-2.5 ring-1 ring-surface-border/40"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-status-good shrink-0 mt-0.5" />
                  <p className="text-xs text-text-secondary leading-relaxed">{p}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-text-muted rounded-lg bg-surface-primary/40 px-3 py-2.5 ring-1 ring-surface-border/40">
              We'll highlight wins as your care routine builds up.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
