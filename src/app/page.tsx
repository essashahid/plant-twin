import Header from "@/components/Header";
import PlantTwinCard from "@/components/PlantTwinCard";
import HealthMetricCards from "@/components/HealthMetricCard";
import ActualVsIdealComparison from "@/components/ActualVsIdealComparison";
import PlantCoachCard from "@/components/PlantCoachCard";
import CareTimeline from "@/components/CareTimeline";
import ReminderPanel from "@/components/ReminderPanel";
import PhotoProgressGrid from "@/components/PhotoProgressGrid";
import EnvironmentPanel from "@/components/EnvironmentPanel";
import FeatureTabs from "@/components/FeatureTabs";

export default function Home() {
  return (
    <main className="min-h-screen bg-surface-primary">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-600/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-6">
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

          {/* 5. Timeline + Reminders (two-column on desktop) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CareTimeline />
            <ReminderPanel />
          </div>

          {/* 6. Photo Progress */}
          <PhotoProgressGrid />

          {/* 7. Environment */}
          <EnvironmentPanel />

          {/* 8. Feature Tabs */}
          <FeatureTabs />

          {/* Footer */}
          <footer className="text-center py-6 border-t border-surface-border/30">
            <p className="text-xs text-text-dim">
              PlantTwin v0.1 · Demo Dashboard · Built with 🌱
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
