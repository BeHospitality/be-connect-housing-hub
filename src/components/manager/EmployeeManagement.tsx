import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Plus, Upload, Download, Search, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAppContext } from '@/context/AppContext';
import { View, Employee, Gender, SleepSchedule } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useClientId } from '@/hooks/useClientId';

const EmployeeManagement: React.FC = () => {
  const { setActiveView } = useAppContext();
  const { toast } = useToast();
  const { clientId } = useClientId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: 'prefer_not_to_say' as Gender,
    sleep_schedule: 'flexible' as SleepSchedule,
    hobbies: '',
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const { data } = await supabase
      .from('employees')
      .select('*')
      .order('name');
    
    if (data) setEmployees(data as Employee[]);
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const hobbiesArray = formData.hobbies
        .split(',')
        .map(h => h.trim())
        .filter(h => h.length > 0);

      const { error } = await supabase.from('employees').insert({
        name: formData.name,
        email: formData.email || null,
        gender: formData.gender,
        sleep_schedule: formData.sleep_schedule,
        hobbies: hobbiesArray,
        client_id: clientId,
      });

      if (error) throw error;

      toast({
        title: 'Employee Added',
        description: `${formData.name} has been added to the system.`,
      });

      setShowAddDialog(false);
      setFormData({
        name: '',
        email: '',
        gender: 'prefer_not_to_say',
        sleep_schedule: 'flexible',
        hobbies: '',
      });
      fetchEmployees();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add employee.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').slice(1); // Skip header
        
        const employees = lines
          .filter(line => line.trim())
          .map(line => {
            const [name, email, gender, sleep_schedule, hobbies] = line.split(',').map(s => s.trim().replace(/"/g, ''));
            return {
              name,
              email: email || null,
              gender: (gender?.toLowerCase() || 'prefer_not_to_say') as Gender,
              sleep_schedule: (sleep_schedule?.toLowerCase().replace(' ', '_') || 'flexible') as SleepSchedule,
              hobbies: hobbies ? hobbies.split(';').map(h => h.trim()) : [],
              client_id: clientId,
            };
          });

        const { error } = await supabase.from('employees').insert(employees);
        
        if (error) throw error;

        toast({
          title: 'CSV Imported',
          description: `${employees.length} employees have been added.`,
        });

        fetchEmployees();
      } catch (error) {
        toast({
          title: 'Import Failed',
          description: 'Please check your CSV format.',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const csv = 'Name,Email,Gender,Sleep Schedule,Hobbies\nJohn Doe,john@example.com,male,early_riser,Yoga;Gaming\nJane Smith,jane@example.com,female,night_owl,Reading;Hiking';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_template.csv';
    a.click();
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="header-gradient text-primary-foreground p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveView(View.SMART_MATCHING)}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">Employee Management</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search & Actions */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="icon" className="bg-secondary">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Employee</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Gender</label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value: Gender) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non_binary">Non-Binary</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer Not to Say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Sleep Schedule</label>
                  <Select
                    value={formData.sleep_schedule}
                    onValueChange={(value: SleepSchedule) => setFormData({ ...formData, sleep_schedule: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="early_riser">Early Riser</SelectItem>
                      <SelectItem value="night_owl">Night Owl</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Hobbies (comma-separated)</label>
                  <Input
                    placeholder="e.g., Yoga, Gaming, Reading"
                    value={formData.hobbies}
                    onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Employee'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* CSV Actions */}
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="hidden"
          />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={downloadTemplate}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Template
          </Button>
        </div>

        {/* Employee List */}
        <div className="space-y-3">
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No employees found</p>
              <p className="text-sm text-muted-foreground">Add employees manually or import from CSV</p>
            </div>
          ) : (
            filteredEmployees.map((employee) => (
              <div key={employee.id} className="bg-card rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={employee.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.name}`}
                    alt={employee.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{employee.name}</p>
                    {employee.email && (
                      <p className="text-sm text-muted-foreground">{employee.email}</p>
                    )}
                    <div className="flex gap-1 flex-wrap mt-1">
                      <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded">
                        {getSleepLabel(employee.sleep_schedule)}
                      </span>
                      {employee.hobbies.slice(0, 2).map((hobby) => (
                        <span key={hobby} className="bg-secondary/10 text-secondary text-xs px-2 py-0.5 rounded">
                          {hobby}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    employee.is_assigned 
                      ? 'bg-success/10 text-success' 
                      : 'bg-warning/10 text-warning'
                  }`}>
                    {employee.is_assigned ? 'Assigned' : 'Pending'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;
