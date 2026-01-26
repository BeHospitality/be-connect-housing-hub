import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider, useAppContext } from "@/context/AppContext";
import { AppMode, View } from "@/types";
import Layout from "@/components/Layout";
import Dashboard from "@/components/manager/Dashboard";
import MaintenanceHub from "@/components/manager/MaintenanceHub";
import InspectionComparison from "@/components/manager/InspectionComparison";
import SmartMatching from "@/components/manager/SmartMatching";
import EmployeeManagement from "@/components/manager/EmployeeManagement";
import FinalStatement from "@/components/manager/FinalStatement";
import ResidentHome from "@/components/resident/ResidentHome";
import ReportIssue from "@/components/resident/ReportIssue";

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const { activeView, setActiveView, appMode } = useAppContext();

  const renderContent = () => {
    // Resident Mode Views
    if (appMode === AppMode.RESIDENT) {
      switch (activeView) {
        case View.REPORT_ISSUE:
          return <ReportIssue onBack={() => setActiveView(View.RESIDENT_HOME)} />;
        case View.INBOX:
          return (
            <div className="p-4">
              <h1 className="text-xl font-bold">Messages</h1>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          );
        case View.PROFILE:
          return (
            <div className="p-4">
              <h1 className="text-xl font-bold">My Profile</h1>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          );
        default:
          return <ResidentHome />;
      }
    }

    // Manager Mode Views
    switch (activeView) {
      case View.DASHBOARD:
      case View.PROPERTIES:
        return <Dashboard />;
      case View.MAINTENANCE:
        return <MaintenanceHub />;
      case View.INSPECTION_COMPARISON:
        return <InspectionComparison />;
      case View.SMART_MATCHING:
        return <SmartMatching />;
      case View.EMPLOYEE_MANAGEMENT:
        return <EmployeeManagement />;
      case View.FINAL_STATEMENT:
        return <FinalStatement />;
      case View.TEAM_MANAGEMENT:
        return <SmartMatching />;
      case View.ANALYTICS:
        return (
          <div className="p-4">
            <h1 className="text-xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      case View.INBOX:
        return (
          <div className="p-4">
            <h1 className="text-xl font-bold">Messages</h1>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
