import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Phone, CheckCircle2, Clock, Truck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAppContext } from '@/context/AppContext';
import { View, Issue } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useClientId } from '@/hooks/useClientId';
import ManagerHeader from './ManagerHeader';

interface VendorAssignment {
  id: string;
  issue_id: string;
  vendor_name: string;
  vendor_contact: string | null;
  status: string;
  notes: string | null;
  assigned_at: string;
  completed_at: string | null;
  issue?: Issue;
}

const VendorWorkOrders: React.FC = () => {
  const { setActiveView } = useAppContext();
  const { toast } = useToast();
  const { clientId } = useClientId();
  const [assignments, setAssignments] = useState<VendorAssignment[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'assigned' | 'in_progress' | 'completed'>('all');
  const [form, setForm] = useState({
    issue_id: '',
    vendor_name: '',
    vendor_contact: '',
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [assignmentsRes, issuesRes] = await Promise.all([
      supabase.from('vendor_assignments').select('*').order('assigned_at', { ascending: false }),
      supabase.from('issues').select('*').order('created_at', { ascending: false }),
    ]);
    if (assignmentsRes.data) setAssignments(assignmentsRes.data as VendorAssignment[]);
    if (issuesRes.data) setIssues(issuesRes.data as Issue[]);
  };

  const handleAssign = async () => {
    if (!form.issue_id || !form.vendor_name) return;

    const { error } = await supabase.from('vendor_assignments').insert({
      issue_id: form.issue_id,
      vendor_name: form.vendor_name,
      vendor_contact: form.vendor_contact || null,
      notes: form.notes || null,
      client_id: clientId,
    });

    if (error) {
      toast({ title: 'Error', description: 'Failed to create work order.', variant: 'destructive' });
    } else {
      toast({ title: 'Work Order Created', description: `Assigned to ${form.vendor_name}` });
      setForm({ issue_id: '', vendor_name: '', vendor_contact: '', notes: '' });
      setDialogOpen(false);
      fetchData();
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('vendor_assignments').update({
      status,
      ...(status === 'completed' ? { completed_at: new Date().toISOString() } : {}),
    }).eq('id', id);
    fetchData();
  };

  const filtered = assignments.filter(a => filter === 'all' || a.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'text-warning';
      case 'in_progress': return 'text-secondary';
      case 'completed': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned': return <Clock className="w-4 h-4" />;
      case 'in_progress': return <Truck className="w-4 h-4" />;
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <ManagerHeader />

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Vendor Work Orders</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Assign Vendor</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Work Order</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Issue</label>
                  <Select value={form.issue_id} onValueChange={(v) => setForm({ ...form, issue_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select issue" /></SelectTrigger>
                    <SelectContent>
                      {issues.map((issue) => (
                        <SelectItem key={issue.id} value={issue.id}>{issue.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Vendor Name</label>
                  <Input value={form.vendor_name} onChange={(e) => setForm({ ...form, vendor_name: e.target.value })} placeholder="e.g., ABC Plumbing" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Contact</label>
                  <Input value={form.vendor_contact} onChange={(e) => setForm({ ...form, vendor_contact: e.target.value })} placeholder="Phone or email" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Notes</label>
                  <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Additional instructions..." rows={3} />
                </div>
                <Button onClick={handleAssign} className="w-full">Create Work Order</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Assigned', count: assignments.filter(a => a.status === 'assigned').length, color: 'text-warning' },
            { label: 'In Progress', count: assignments.filter(a => a.status === 'in_progress').length, color: 'text-secondary' },
            { label: 'Completed', count: assignments.filter(a => a.status === 'completed').length, color: 'text-success' },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-lg p-3 text-center shadow-sm">
              <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {(['all', 'assigned', 'in_progress', 'completed'] as const).map((s) => (
            <Button key={s} variant={filter === s ? 'default' : 'outline'} size="sm" onClick={() => setFilter(s)}>
              {s === 'all' ? 'All' : s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No work orders found</p>
            </div>
          ) : filtered.map((wo) => {
            const issue = issues.find(i => i.id === wo.issue_id);
            return (
              <div key={wo.id} className="bg-card rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">{issue?.title || 'Unknown Issue'}</h4>
                    <p className="text-sm text-muted-foreground">{wo.vendor_name}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${getStatusColor(wo.status)}`}>
                    {getStatusIcon(wo.status)}
                    <span className="capitalize">{wo.status.replace('_', ' ')}</span>
                  </div>
                </div>
                {wo.vendor_contact && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                    <Phone className="w-3 h-3" /> {wo.vendor_contact}
                  </p>
                )}
                {wo.notes && <p className="text-sm text-muted-foreground mb-3">{wo.notes}</p>}
                {wo.status !== 'completed' && (
                  <div className="flex gap-2">
                    {wo.status === 'assigned' && (
                      <Button size="sm" variant="outline" onClick={() => updateStatus(wo.id, 'in_progress')}>
                        Start Work
                      </Button>
                    )}
                    <Button size="sm" className="bg-success hover:bg-success/90" onClick={() => updateStatus(wo.id, 'completed')}>
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Mark Complete
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VendorWorkOrders;
