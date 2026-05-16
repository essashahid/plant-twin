"use client";

import { Bot, Zap, AlertCircle, ArrowRight, CalendarCheck } from "lucide-react";
import { usePlant } from "@/context/PlantContext";

export default function PlantCoachCard() {
  const { dashboardData } = usePlant();
  if (!dashboardData) return null;
  const { coachData } = dashboardData;

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in-up animate-delay-400 relative overflow-hidden">
      {/* Subtle AI glow */}
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-brand-500/5 blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/15 ring-1 ring-brand-500/20">
            <Bot className="h-4.5 w-4.5 text-brand-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Plant Coach
            </h3>
            <p className="text-[11px] text-text-dim">
              AI-powered insights · Updated 2 hrs ago
            </p>
          </div>
        </div>

        {/* Main advice */}
        <div className="rounded-xl bg-surface-primary/50 p-4 mb-4 ring-1 ring-surface-border/50">
          <p className="text-sm text-text-secondary leading-relaxed">
            &ldquo;{coachData.summary}&rdquo;
          </p>
        </div>

        {/* Detail grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg bg-surface-card/40 px-3 py-2.5 ring-1 ring-surface-border/30">
            <div className="flex items-center gap-1.5 mb-1">
              <Zap className="h-3 w-3 text-status-warning" />
              <span className="text-[10px] uppercase tracking-wider text-text-dim">
                Confidence
              </span>
            </div>
            <p className="text-sm font-semibold text-status-warning">
              {coachData.confidence}
            </p>
          </div>

          <div className="rounded-lg bg-surface-card/40 px-3 py-2.5 ring-1 ring-surface-border/30">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertCircle className="h-3 w-3 text-status-danger" />
              <span className="text-[10px] uppercase tracking-wider text-text-dim">
                Main Issue
              </span>
            </div>
            <p className="text-sm font-medium text-text-primary">
              {coachData.mainIssue}
            </p>
          </div>

          <div className="rounded-lg bg-surface-card/40 px-3 py-2.5 ring-1 ring-surface-border/30">
            <div className="flex items-center gap-1.5 mb-1">
              <ArrowRight className="h-3 w-3 text-brand-400" />
              <span className="text-[10px] uppercase tracking-wider text-text-dim">
                Next Action
              </span>
            </div>
            <p className="text-sm font-medium text-text-primary">
              {coachData.nextAction}
            </p>
          </div>

          <div className="rounded-lg bg-surface-card/40 px-3 py-2.5 ring-1 ring-surface-border/30">
            <div className="flex items-center gap-1.5 mb-1">
              <CalendarCheck className="h-3 w-3 text-status-info" />
              <span className="text-[10px] uppercase tracking-wider text-text-dim">
                Follow-up
              </span>
            </div>
            <p className="text-sm font-medium text-text-primary">
              {coachData.followUp}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
