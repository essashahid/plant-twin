"use client";

import { ArrowRight, AlertTriangle, XCircle, CheckCircle2, Info } from "lucide-react";
import { usePlant } from "@/context/PlantContext";
import { StatusTone } from "@/types/plant";

const toneStyles: Record<StatusTone, { text: string; Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }> = {
  good: { text: "text-status-good", Icon: CheckCircle2 },
  warning: { text: "text-status-warning", Icon: AlertTriangle },
  danger: { text: "text-status-danger", Icon: XCircle },
  info: { text: "text-status-info", Icon: Info },
};

export default function ActualVsIdealComparison() {
  const { dashboardData } = usePlant();
  if (!dashboardData) return null;
  const { comparisonData } = dashboardData;

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in-up animate-delay-300">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-text-primary">
          Actual vs Ideal
        </h3>
        <p className="text-xs text-text-muted mt-0.5">
          How your plant compares against optimal growth benchmarks
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border">
              <th className="pb-3 pr-4 text-left text-[11px] font-medium uppercase tracking-wider text-text-dim">
                Metric
              </th>
              <th className="pb-3 px-4 text-left text-[11px] font-medium uppercase tracking-wider text-text-dim">
                Your Plant
              </th>
              <th className="pb-3 px-4 text-center text-text-dim">
                <ArrowRight className="h-3 w-3 mx-auto" />
              </th>
              <th className="pb-3 px-4 text-left text-[11px] font-medium uppercase tracking-wider text-text-dim">
                Ideal
              </th>
              <th className="pb-3 pl-4 text-right text-[11px] font-medium uppercase tracking-wider text-text-dim">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, i) => {
              const { text, Icon } = toneStyles[row.statusTone];
              return (
                <tr
                  key={row.metric}
                  className={`group transition-colors hover:bg-surface-card-hover/30 ${
                    i < comparisonData.length - 1
                      ? "border-b border-surface-border/50"
                      : ""
                  }`}
                >
                  <td className="py-3.5 pr-4 align-top">
                    <p className="font-medium text-text-primary">{row.metric}</p>
                    {row.note && (
                      <p className="text-[11px] text-text-dim mt-0.5 max-w-[220px]">
                        {row.note}
                      </p>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-text-muted align-top">{row.yours}</td>
                  <td className="py-3.5 px-4 text-center align-top">
                    <ArrowRight className="h-3 w-3 text-text-dim mx-auto" />
                  </td>
                  <td className="py-3.5 px-4 text-brand-300 align-top">{row.ideal}</td>
                  <td className="py-3.5 pl-4 align-top">
                    <div className="flex items-center justify-end gap-1.5">
                      <Icon className={`h-3.5 w-3.5 ${text}`} />
                      <span className={`text-xs font-medium ${text}`}>
                        {row.status}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
