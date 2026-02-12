import React, { useState, useEffect } from 'react';
import { ChevronLeft, Camera, Upload, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { uploadFile } from '@/lib/storage';
import { useAppContext } from '@/context/AppContext';
import { View } from '@/types';

const ResidentProfile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { setActiveView } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    display_name: '',
    avatar_url: '',
  });
  const [employeeData, setEmployeeData] = useState<{
    name: string;
    email: string;
    gender: string;
    sleep_schedule: string;
    hobbies: string[];
    unit_number?: string;
    complex_name?: string;
  } | null>(null);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*, employee:employees(*, unit:units(*, complex:complexes(*)))')
      .eq('user_id', user!.id)
      .single();

    if (profileData) {
      setProfile({
        display_name: profileData.display_name || '',
        avatar_url: profileData.avatar_url || '',
      });

      const emp = profileData.employee as any;
      if (emp) {
        setEmployeeData({
          name: emp.name,
          email: emp.email,
          gender: emp.gender,
          sleep_schedule: emp.sleep_schedule,
          hobbies: emp.hobbies || [],
          unit_number: emp.unit?.unit_number,
          complex_name: emp.unit?.complex?.name,
        });
      }
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadFile(file, 'avatars', user!.id);
    if (url) {
      setProfile(p => ({ ...p, avatar_url: url }));
      await supabase
        .from('profiles')
        .update({ avatar_url: url })
        .eq('user_id', user!.id);
      toast({ title: 'Avatar updated' });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: profile.display_name, avatar_url: profile.avatar_url })
      .eq('user_id', user!.id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update profile.', variant: 'destructive' });
    } else {
      toast({ title: 'Profile updated' });
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="header-gradient text-primary-foreground p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveView(View.RESIDENT_HOME)}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">My Profile</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-muted overflow-hidden">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UserIcon className="w-10 h-10 text-muted-foreground" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center cursor-pointer shadow-md">
              <Camera className="w-4 h-4" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{user?.email}</p>
        </div>

        {/* Display Name */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Display Name</label>
          <Input
            value={profile.display_name}
            onChange={(e) => setProfile(p => ({ ...p, display_name: e.target.value }))}
          />
        </div>

        {/* Employee Info (read-only) */}
        {employeeData && (
          <div className="bg-card rounded-xl p-4 shadow-sm space-y-3">
            <h3 className="font-bold text-foreground">Employee Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium text-foreground">{employeeData.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Gender</p>
                <p className="font-medium text-foreground capitalize">{employeeData.gender.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Sleep Schedule</p>
                <p className="font-medium text-foreground capitalize">{employeeData.sleep_schedule.replace('_', ' ')}</p>
              </div>
              {employeeData.unit_number && (
                <div>
                  <p className="text-muted-foreground">Unit</p>
                  <p className="font-medium text-foreground">{employeeData.unit_number}</p>
                </div>
              )}
              {employeeData.complex_name && (
                <div className="col-span-2">
                  <p className="text-muted-foreground">Complex</p>
                  <p className="font-medium text-foreground">{employeeData.complex_name}</p>
                </div>
              )}
            </div>
            {employeeData.hobbies.length > 0 && (
              <div>
                <p className="text-muted-foreground text-sm">Hobbies</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {employeeData.hobbies.map((h) => (
                    <span key={h} className="badge-info text-xs">{h}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <Button onClick={handleSave} className="w-full" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>

        <Button variant="outline" className="w-full" onClick={() => {
          supabase.auth.signOut();
        }}>
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default ResidentProfile;
