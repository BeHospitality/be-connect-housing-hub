import React, { useState, useEffect } from 'react';
import { PieChart, Building2, Users, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { View, Complex } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { demoComplexes, demoStats, demoBreakdownItems } from '@/lib/demoData';
import ManagerHeader from './ManagerHeader';
import StatCard from './StatCard';
import UnitBreakdown from './UnitBreakdown';

const Dashboard: React.FC = () => {
  const { setActiveView, dataMode } = useAppContext();
  const [complexes, setComplexes] = useState<Complex[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (dataMode === 'demo') {
      setComplexes(demoComplexes);
    } else {
      fetchComplexes();
    }
  }, [dataMode]);

  const fetchComplexes = async () => {
    const { data } = await supabase
      .from('complexes')
      .select('*')
      .order('name');
    
    if (data) setComplexes(data as Complex[]);
  };

  const clients = ['ALL CLIENTS', 'Boca West', 'Ballenisles', 'Mira'];

  const breakdownItems = dataMode === 'demo'
    ? demoBreakdownItems
    : [
        { label: 'Occupied', count: 423, percentage: 94, color: 'hsl(187, 100%, 42%)' },
        { label: 'Vacant', count: 18, percentage: 4, color: 'hsl(210, 20%, 90%)' },
        { label: 'Maintenance', count: 9, percentage: 2, color: 'hsl(38, 92%, 50%)' },
      ];

  const stats = dataMode === 'demo' ? demoStats : {
    occupancyRate: 94,
    occupancyTrend: '+2.5%',
    totalUnits: 450,
    totalComplexes: 12,
    onboardingPending: 85,
  };

  return (
    <div className="animate-fade-in">
      <ManagerHeader />
      
      <div className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search properties or clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {/* Client Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {clients.map((client) => (
            <Button
              key={client}
              variant={selectedClient === client.toLowerCase().replace(' ', '') ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedClient(client.toLowerCase().replace(' ', ''))}
              className="whitespace-nowrap"
            >
              {client}
            </Button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            title="OCCUPANCY"
            value={`${stats.occupancyRate}%`}
            trend={{ value: stats.occupancyTrend, direction: 'up' }}
            subtitle="vs last mo"
            icon={PieChart}
            variant="cyan"
          />
          <StatCard
            title="TOTAL UNITS"
            value={String(stats.totalUnits)}
            subtitle="+10 new units"
            icon={Building2}
          />
          <StatCard
            title="COMPLEXES"
            value={String(stats.totalComplexes)}
            subtitle="Active in 4 portfolios"
            icon={Building2}
          />
          <StatCard
            title="ONBOARDING"
            value={String(stats.onboardingPending)}
            subtitle="ACTION NEEDED"
            icon={Users}
            variant="warning"
            alert
          />
        </div>

        {/* Unit Breakdown */}
        <UnitBreakdown items={breakdownItems} />

        {/* Complex Overview */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">Complex Overview</h3>
          <button 
            className="text-secondary font-semibold text-sm"
            onClick={() => setActiveView(View.PROPERTIES)}
          >
            SEE ALL
          </button>
        </div>

        <div className="space-y-3">
          {complexes.map((complex) => (
            <div
              key={complex.id}
              className="bg-card rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveView(View.UNIT_DETAIL)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-foreground">{complex.name}</h4>
                  <p className="text-sm text-muted-foreground">{complex.address}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">{complex.total_units}</p>
                  <p className="text-xs text-muted-foreground">units</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAB */}
      <button
        className="fab"
        onClick={() => setActiveView(View.SMART_MATCHING)}
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Dashboard;
