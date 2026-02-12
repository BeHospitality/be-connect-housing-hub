import React from 'react';
import { Bell } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { AppMode } from '@/types';
import { Switch } from '@/components/ui/switch';

const ResidentHeader: React.FC = () => {
  const { appMode, setAppMode, dataMode, setDataMode } = useAppContext();

  return (
    <div className="bg-card border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-bold text-foreground">Be Connect</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Demo / Live Toggle */}
          <button
            onClick={() => setDataMode(dataMode === 'demo' ? 'live' : 'demo')}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
              dataMode === 'demo'
                ? 'bg-warning/20 text-warning'
                : 'bg-success/20 text-success'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${dataMode === 'demo' ? 'bg-warning' : 'bg-success animate-pulse'}`} />
            {dataMode === 'demo' ? 'DEMO' : 'LIVE'}
          </button>

          {/* Mode Toggle */}
          <div className="flex items-center gap-2 bg-muted rounded-full px-2 py-1">
            <span className="text-xs font-medium text-muted-foreground">
              {appMode === AppMode.MANAGER ? 'Mgr' : 'Res'}
            </span>
            <Switch
              checked={appMode === AppMode.RESIDENT}
              onCheckedChange={(checked) => 
                setAppMode(checked ? AppMode.RESIDENT : AppMode.MANAGER)
              }
              className="scale-75 data-[state=checked]:bg-secondary"
            />
          </div>
          
          <button className="relative">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-destructive rounded-full" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResidentHeader;
