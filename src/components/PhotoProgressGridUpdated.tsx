"use client";

import Image from "next/image";
import { Heart, ImageIcon } from "lucide-react";
import { PlantFormData, ProgressUpdate } from "@/types/plant";

interface PhotoProgressGridUpdatedProps {
  initialPhoto: string;
  progressUpdates: ProgressUpdate[];
  healthScore: number;
}

export default function PhotoProgressGridUpdated({
  initialPhoto,
  progressUpdates,
  healthScore,
}: PhotoProgressGridUpdatedProps) {
  const latestUpdate = progressUpdates[0] || null;
  const previousUpdate = progressUpdates[1] || null;

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-status-good";
    if (score >= 60) return "text-status-warning";
    return "text-status-danger";
  };

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-1">
        <ImageIcon className="h-4 w-4 text-brand-400" />
        <h3 className="text-lg font-semibold text-text-primary">Photo Progress</h3>
      </div>
      <p className="text-xs text-text-muted mb-5">Visual growth timeline</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Latest Update */}
        {latestUpdate && (
          <div className="group relative rounded-xl overflow-hidden ring-1 ring-surface-border bg-surface-primary">
            <div className="aspect-square relative">
              <Image
                src={latestUpdate.photos.plant || "/chilli-hero.png"}
                alt="Latest update"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5">
                <span className="text-[11px] font-semibold text-white/90 block">Latest</span>
                <div className="flex items-center gap-1 mt-1">
                  <Heart className="h-3 w-3 text-brand-400" />
                  <span className={`text-[10px] font-medium ${getHealthColor(latestUpdate.healthScore)} `}>
                    {latestUpdate.healthScore}/100
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand-400 ring-2 ring-brand-400/30 animate-pulse" />
          </div>
        )}

        {/* Previous Update */}
        {previousUpdate && (
          <div className="group relative rounded-xl overflow-hidden ring-1 ring-surface-border bg-surface-primary">
            <div className="aspect-square relative">
              <Image
                src={previousUpdate.photos.plant || "/chilli-hero.png"}
                alt="Previous update"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5">
                <span className="text-[11px] font-semibold text-white/90 block">Previous</span>
                <div className="flex items-center gap-1 mt-1">
                  <Heart className="h-3 w-3 text-brand-400" />
                  <span className={`text-[10px] font-medium ${getHealthColor(previousUpdate.healthScore)}`}>
                    {previousUpdate.healthScore}/100
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Initial Setup */}
        <div className="group relative rounded-xl overflow-hidden ring-1 ring-surface-border bg-surface-primary">
          <div className="aspect-square relative">
            <Image
              src={initialPhoto || "/chilli-hero.png"}
              alt="Initial setup"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-2.5 left-2.5 right-2.5">
              <span className="text-[11px] font-semibold text-white/90 block">Setup</span>
              <div className="flex items-center gap-1 mt-1">
                <Heart className="h-3 w-3 text-brand-400" />
                <span className={`text-[10px] font-medium ${getHealthColor(healthScore)}`}>
                  {healthScore}/100
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
