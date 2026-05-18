"use client";

import { ProgressUpdate } from "@/types/plant";
import ProgressUpdateCard from "./ProgressUpdateCard";

interface ProgressTimelineProps {
  updates: ProgressUpdate[];
}

export default function ProgressTimeline({ updates }: ProgressTimelineProps) {
  if (updates.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-fade-in-up">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-text-primary">Progress Timeline</h3>
          <p className="text-xs text-text-muted mt-0.5">Track plant updates over time</p>
        </div>
        <div className="text-center py-12">
          <p className="text-sm text-text-muted">
            No progress updates yet. Click "Add Progress Update" to start tracking changes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in-up">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-text-primary">Progress Timeline</h3>
        <p className="text-xs text-text-muted mt-0.5">
          {updates.length} update{updates.length !== 1 ? "s" : ""} recorded
        </p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[15px] top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/50 to-brand-500/10" />

        <div className="space-y-4">
          {updates.map((update, i) => (
            <div key={update.id} className="relative pl-10">
              {/* Timeline dot */}
              <div className="absolute left-0 top-2 h-[30px] w-[30px] flex items-center justify-center rounded-lg bg-brand-500/15 ring-1 ring-brand-500/30 text-brand-400">
                <span className="text-xs font-bold">{i + 1}</span>
              </div>

              {/* Card */}
              <ProgressUpdateCard update={update} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
