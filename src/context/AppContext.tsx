import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppMode, View, Employee } from '@/types';

interface AppContextType {
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  activeView: View;
  setActiveView: (view: View) => void;
  selectedUnitId: string | null;
  setSelectedUnitId: (id: string | null) => void;
  selectedEmployeeId: string | null;
  setSelectedEmployeeId: (id: string | null) => void;
  currentResident: Employee | null;
  setCurrentResident: (resident: Employee | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appMode, setAppMode] = useState<AppMode>(AppMode.MANAGER);
  const [activeView, setActiveView] = useState<View>(View.DASHBOARD);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [currentResident, setCurrentResident] = useState<Employee | null>(null);

  return (
    <AppContext.Provider
      value={{
        appMode,
        setAppMode,
        activeView,
        setActiveView,
        selectedUnitId,
        setSelectedUnitId,
        selectedEmployeeId,
        setSelectedEmployeeId,
        currentResident,
        setCurrentResident,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
