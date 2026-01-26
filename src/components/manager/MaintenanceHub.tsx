import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search, Calendar, Clock, AlertTriangle, CheckCircle2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/context/AppContext';
import { View, Issue } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import ManagerHeader from './ManagerHeader';

const MaintenanceHub: React.FC = () => {
  const { setActiveView } = useAppContext();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    const { data } = await supabase
      .from('issues')
      .select('*, unit:units(*)')
      .order('created_at', { ascending: false });
    
    if (data) setIssues(data as Issue[]);
  };

  const filteredIssues = issues.filter(issue => {
    const matchesFilter = filter === 'all' || issue.status === filter;
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: issues.length,
    pending: issues.filter(i => i.status === 'pending').length,
    inProgress: issues.filter(i => i.status === 'in_progress').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-warning" />;
      case 'in_progress': return <AlertTriangle className="w-4 h-4 text-secondary" />;
      case 'resolved': return <CheckCircle2 className="w-4 h-4 text-success" />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'in_progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      default: return status;
    }
  };

  return (
    <div className="animate-fade-in">
      <ManagerHeader />

      <div className="p-4 space-y-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-20 flex flex-col gap-2"
            onClick={() => setActiveView(View.INSPECTION_COMPARISON)}
          >
            <Calendar className="w-6 h-6 text-secondary" />
            <span className="text-sm font-medium">Inspection Tool</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col gap-2"
            onClick={() => setActiveView(View.FINAL_STATEMENT)}
          >
            <FileText className="w-6 h-6 text-success" />
            <span className="text-sm font-medium">Deposit Statement</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Total', value: stats.total, color: 'text-foreground' },
            { label: 'Pending', value: stats.pending, color: 'text-warning' },
            { label: 'Active', value: stats.inProgress, color: 'text-secondary' },
            { label: 'Done', value: stats.resolved, color: 'text-success' },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-lg p-3 text-center shadow-sm">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(['all', 'pending', 'in_progress', 'resolved'] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status === 'all' ? 'All' : getStatusLabel(status)}
            </Button>
          ))}
        </div>

        {/* Issues List */}
        <div className="space-y-3">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
              <p className="text-muted-foreground">No issues found</p>
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div 
                key={issue.id} 
                className="bg-card rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveView(View.INSPECTION_COMPARISON)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(issue.status)}
                      <span className={`text-xs font-medium ${
                        issue.status === 'pending' ? 'text-warning' :
                        issue.status === 'in_progress' ? 'text-secondary' : 'text-success'
                      }`}>
                        {getStatusLabel(issue.status)}
                      </span>
                      {issue.priority === 'urgent' && (
                        <span className="bg-destructive/10 text-destructive text-xs px-2 py-0.5 rounded-full">
                          URGENT
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-foreground">{issue.title}</h4>
                    {issue.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">{issue.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(issue.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {issue.estimated_cost > 0 && (
                    <span className="text-destructive font-bold">
                      ${issue.estimated_cost.toFixed(0)}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceHub;
