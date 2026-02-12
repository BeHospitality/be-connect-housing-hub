import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppMode, View, Employee } from '@/types';

export type DataMode = 'demo' | 'live';

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
  dataMode: DataMode;
  setDataMode: (mode: DataMode) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appMode, setAppMode] = useState<AppMode>(AppMode.MANAGER);
  const [activeView, setActiveView] = useState<View>(View.DASHBOARD);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [currentResident, setCurrentResident] = useState<Employee | null>(null);
  const [dataMode, setDataMode] = useState<DataMode>('demo');

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
        dataMode,
        setDataMode,
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
