"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Leaf, Plus, Loader2, AlertCircle, Sprout } from "lucide-react";
import { getPlants } from "@/lib/plantService";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { PlantListItem } from "@/types/plant";
import PlantCard from "@/components/PlantCard";

export default function PlantListPage() {
  const [plants, setPlants] = useState<PlantListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getPlants();
        if (!cancelled) setPlants(data);
      } catch (err) {
        console.error("PlantTwin: failed to load plants", err);
        if (!cancelled) setError("Could not load your plants. Please refresh.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-surface-primary">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-600/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 ring-1 ring-brand-500/20">
              <Leaf className="h-5 w-5 text-brand-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary tracking-tight">
                PlantTwin
              </h1>
              <p className="text-sm text-text-muted">Your plants</p>
            </div>
          </div>
          <Link
            href="/plants/new"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-500 shadow-lg shadow-brand-600/20"
          >
            <Plus className="h-4 w-4" />
            Add New Plant
          </Link>
        </header>

        {/* Backend mode hint */}
        {!isSupabaseConfigured && !loading && (
          <div className="mb-6 rounded-lg bg-status-info/5 border border-status-info/20 px-4 py-2.5 animate-fade-in-up">
            <p className="text-xs text-text-muted">
              Running in local mode — data is saved to this browser. Add Supabase
              credentials in <span className="text-text-secondary">.env.local</span> to sync to a backend.
            </p>
          </div>
        )}

        {/* States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in-up">
            <Loader2 className="h-6 w-6 text-brand-400 animate-spin mb-3" />
            <p className="text-sm text-text-muted">Loading your plants…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in-up">
            <AlertCircle className="h-7 w-7 text-status-danger mb-3" />
            <p className="text-sm text-text-muted">{error}</p>
          </div>
        ) : plants.length === 0 ? (
          <div className="glass-card rounded-2xl py-20 flex flex-col items-center justify-center text-center animate-fade-in-up">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 ring-1 ring-brand-500/20 mb-4">
              <Sprout className="h-7 w-7 text-brand-400" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary mb-1">
              No plants yet
            </h2>
            <p className="text-sm text-text-muted max-w-sm mb-5">
              Create your first PlantTwin to start tracking growth, health, and care.
            </p>
            <Link
              href="/plants/new"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-500 shadow-lg shadow-brand-600/20"
            >
              <Plus className="h-4 w-4" />
              Add Your First Plant
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        )}

        <footer className="text-center py-8 mt-8 border-t border-surface-border/30">
          <p className="text-xs text-text-dim">
            PlantTwin v0.3 · Persistent Storage · Built with 🌱
          </p>
        </footer>
      </div>
    </main>
  );
}
