import React, { useState, useEffect } from 'react';
import { ChevronLeft, RefreshCw, Upload, Download, Home, Check, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { View, Employee, Unit } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MatchPairing {
  employee1: Employee;
  employee2: Employee;
  matchScore: number;
  suggestedUnit?: Unit;
}

const SmartMatching: React.FC = () => {
  const { setActiveView } = useAppContext();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [pairings, setPairings] = useState<MatchPairing[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [employeesRes, unitsRes] = await Promise.all([
      supabase.from('employees').select('*').eq('is_assigned', false),
      supabase.from('units').select('*').eq('status', 'vacant'),
    ]);

    if (employeesRes.data) setEmployees(employeesRes.data as Employee[]);
    if (unitsRes.data) setUnits(unitsRes.data as Unit[]);
  };

  const calculateMatchScore = (e1: Employee, e2: Employee): number => {
    let score = 0;
    
    // Same gender = 50 points (highest priority)
    if (e1.gender === e2.gender) score += 50;
    
    // Same sleep schedule = 30 points
    if (e1.sleep_schedule === e2.sleep_schedule) score += 30;
    
    // Shared hobbies = up to 20 points
    const sharedHobbies = e1.hobbies.filter(h => e2.hobbies.includes(h));
    score += Math.min(sharedHobbies.length * 5, 20);
    
    return score;
  };

  const generatePairings = () => {
    setLoading(true);
    
    const newPairings: MatchPairing[] = [];
    const unassigned = [...employees];
    
    while (unassigned.length >= 2) {
      const e1 = unassigned.shift()!;
      let bestMatch = { index: 0, score: 0 };
      
      for (let i = 0; i < unassigned.length; i++) {
        const score = calculateMatchScore(e1, unassigned[i]);
        if (score > bestMatch.score) {
          bestMatch = { index: i, score };
        }
      }
      
      if (bestMatch.score > 0) {
        const e2 = unassigned.splice(bestMatch.index, 1)[0];
        newPairings.push({
          employee1: e1,
          employee2: e2,
          matchScore: bestMatch.score,
          suggestedUnit: units[newPairings.length],
        });
      }
    }
    
    setPairings(newPairings.sort((a, b) => b.matchScore - a.matchScore));
    setLoading(false);
    
    toast({
      title: 'Pairings Generated',
      description: `Found ${newPairings.length} potential matches.`,
    });
  };

  const confirmPairing = async (pairing: MatchPairing) => {
    if (!pairing.suggestedUnit) return;

    try {
      // Update employees
      await supabase
        .from('employees')
        .update({ 
          is_assigned: true, 
          unit_id: pairing.suggestedUnit.id 
        })
        .in('id', [pairing.employee1.id, pairing.employee2.id]);

      // Update unit
      await supabase
        .from('units')
        .update({ status: 'occupied' })
        .eq('id', pairing.suggestedUnit.id);

      // Save pairing
      await supabase.from('roommate_pairings').insert({
        employee1_id: pairing.employee1.id,
        employee2_id: pairing.employee2.id,
        unit_id: pairing.suggestedUnit.id,
        match_score: pairing.matchScore,
        confirmed: true,
      });

      toast({
        title: 'Pairing Confirmed',
        description: `${pairing.employee1.name} & ${pairing.employee2.name} assigned to ${pairing.suggestedUnit.unit_number}`,
      });

      // Refresh data
      fetchData();
      setPairings(pairings.filter(p => p !== pairing));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to confirm pairing.',
        variant: 'destructive',
      });
    }
  };

  const downloadTemplate = () => {
    const csv = 'Name,Email,Gender,Sleep Schedule,Hobbies\nJohn Doe,john@example.com,male,early_riser,"Yoga,Gaming"\nJane Smith,jane@example.com,female,night_owl,"Reading,Hiking"';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_template.csv';
    a.click();
  };

  const getSleepLabel = (schedule: string) => {
    switch (schedule) {
      case 'early_riser': return 'Early Riser';
      case 'night_owl': return 'Night Owl';
      case 'flexible': return 'Flexible';
      default: return schedule;
    }
  };

  return (
    <div className="animate-fade-in min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveView(View.DASHBOARD)}>
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
            <h1 className="text-lg font-bold text-foreground">Onboarding & Assignment</h1>
          </div>
          <button>
            <Filter className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Integration Banner */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-success text-success-foreground text-xs font-semibold px-3 py-1 rounded-full">
              INTEGRATION ACTIVE
            </span>
            <span className="text-sm text-muted-foreground">BE CONNECT PLATFORM</span>
          </div>
          
          <h2 className="text-xl font-bold text-foreground mb-2">
            Smart Employee Matching
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            Fetch vetted employee data from Pocket Career Agent to generate optimal housing pairings.
          </p>
          
          <Button 
            onClick={generatePairings}
            disabled={loading || employees.length < 2}
            className="w-full bg-primary text-primary-foreground"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Sync from Pocket Career Agent
          </Button>
        </div>

        {/* Suggested Pairings */}
        {pairings.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-foreground uppercase text-sm tracking-wide">
                Suggested Pairings
              </h3>
              <span className="text-success text-sm font-medium">
                {pairings.length} Matches Found
              </span>
            </div>

            <div className="space-y-4">
              {pairings.map((pairing, index) => (
                <div key={index} className="match-card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        <img
                          src={pairing.employee1.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${pairing.employee1.name}`}
                          alt={pairing.employee1.name}
                          className="w-12 h-12 rounded-full border-2 border-card"
                        />
                        <img
                          src={pairing.employee2.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${pairing.employee2.name}`}
                          alt={pairing.employee2.name}
                          className="w-12 h-12 rounded-full border-2 border-card"
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-success font-bold">{pairing.matchScore}% Match</span>
                      {pairing.suggestedUnit && (
                        <p className="text-xs text-muted-foreground">
                          Unit {pairing.suggestedUnit.unit_number}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="font-semibold text-foreground">{pairing.employee1.name}</p>
                      <div className="flex gap-1 flex-wrap mt-1">
                        <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded">
                          {getSleepLabel(pairing.employee1.sleep_schedule)}
                        </span>
                        {pairing.employee1.hobbies.slice(0, 1).map((hobby) => (
                          <span key={hobby} className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded">
                            {hobby}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{pairing.employee2.name}</p>
                      <div className="flex gap-1 flex-wrap mt-1">
                        <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded">
                          {getSleepLabel(pairing.employee2.sleep_schedule)}
                        </span>
                        {pairing.employee2.hobbies.slice(0, 1).map((hobby) => (
                          <span key={hobby} className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded">
                            {hobby}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => confirmPairing(pairing)}
                    className="w-full bg-success hover:bg-success/90 text-success-foreground"
                  >
                    Confirm & Notify <Home className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manual Upload Section */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-4 text-sm text-muted-foreground uppercase tracking-wide">
              Manual Upload
            </span>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-sm border border-dashed border-border text-center">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <Upload className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-bold text-foreground mb-2">Upload intake list</h3>
          <p className="text-sm text-muted-foreground mb-4">
            CSV, Excel or JSON with gender, hobbies, and sleep patterns.
          </p>
          <Button variant="link" onClick={downloadTemplate} className="text-secondary">
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
        </div>

        {/* Bottom Actions */}
        <div className="flex gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={() => setActiveView(View.DASHBOARD)}
            className="flex-1"
          >
            Skip
          </Button>
          <Button 
            onClick={() => setActiveView(View.EMPLOYEE_MANAGEMENT)}
            className="flex-1 bg-primary"
          >
            Review All Pairings →
          </Button>
        </div>

        <p className="text-center text-xs text-success flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success" />
          LIVE SYNC ENABLED
        </p>
      </div>
    </div>
  );
};

export default SmartMatching;
