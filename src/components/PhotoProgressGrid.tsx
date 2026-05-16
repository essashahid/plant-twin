"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { usePlant } from "@/context/PlantContext";

export default function PhotoProgressGrid() {
  const { dashboardData } = usePlant();
  if (!dashboardData) return null;
  const { photoProgress } = dashboardData;

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in-up animate-delay-600">
      <div className="flex items-center gap-2 mb-1">
        <ImageIcon className="h-4 w-4 text-brand-400" />
        <h3 className="text-lg font-semibold text-text-primary">Photo Progress</h3>
      </div>
      <p className="text-xs text-text-muted mb-5">Visual growth timeline</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {photoProgress.map((p, i) => (
          <div key={i} className="group relative rounded-xl overflow-hidden ring-1 ring-surface-border bg-surface-primary">
            <div className="aspect-square relative">
              <Image src={p.image} alt={p.week} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5">
                <span className="text-[11px] font-semibold text-white/90 block">{p.week}</span>
                <span className="text-[10px] text-white/60">{p.note}</span>
              </div>
            </div>
            {i === photoProgress.length - 1 && (
              <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand-400 ring-2 ring-brand-400/30 animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
