"use client";

import { Bell, ChevronRight } from "lucide-react";
import { reminders } from "@/data/plantData";

const priorityStyles = {
  high: "bg-status-danger/10 text-status-danger ring-status-danger/20",
  medium: "bg-status-warning/10 text-status-warning ring-status-warning/20",
  low: "bg-brand-500/10 text-brand-400 ring-brand-500/20",
};

export default function ReminderPanel() {
  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in-up animate-delay-600">
      <div className="flex items-center gap-2 mb-1">
        <Bell className="h-4 w-4 text-brand-400" />
        <h3 className="text-lg font-semibold text-text-primary">Reminders</h3>
      </div>
      <p className="text-xs text-text-muted mb-5">Upcoming care actions</p>
      <div className="space-y-2.5">
        {reminders.map((r, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg bg-surface-primary/40 px-3.5 py-3 ring-1 ring-surface-border/40 hover:bg-surface-card-hover/30 group cursor-pointer transition-all"
          >
            <div className="flex items-center gap-3">
              <span className={`inline-flex h-2 w-2 rounded-full ring-2 ${priorityStyles[r.priority]}`} />
              <div>
                <p className="text-sm text-text-primary">{r.text}</p>
                <p className="text-[11px] text-text-dim">{r.timeframe}</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-text-dim group-hover:text-text-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
