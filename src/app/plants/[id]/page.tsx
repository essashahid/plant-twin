"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { Loader2, AlertCircle } from "lucide-react";
import { usePlant } from "@/context/PlantContext";
import Header from "@/components/Header";
import PlantTwinCard from "@/components/PlantTwinCard";
import HealthMetricCards from "@/components/HealthMetricCard";
import ActualVsIdealComparison from "@/components/ActualVsIdealComparison";
import PlantCoachCard from "@/components/PlantCoachCard";
import CareTimeline from "@/components/CareTimeline";
import ReminderPanel from "@/components/ReminderPanel";
import EnvironmentPanel from "@/components/EnvironmentPanel";
import FeatureTabs from "@/components/FeatureTabs";
import RiskSummaryCard from "@/components/RiskSummaryCard";
import ProgressTimeline from "@/components/ProgressTimeline";
import PhotoProgressGridUpdated from "@/components/PhotoProgressGridUpdated";
import ProgressComparisonCard from "@/components/ProgressComparisonCard";
import HealthTrendCard from "@/components/HealthTrendCard";

export default function PlantDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { dashboardData, progressUpdates, loading, error, loadPlant } = usePlant();

  useEffect(() => {
    loadPlant(id);
  }, [id, loadPlant]);

  return (
    <main className="min-h-screen bg-surface-primary">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-600/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading || (!dashboardData && !error) ? (
          <div className="flex flex-col items-center justify-center py-32 animate-fade-in-up">
            <Loader2 className="h-6 w-6 text-brand-400 animate-spin mb-3" />
            <p className="text-sm text-text-muted">Loading plant dashboard…</p>
          </div>
        ) : error || !dashboardData ? (
          <div className="flex flex-col items-center justify-center py-32 animate-fade-in-up">
            <AlertCircle className="h-7 w-7 text-status-danger mb-3" />
            <p className="text-sm text-text-muted mb-4">
              {error || "This plant could not be found."}
            </p>
            <Link
              href="/plants"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-500"
            >
              Back to all plants
            </Link>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in-up">
            <Header />
            <PlantTwinCard />
            <HealthMetricCards />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActualVsIdealComparison />
              <PlantCoachCard />
            </div>

            <RiskSummaryCard />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CareTimeline />
              <ReminderPanel />
            </div>

            <EnvironmentPanel />

            <PhotoProgressGridUpdated
              initialPhoto={dashboardData.plant.photoFull || "/chilli-hero.png"}
              progressUpdates={progressUpdates}
              healthScore={dashboardData.plant.healthScore}
            />

            {progressUpdates.length > 0 && (
              <ProgressComparisonCard
                previousUpdate={progressUpdates.length > 1 ? progressUpdates[1] : null}
                currentUpdate={progressUpdates[0]}
                initialHealthScore={dashboardData.plant.healthScore}
              />
            )}

            <HealthTrendCard
              initialScore={dashboardData.plant.healthScore}
              currentScore={
                progressUpdates.length > 0
                  ? progressUpdates[0].healthScore
                  : dashboardData.plant.healthScore
              }
              progressUpdates={progressUpdates}
            />

            {progressUpdates.length > 0 && (
              <ProgressTimeline updates={progressUpdates} />
            )}

            <FeatureTabs />

            <footer className="text-center py-6 border-t border-surface-border/30">
              <p className="text-xs text-text-dim">
                PlantTwin v0.3 · Persistent Storage · Built with 🌱
              </p>
            </footer>
          </div>
        )}
      </div>
    </main>
  );
}
