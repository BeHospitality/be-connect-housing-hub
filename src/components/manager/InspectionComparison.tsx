import React, { useState } from 'react';
import { ChevronLeft, Camera, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/context/AppContext';
import { View } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useClientId } from '@/hooks/useClientId';
import { uploadFile } from '@/lib/storage';

const InspectionComparison: React.FC = () => {
  const { setActiveView } = useAppContext();
  const { toast } = useToast();
  const { user } = useAuth();
  const { clientId } = useClientId();
  const [damageDetected, setDamageDetected] = useState(true);
  const [repairCost, setRepairCost] = useState('125.00');
  const [inspectorNotes, setInspectorNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [moveOutPhoto, setMoveOutPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadFile(file, 'inspections', user?.id);
    if (url) setMoveOutPhoto(url);
    setUploading(false);
  };

  const handleConfirmCapture = async () => {
    setLoading(true);
    
    try {
      // Get a unit to associate the inspection with
      const { data: units } = await supabase.from('units').select('id').limit(1);
      const unitId = units?.[0]?.id;

      if (!unitId) {
        throw new Error('No unit found');
      }

      await supabase.from('inspections').insert({
        unit_id: unitId,
        inspection_type: 'move_out',
        room_name: 'Living Room',
        area_name: 'North Wall',
        damage_detected: damageDetected,
        repair_cost: damageDetected ? parseFloat(repairCost) : 0,
        inspector_notes: inspectorNotes,
        photo_url: moveOutPhoto,
        status: 'completed',
        client_id: clientId,
      });

      toast({
        title: 'Inspection Saved',
        description: 'Move-out inspection has been recorded.',
      });

      setActiveView(View.MAINTENANCE);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save inspection.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in min-h-screen bg-background">
      {/* Header */}
      <div className="header-gradient text-primary-foreground p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveView(View.MAINTENANCE)}>
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="text-center flex-1">
              <h1 className="text-sm font-bold">HTM PLATFORM</h1>
              <p className="text-xs opacity-80 flex items-center justify-center gap-1">
                <span className="text-secondary">be</span> BE CONNECT INTEGRATED
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm" className="bg-primary-foreground/20 text-primary-foreground border-0">
            DONE
          </Button>
        </div>
      </div>

      {/* Unit Info Bar */}
      <div className="bg-primary/90 text-primary-foreground px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-secondary font-medium">UNIT 402 • BAYSIDE COMMUNITY</p>
            <h2 className="font-bold">Living Room: North Wall</h2>
          </div>
          <span className="bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded-full">
            MOVE-OUT
          </span>
        </div>
      </div>

      {/* Photo Comparison */}
      <div className="grid grid-cols-2 gap-1 bg-primary">
        {/* Move-In Photo */}
        <div className="inspection-photo">
          <img
            src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"
            alt="Move-in condition"
            className="w-full h-full object-cover"
          />
          <span className="inspection-label-movein">MOVE-IN</span>
          <div className="absolute bottom-2 left-2 text-primary-foreground text-xs">
            📅 Jan 12, 2023 · 10:42 AM
          </div>
        </div>

        {/* Move-Out Photo */}
        <label className="inspection-photo bg-muted cursor-pointer">
          {moveOutPhoto ? (
            <img src={moveOutPhoto} alt="Move-out condition" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-card shadow-lg flex items-center justify-center mb-2">
                <Camera className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">{uploading ? 'Uploading...' : 'Tap to capture'}</p>
            </div>
          )}
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoCapture} />
          <span className="inspection-label-moveout">MOVE-OUT</span>
          {moveOutPhoto && (
            <div className="absolute bottom-2 right-2 bg-success text-success-foreground text-xs px-2 py-0.5 rounded-full">
              CAPTURED
            </div>
          )}
        </label>
      </div>

      {/* Status Row */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-card border-b border-border">
        <div>
          <p className="text-xs text-muted-foreground uppercase">STATUS</p>
          <p className="text-success font-bold flex items-center gap-1">
            <Check className="w-4 h-4" /> CERTIFIED GOOD
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase">TIMESTAMP</p>
          <p className="font-bold text-foreground">Oct 24, 2023 · 14:15 PM</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Damage Toggle */}
        <div className="bg-destructive/10 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
              <span className="text-destructive text-lg">⚠</span>
            </div>
            <div>
              <p className="font-bold text-foreground">Damage Detected</p>
              <p className="text-sm text-muted-foreground">Impacts security deposit</p>
            </div>
          </div>
          <Switch
            checked={damageDetected}
            onCheckedChange={setDamageDetected}
            className="data-[state=checked]:bg-secondary"
          />
        </div>

        {/* Repair Cost */}
        {damageDetected && (
          <div className="bg-card rounded-xl p-4 shadow-sm">
            <p className="text-xs text-muted-foreground uppercase mb-2">
              ESTIMATE REPAIR COST
            </p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-secondary">$</span>
              <Input
                type="number"
                value={repairCost}
                onChange={(e) => setRepairCost(e.target.value)}
                className="text-2xl font-bold border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
              />
            </div>
            <p className="text-xs text-muted-foreground italic mt-2">
              Note: This value feeds into the "Be Connect" Security Deposit calculation module.
            </p>
          </div>
        )}

        {/* Inspector Notes */}
        <div className="bg-card rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground uppercase">INSPECTOR NOTES</p>
            <span className="text-muted-foreground">≡</span>
          </div>
          <Textarea
            placeholder="Describe the scuffing or impact found on the wall..."
            value={inspectorNotes}
            onChange={(e) => setInspectorNotes(e.target.value)}
            className="border-0 bg-transparent p-0 resize-none focus-visible:ring-0"
            rows={3}
          />
        </div>

        {/* Add More FAB */}
        <div className="flex justify-end">
          <button className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground shadow-lg flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Deposit Deduction Summary */}
        {damageDetected && (
          <div className="flex items-center justify-between py-2 border-t border-border">
            <span className="font-bold text-foreground">EST. DEPOSIT DEDUCTION:</span>
            <span className="text-xl font-bold text-destructive">
              -${parseFloat(repairCost).toFixed(2)}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button 
            variant="outline" 
            onClick={() => setActiveView(View.MAINTENANCE)}
            className="h-12"
          >
            CANCEL
          </Button>
          <Button 
            onClick={handleConfirmCapture}
            disabled={loading}
            className="h-12 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            CONFIRM CAPTURE <Check className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InspectionComparison;
