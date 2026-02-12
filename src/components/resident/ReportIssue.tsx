import React, { useState, useEffect } from 'react';
import { ChevronLeft, Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useClientId } from '@/hooks/useClientId';
import { uploadFile } from '@/lib/storage';
import { Employee } from '@/types';

interface ReportIssueProps {
  onBack: () => void;
}

const ReportIssue: React.FC<ReportIssueProps> = ({ onBack }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { clientId } = useClientId();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [housemates, setHousemates] = useState<Employee[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'normal',
    category: '',
    attributed_to: '',
  });

  useEffect(() => {
    fetchHousemates();
  }, []);

  const fetchHousemates = async () => {
    if (!user) return;
    const { data: profile } = await supabase
      .from('profiles')
      .select('employee_id')
      .eq('user_id', user.id)
      .single();

    if (profile?.employee_id) {
      const { data: myEmployee } = await supabase
        .from('employees')
        .select('unit_id')
        .eq('id', profile.employee_id)
        .single();

      if (myEmployee?.unit_id) {
        const { data } = await supabase
          .from('employees')
          .select('*')
          .eq('unit_id', myEmployee.unit_id)
          .neq('id', profile.employee_id);
        if (data) setHousemates(data as Employee[]);
      }
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const url = await uploadFile(file, 'issues', user?.id);
      if (url) setPhotos(prev => [...prev, url]);
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: units } = await supabase.from('units').select('id').limit(1);
      const unitId = units?.[0]?.id;
      if (!unitId) throw new Error('No unit found');

      const { error } = await supabase.from('issues').insert({
        unit_id: unitId,
        title: formData.title,
        description: `${formData.description}${photos.length > 0 ? '\n\nPhotos: ' + photos.join(', ') : ''}`,
        priority: formData.priority,
        status: 'pending',
        attributed_to: formData.attributed_to || null,
        client_id: clientId,
      });

      if (error) throw error;

      toast({
        title: 'Issue Reported',
        description: 'Your maintenance request has been submitted.',
      });
      onBack();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit issue. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Plumbing', 'Electrical', 'HVAC', 'Appliance', 'Structural', 'Pest Control', 'Other'];

  return (
    <div className="animate-fade-in">
      <div className="header-gradient text-primary-foreground p-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">Report an Issue</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
          <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Issue Title</label>
          <Input
            placeholder="e.g., Kitchen sink leak"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
          <Textarea
            placeholder="Describe the issue in detail..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Priority</label>
          <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low - Can wait</SelectItem>
              <SelectItem value="normal">Normal - Standard request</SelectItem>
              <SelectItem value="high">High - Needs attention soon</SelectItem>
              <SelectItem value="urgent">Urgent - Emergency</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Roommate Attribution (Fairness Engine) */}
        {housemates.length > 0 && (
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Attribute Damage To (optional)
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              If this damage was caused by a specific roommate, select them here for fair deposit attribution.
            </p>
            <Select value={formData.attributed_to} onValueChange={(v) => setFormData({ ...formData, attributed_to: v })}>
              <SelectTrigger><SelectValue placeholder="No specific attribution" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">No specific attribution</SelectItem>
                {housemates.map((mate) => (
                  <SelectItem key={mate.id} value={mate.id}>{mate.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Photo Upload */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Add Photos</label>
          {photos.length > 0 && (
            <div className="flex gap-2 mb-3 flex-wrap">
              {photos.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotos(p => p.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-3">
            <Camera className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center">Take a photo or upload from gallery</p>
            <label>
              <Button type="button" variant="outline" size="sm" asChild disabled={uploading}>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Photo'}
                </span>
              </Button>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
            </label>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Issue'}
        </Button>
      </form>
    </div>
  );
};

export default ReportIssue;
