"use client";

import React, { createContext, useContext, useState } from "react";
import { DashboardData } from "@/types/plant";
// Also import dummy data to use as initial state if needed, or start fresh.
// The prompt says "We already have a polished dashboard... Goal: Create an onboarding/setup flow... After the user completes the setup, generate the dashboard using the entered data."
// So we should start empty.

interface PlantContextType {
  dashboardData: DashboardData | null;
  setDashboardData: (data: DashboardData | null) => void;
  hasPlant: boolean;
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

export function PlantProvider({ children }: { children: React.ReactNode }) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  return (
    <PlantContext.Provider
      value={{
        dashboardData,
        setDashboardData,
        hasPlant: dashboardData !== null,
      }}
    >
      {children}
    </PlantContext.Provider>
  );
}

export function usePlant() {
  const context = useContext(PlantContext);
  if (context === undefined) {
    throw new Error("usePlant must be used within a PlantProvider");
  }
  return context;
}
