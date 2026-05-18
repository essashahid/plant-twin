"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";
import { ProgressUpdate } from "@/types/plant";
import Image from "next/image";

interface AddProgressUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (update: ProgressUpdate) => void;
}

export default function AddProgressUpdateModal({
  isOpen,
  onClose,
  onSave,
}: AddProgressUpdateModalProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [photos, setPhotos] = useState({ plant: "", leaf: "", soil: "" });
  const [notes, setNotes] = useState("");
  const [soilCondition, setSoilCondition] = useState<ProgressUpdate["soilCondition"]>("Moist");
  const [wateredToday, setWateredToday] = useState(false);
  const [fertilizedToday, setFertilizedToday] = useState(false);
  const [compostAddedToday, setCompostAddedToday] = useState(false);
  const [pesticideAppliedToday, setPesticideAppliedToday] = useState(false);
  const [visibleIssue, setVisibleIssue] = useState<ProgressUpdate["visibleIssue"]>("None");
  const [overallCondition, setOverallCondition] = useState<ProgressUpdate["overallCondition"]>("Looks same");

  const handlePhotoUpload = (type: "plant" | "leaf" | "soil", file: File) => {
    const url = URL.createObjectURL(file);
    setPhotos((prev) => ({ ...prev, [type]: url }));
  };

  const handleSubmit = () => {
    const newUpdate: ProgressUpdate = {
      id: `update-${Date.now()}`,
      date,
      photos,
      notes,
      soilCondition,
      wateredToday,
      fertilizedToday,
      compostAddedToday,
      pesticideAppliedToday,
      visibleIssue,
      overallCondition,
      healthScore: 0, // Will be calculated by generatePlantInsights
    };
    onSave(newUpdate);
    onClose();
  };

  if (!isOpen) return null;

  const PhotoUploadBox = ({
    label,
    type,
  }: {
    label: string;
    type: "plant" | "leaf" | "soil";
  }) => {
    const preview = photos[type];
    return (
      <div className="relative border-2 border-dashed border-surface-border hover:border-brand-500 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-colors group h-32 bg-surface-primary/50 overflow-hidden cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handlePhotoUpload(type, e.target.files[0])}
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
        />
        {preview ? (
          <Image src={preview} alt={label} fill className="object-cover" />
        ) : (
          <>
            <div className="h-10 w-10 rounded-full bg-surface-border/50 flex items-center justify-center mb-2 group-hover:bg-brand-500/20 group-hover:text-brand-400 text-text-muted transition-colors">
              <Upload className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-text-primary">{label}</span>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in-up">
      <div className="glass-card rounded-2xl p-6 max-w-2xl max-h-[90vh] overflow-y-auto w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Add Progress Update</h2>
            <p className="text-xs text-text-muted mt-0.5">Track your plant's journey with photos and notes</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-card transition-colors"
          >
            <X className="h-5 w-5 text-text-muted" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Date of Update</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-surface-primary border border-surface-border rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Photos <span className="text-text-dim text-xs">(Full plant is required)</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <PhotoUploadBox label="Full Plant" type="plant" />
              <PhotoUploadBox label="Leaf Close-up" type="leaf" />
              <div className="col-span-2">
                <PhotoUploadBox label="Soil Surface" type="soil" />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observations, changes, or anything you've noticed..."
              rows={3}
              className="w-full bg-surface-primary border border-surface-border rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-brand-500 focus:outline-none resize-none"
            />
          </div>

          {/* Soil Condition */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Current Soil Condition</label>
            <select
              value={soilCondition}
              onChange={(e) => setSoilCondition(e.target.value as ProgressUpdate["soilCondition"])}
              className="w-full bg-surface-primary border border-surface-border rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option>Dry</option>
              <option>Slightly dry</option>
              <option>Moist</option>
              <option>Wet</option>
              <option>Compacted</option>
            </select>
          </div>

          {/* Care Actions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wateredToday}
                  onChange={(e) => setWateredToday(e.target.checked)}
                  className="w-4 h-4 rounded border border-surface-border bg-surface-primary checked:bg-brand-500"
                />
                <span className="text-sm font-medium text-text-primary">Watered today</span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fertilizedToday}
                  onChange={(e) => setFertilizedToday(e.target.checked)}
                  className="w-4 h-4 rounded border border-surface-border bg-surface-primary checked:bg-brand-500"
                />
                <span className="text-sm font-medium text-text-primary">Fertilized today</span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={compostAddedToday}
                  onChange={(e) => setCompostAddedToday(e.target.checked)}
                  className="w-4 h-4 rounded border border-surface-border bg-surface-primary checked:bg-brand-500"
                />
                <span className="text-sm font-medium text-text-primary">Compost added today</span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pesticideAppliedToday}
                  onChange={(e) => setPesticideAppliedToday(e.target.checked)}
                  className="w-4 h-4 rounded border border-surface-border bg-surface-primary checked:bg-brand-500"
                />
                <span className="text-sm font-medium text-text-primary">Pesticide applied today</span>
              </label>
            </div>
          </div>

          {/* Visible Issue */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Visible Issue</label>
            <select
              value={visibleIssue}
              onChange={(e) => setVisibleIssue(e.target.value as ProgressUpdate["visibleIssue"])}
              className="w-full bg-surface-primary border border-surface-border rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option>None</option>
              <option>Yellow leaves</option>
              <option>Drooping leaves</option>
              <option>Dry soil</option>
              <option>Wet soil</option>
              <option>Spots on leaves</option>
              <option>Pest signs</option>
              <option>Slow growth</option>
              <option>Wilting</option>
            </select>
          </div>

          {/* Overall Condition */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">Overall Plant Condition</label>
            <div className="grid grid-cols-3 gap-3">
              {(["Looks better", "Looks same", "Looks worse"] as const).map((condition) => (
                <button
                  key={condition}
                  onClick={() => setOverallCondition(condition)}
                  className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    overallCondition === condition
                      ? "bg-brand-500/20 border-brand-500 text-brand-400"
                      : "bg-surface-primary border-surface-border text-text-primary hover:border-text-dim"
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-surface-border/50">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-surface-border text-text-primary hover:bg-surface-card transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!photos.plant}
              className="flex-1 px-4 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Progress Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
