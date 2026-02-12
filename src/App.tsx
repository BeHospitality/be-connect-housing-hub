import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider, useAppContext } from "@/context/AppContext";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { AppMode, View } from "@/types";
import Layout from "@/components/Layout";
import Dashboard from "@/components/manager/Dashboard";
import MaintenanceHub from "@/components/manager/MaintenanceHub";
import InspectionComparison from "@/components/manager/InspectionComparison";
import SmartMatching from "@/components/manager/SmartMatching";
import EmployeeManagement from "@/components/manager/EmployeeManagement";
import FinalStatement from "@/components/manager/FinalStatement";
import VendorWorkOrders from "@/components/manager/VendorWorkOrders";
import ExecutiveAnalytics from "@/components/manager/ExecutiveAnalytics";
import ResidentHome from "@/components/resident/ResidentHome";
import ReportIssue from "@/components/resident/ReportIssue";
import ResidentProfile from "@/components/resident/ResidentProfile";
import ResidentDepositView from "@/components/resident/ResidentDepositView";
import MessagingHub from "@/components/shared/MessagingHub";
import Auth from "@/pages/Auth";

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const { activeView, setActiveView, appMode } = useAppContext();

  const renderContent = () => {
    // Resident Mode Views
    if (appMode === AppMode.RESIDENT) {
      switch (activeView) {
        case View.REPORT_ISSUE:
          return <ReportIssue onBack={() => setActiveView(View.RESIDENT_HOME)} />;
        case View.PROFILE:
          return <ResidentProfile />;
        case View.RESIDENT_DEPOSIT:
          return <ResidentDepositView />;
        case View.INBOX:
          return <MessagingHub />;
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
      case View.MAINTENANCE_SCHEDULE:
        return <VendorWorkOrders />;
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
        return <ExecutiveAnalytics />;
      case View.INBOX:
        return <MessagingHub />;
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

const AuthGate: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Auth />;

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthGate />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
