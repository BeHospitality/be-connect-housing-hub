import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { AppMode, View } from '@/types';
import { Home, Building2, Users, Settings, Wrench, Mail, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { appMode, activeView, setActiveView } = useAppContext();

  const managerNavItems = [
    { view: View.DASHBOARD, icon: Home, label: 'Dashboard' },
    { view: View.PROPERTIES, icon: Building2, label: 'Properties' },
    { view: View.TEAM_MANAGEMENT, icon: Users, label: 'Staff' },
    { view: View.ANALYTICS, icon: Settings, label: 'Settings' },
  ];

  const residentNavItems = [
    { view: View.RESIDENT_HOME, icon: Home, label: 'Home' },
    { view: View.REPORT_ISSUE, icon: Wrench, label: 'Issues' },
    { view: View.INBOX, icon: Mail, label: 'Messages' },
    { view: View.PROFILE, icon: User, label: 'Profile' },
  ];

  const navItems = appMode === AppMode.MANAGER ? managerNavItems : residentNavItems;

  return (
    <div className="min-h-screen bg-background pb-20">
      {children}
      
      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        {navItems.map((item) => {
          const isActive = activeView === item.view || 
            (item.view === View.DASHBOARD && activeView === View.PROPERTIES);
          
          return (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
