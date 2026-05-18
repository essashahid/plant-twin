"use client";

import Header from "@/components/Header";
import PlantTwinCard from "@/components/PlantTwinCard";
import HealthMetricCards from "@/components/HealthMetricCard";
import ActualVsIdealComparison from "@/components/ActualVsIdealComparison";
import PlantCoachCard from "@/components/PlantCoachCard";
import CareTimeline from "@/components/CareTimeline";
import ReminderPanel from "@/components/ReminderPanel";
import EnvironmentPanel from "@/components/EnvironmentPanel";
import FeatureTabs from "@/components/FeatureTabs";
import AddPlantFlow from "@/components/AddPlantFlow";
import RiskSummaryCard from "@/components/RiskSummaryCard";
import ProgressTimeline from "@/components/ProgressTimeline";
import PhotoProgressGridUpdated from "@/components/PhotoProgressGridUpdated";
import ProgressComparisonCard from "@/components/ProgressComparisonCard";
import HealthTrendCard from "@/components/HealthTrendCard";
import { usePlant } from "@/context/PlantContext";

export default function Home() {
  const { hasPlant, dashboardData } = usePlant();

  return (
    <main className="min-h-screen bg-surface-primary">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-600/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!hasPlant ? (
          <div className="space-y-6">
            <Header />
            <AddPlantFlow />
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in-up">
            {/* 1. Header */}
            <Header />

            {/* 2. Plant Twin Visual */}
            <PlantTwinCard />

            {/* 3. Health Metrics */}
            <HealthMetricCards />

            {/* 4. Actual vs Ideal + Coach (two-column on desktop) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActualVsIdealComparison />
              <PlantCoachCard />
            </div>

            {/* 4b. Risks & Recommendations */}
            <RiskSummaryCard />

            {/* 5. Timeline + Reminders (two-column on desktop) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CareTimeline />
              <ReminderPanel />
            </div>

            {/* 6. Environment */}
            <EnvironmentPanel />

            {/* 7. Photo Progress Grid Updated */}
            {dashboardData && (
              <PhotoProgressGridUpdated
                initialPhoto={dashboardData.plant.photoFull || "/chilli-hero.png"}
                progressUpdates={dashboardData.progressUpdates || []}
                healthScore={dashboardData.plant.healthScore}
              />
            )}

            {/* 9. Progress Comparison */}
            {dashboardData && (dashboardData.progressUpdates || []).length > 0 && (
              <ProgressComparisonCard
                previousUpdate={
                  (dashboardData.progressUpdates || []).length > 1
                    ? (dashboardData.progressUpdates || [])[1]
                    : null
                }
                currentUpdate={(dashboardData.progressUpdates || [])[0]!}
                initialHealthScore={dashboardData.plant.healthScore}
              />
            )}

            {/* 10. Health Trend */}
            {dashboardData && (
              <HealthTrendCard
                initialScore={dashboardData.plant.healthScore}
                currentScore={
                  (dashboardData.progressUpdates || []).length > 0
                    ? (dashboardData.progressUpdates || [])[0]!.healthScore
                    : dashboardData.plant.healthScore
                }
                progressUpdates={dashboardData.progressUpdates || []}
              />
            )}

            {/* 11. Progress Timeline */}
            {dashboardData && (dashboardData.progressUpdates || []).length > 0 && (
              <ProgressTimeline updates={dashboardData.progressUpdates || []} />
            )}

            {/* 12. Feature Tabs */}
            <FeatureTabs />

            {/* Footer */}
            <footer className="text-center py-6 border-t border-surface-border/30">
              <p className="text-xs text-text-dim">
                PlantTwin v0.2 · Progress Tracking · Built with 🌱
              </p>
            </footer>
          </div>
        )}
      </div>
    </main>
  );
}
