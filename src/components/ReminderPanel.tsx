"use client";

import { Bell, Check, X } from "lucide-react";
import { usePlant } from "@/context/PlantContext";

const priorityDot = {
  high: "bg-status-danger/10 text-status-danger ring-status-danger/20",
  medium: "bg-status-warning/10 text-status-warning ring-status-warning/20",
  low: "bg-brand-500/10 text-brand-400 ring-brand-500/20",
};

export default function ReminderPanel() {
  const { reminders, setReminderStatus } = usePlant();

  const pending = reminders.filter((r) => r.status === "pending");
  const completed = reminders.filter((r) => r.status === "completed");

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in-up animate-delay-600">
      <div className="flex items-center gap-2 mb-1">
        <Bell className="h-4 w-4 text-brand-400" />
        <h3 className="text-lg font-semibold text-text-primary">Reminders</h3>
      </div>
      <p className="text-xs text-text-muted mb-5">Upcoming care actions</p>

      {pending.length === 0 && completed.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-sm text-text-muted">No reminders yet.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {pending.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between rounded-lg bg-surface-primary/40 px-3.5 py-3 ring-1 ring-surface-border/40 group transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`inline-flex h-2 w-2 shrink-0 rounded-full ring-2 ${priorityDot[r.priority]}`}
                />
                <div className="min-w-0">
                  <p className="text-sm text-text-primary truncate">{r.title}</p>
                  {r.description && (
                    <p className="text-[11px] text-text-dim">{r.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setReminderStatus(r.id, "completed")}
                  title="Mark as done"
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-card ring-1 ring-surface-border text-text-muted transition-all hover:text-status-good hover:ring-status-good/30"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setReminderStatus(r.id, "dismissed")}
                  title="Dismiss"
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-card ring-1 ring-surface-border text-text-muted transition-all hover:text-status-danger hover:ring-status-danger/30"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}

          {completed.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-3 rounded-lg bg-surface-primary/20 px-3.5 py-2.5 ring-1 ring-surface-border/20"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-status-good/15">
                <Check className="h-3 w-3 text-status-good" />
              </span>
              <p className="text-sm text-text-dim line-through truncate">{r.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
