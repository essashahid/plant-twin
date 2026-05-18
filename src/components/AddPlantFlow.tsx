"use client";

import { useState } from "react";
import { usePlant } from "@/context/PlantContext";
import { generatePlantInsights } from "@/utils/generatePlantInsights";
import { PlantFormData } from "@/types/plant";
import BasicInfoStep from "./setup-steps/BasicInfoStep";
import PotSoilStep from "./setup-steps/PotSoilStep";
import EnvironmentStep from "./setup-steps/EnvironmentStep";
import CareRoutineStep from "./setup-steps/CareRoutineStep";
import PhotoUploadStep from "./setup-steps/PhotoUploadStep";
import { Check, ChevronRight, ArrowLeft } from "lucide-react";

const steps = [
  { id: "basic", title: "Basic Info", component: BasicInfoStep },
  { id: "pot", title: "Pot & Soil", component: PotSoilStep },
  { id: "environment", title: "Environment", component: EnvironmentStep },
  { id: "care", title: "Care Routine", component: CareRoutineStep },
  { id: "photos", title: "Photos", component: PhotoUploadStep },
];

export default function AddPlantFlow() {
  const { setDashboardData } = usePlant();
  const [currentStep, setCurrentStep] = useState(0);
  
  const [formData, setFormData] = useState<PlantFormData>({
    name: "", type: "Chilli Plant", location: "Balcony", age: "", plantedDate: "",
    potSize: "", drainageHoles: "Yes", soilType: "", soilCondition: "Slightly dry", compostAdded: "No",
    sunlightHours: "", windExposure: "Medium", shadeRisk: "Medium", temperature: "Warm", humidity: "Moderate", city: "",
    lastWatered: "", wateringFreq: "Irregular", lastFertilizer: "", fertilizerType: "", lastPesticide: "", careNotes: "",
    photos: {}
  });

  const updateData = (fields: Partial<PlantFormData>) => setFormData(prev => ({ ...prev, ...fields }));

  const nextStep = () => setCurrentStep(p => Math.min(p + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(p => Math.max(p - 1, 0));

  const submit = () => {
    // Generate dashboard data based on form input and pass it to context
    const dashboard = generatePlantInsights(formData, []);
    setDashboardData(dashboard);
  };

  const CurrentComponent = steps[currentStep].component;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="glass-card rounded-2xl p-6 md:p-8 animate-fade-in-up">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Create PlantTwin</h2>
          <p className="text-text-muted text-sm">Add your plant details to generate a digital twin.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-surface-border -z-10" />
          {steps.map((step, idx) => {
            const isActive = idx === currentStep;
            const isCompleted = idx < currentStep;
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  isActive ? "bg-brand-500 text-white ring-4 ring-brand-500/20 scale-110" :
                  isCompleted ? "bg-brand-500 text-white" : "bg-surface-primary border-2 border-surface-border text-text-dim"
                }`}>
                  {isCompleted ? <Check className="w-4 h-4" /> : (idx + 1)}
                </div>
                <span className={`text-[10px] uppercase tracking-wider mt-2 font-semibold transition-colors duration-300 ${isActive ? "text-brand-400" : "text-text-dim"}`}>
                  <span className="hidden sm:inline">{step.title}</span>
                </span>
              </div>
            )
          })}
        </div>

        <div className="min-h-[350px]">
          <CurrentComponent data={formData} updateData={updateData} />
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-surface-border/50">
          <button 
            onClick={prevStep} 
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${currentStep === 0 ? "opacity-0 pointer-events-none" : "text-text-primary bg-surface-primary hover:bg-surface-border/50 ring-1 ring-surface-border"}`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          
          {currentStep === steps.length - 1 ? (
            <button 
              onClick={submit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium bg-brand-500 hover:bg-brand-600 text-white transition-colors shadow-lg shadow-brand-500/20"
            >
              Create PlantTwin <Check className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium bg-text-primary text-surface-card hover:bg-text-primary/90 transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
