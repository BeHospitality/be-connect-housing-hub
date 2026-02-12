import React from 'react';
import { Bell } from 'lucide-react';
import { useAppContext, DataMode } from '@/context/AppContext';
import { AppMode } from '@/types';
import { Switch } from '@/components/ui/switch';

const ManagerHeader: React.FC = () => {
  const { appMode, setAppMode, dataMode, setDataMode } = useAppContext();

  return (
    <div className="header-gradient text-primary-foreground p-4">
      {/* Top row with avatar and notifications */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
              alt="Sarah Jenkins"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm opacity-80">WELCOME BACK</p>
            <h2 className="text-lg font-bold">Sarah Jenkins</h2>
          </div>
        </div>
        <button className="relative">
          <Bell className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full" />
        </button>
      </div>

      {/* Platform header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
            <span className="text-lg font-bold">⌂</span>
          </div>
          <div>
            <h1 className="text-lg font-bold">HTM</h1>
            <p className="text-xs opacity-80">PLATFORM</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Demo / Live Toggle */}
          <button
            onClick={() => setDataMode(dataMode === 'demo' ? 'live' : 'demo')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              dataMode === 'demo'
                ? 'bg-warning/20 text-warning'
                : 'bg-success/20 text-success'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${dataMode === 'demo' ? 'bg-warning' : 'bg-success animate-pulse'}`} />
            {dataMode === 'demo' ? 'DEMO' : 'LIVE'}
          </button>

          {/* Mode Toggle */}
          <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-full px-3 py-1.5">
            <span className="text-xs font-medium">
              {appMode === AppMode.MANAGER ? 'Manager' : 'Resident'}
            </span>
            <Switch
              checked={appMode === AppMode.RESIDENT}
              onCheckedChange={(checked) => 
                setAppMode(checked ? AppMode.RESIDENT : AppMode.MANAGER)
              }
              className="data-[state=checked]:bg-secondary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerHeader;
