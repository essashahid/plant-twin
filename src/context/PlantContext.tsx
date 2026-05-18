"use client";

import React, { createContext, useContext, useState } from "react";
import { DashboardData, ProgressUpdate } from "@/types/plant";

interface PlantContextType {
  dashboardData: DashboardData | null;
  setDashboardData: (data: DashboardData | null) => void;
  hasPlant: boolean;
  progressUpdates: ProgressUpdate[];
  addProgressUpdate: (update: ProgressUpdate) => void;
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

export function PlantProvider({ children }: { children: React.ReactNode }) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([]);

  const addProgressUpdate = (update: ProgressUpdate) => {
    const newUpdates = [update, ...progressUpdates];
    setProgressUpdates(newUpdates);
    if (dashboardData) {
      setDashboardData({ ...dashboardData, progressUpdates: newUpdates });
    }
  };

  return (
    <PlantContext.Provider
      value={{
        dashboardData,
        setDashboardData,
        hasPlant: dashboardData !== null,
        progressUpdates,
        addProgressUpdate,
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
