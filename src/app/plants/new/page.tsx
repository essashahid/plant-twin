"use client";

import Link from "next/link";
import { ArrowLeft, Leaf } from "lucide-react";
import AddPlantFlow from "@/components/AddPlantFlow";

export default function NewPlantPage() {
  return (
    <main className="min-h-screen bg-surface-primary">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-600/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex items-center justify-between mb-2 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 ring-1 ring-brand-500/20">
              <Leaf className="h-5 w-5 text-brand-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary tracking-tight">
                PlantTwin
              </h1>
              <p className="text-sm text-text-muted">New plant setup</p>
            </div>
          </div>
          <Link
            href="/plants"
            className="inline-flex items-center gap-2 rounded-lg bg-surface-card px-3.5 py-2 text-sm font-medium text-text-primary ring-1 ring-surface-border transition-all hover:bg-surface-card-hover"
          >
            <ArrowLeft className="h-4 w-4 text-text-muted" />
            All plants
          </Link>
        </header>

        <AddPlantFlow />
      </div>
    </main>
  );
}
