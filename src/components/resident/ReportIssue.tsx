import React, { useState } from 'react';
import { ChevronLeft, Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ReportIssueProps {
  onBack: () => void;
}

const ReportIssue: React.FC<ReportIssueProps> = ({ onBack }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'normal',
    category: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get a sample unit for the issue
      const { data: units } = await supabase.from('units').select('id').limit(1);
      const unitId = units?.[0]?.id;

      if (!unitId) {
        throw new Error('No unit found');
      }

      const { error } = await supabase.from('issues').insert({
        unit_id: unitId,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: 'pending',
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

  const categories = [
    'Plumbing',
    'Electrical',
    'HVAC',
    'Appliance',
    'Structural',
    'Pest Control',
    'Other',
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="header-gradient text-primary-foreground p-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">Report an Issue</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Category */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Category
          </label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat.toLowerCase()}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Title */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Issue Title
          </label>
          <Input
            placeholder="e.g., Kitchen sink leak"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Description
          </label>
          <Textarea
            placeholder="Describe the issue in detail..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
          />
        </div>

        {/* Priority */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Priority
          </label>
          <Select
            value={formData.priority}
            onValueChange={(value) => setFormData({ ...formData, priority: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low - Can wait</SelectItem>
              <SelectItem value="normal">Normal - Standard request</SelectItem>
              <SelectItem value="high">High - Needs attention soon</SelectItem>
              <SelectItem value="urgent">Urgent - Emergency</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Photo Upload */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Add Photos (optional)
          </label>
          <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Camera className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Take a photo or upload from gallery
            </p>
            <Button type="button" variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Issue'}
        </Button>
      </form>
    </div>
  );
};

export default ReportIssue;
