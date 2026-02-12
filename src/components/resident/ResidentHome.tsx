import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, AlertTriangle, User, MessageSquare, ChevronRight, Building, DollarSign } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { View, Issue, Employee, Announcement } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { demoIssues, demoEmployees, demoAnnouncements } from '@/lib/demoData';
import ResidentHeader from './ResidentHeader';

const ResidentHome: React.FC = () => {
  const { setActiveView, dataMode } = useAppContext();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [housemates, setHousemates] = useState<Employee[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    if (dataMode === 'demo') {
      setIssues(demoIssues.slice(0, 3));
      setHousemates(demoEmployees.filter(e => e.unit_id === demoEmployees[0].unit_id).slice(1, 3));
      setAnnouncements(demoAnnouncements.slice(0, 2));
    } else {
      fetchData();
    }
  }, [dataMode]);

  const fetchData = async () => {
    const { data: issuesData } = await supabase
      .from('issues')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (issuesData) setIssues(issuesData as Issue[]);

    const { data: employeesData } = await supabase
      .from('employees')
      .select('*')
      .limit(3);
    
    if (employeesData) setHousemates(employeesData as Employee[]);

    const { data: announcementsData } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(2);
    
    if (announcementsData) setAnnouncements(announcementsData as Announcement[]);
  };

  const quickActions = [
    { icon: AlertTriangle, label: 'Report Issue', view: View.REPORT_ISSUE, color: 'bg-destructive/10 text-destructive' },
    { icon: DollarSign, label: 'My Deposit', view: View.RESIDENT_DEPOSIT, color: 'bg-success/10 text-success' },
    { icon: User, label: 'My Profile', view: View.PROFILE, color: 'bg-secondary/10 text-secondary' },
    { icon: MessageSquare, label: 'Messages', view: View.INBOX, color: 'bg-info/10 text-info' },
  ];

  return (
    <div className="animate-fade-in">
      <ResidentHeader />
      
      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome home, Sarah</h1>
          <p className="text-muted-foreground">Here's what's happening at your place.</p>
        </div>

        {/* Unit Card */}
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop"
            alt="Building"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-primary-foreground">
            <div className="flex items-center gap-2 text-sm opacity-90 mb-1">
              <MapPin className="w-4 h-4" />
              <span>123 Corporate Way, Austin TX</span>
            </div>
            <div className="flex items-center gap-2 text-sm opacity-90 mb-2">
              <Calendar className="w-4 h-4" />
              <span>Lease ends: Dec 31, 2024</span>
            </div>
            <p className="text-xs uppercase tracking-wide opacity-80">CURRENT ASSIGNMENT</p>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Unit 12B</h2>
              <button className="text-secondary font-semibold text-sm">
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => setActiveView(action.view)}
              className="bg-card rounded-xl p-4 shadow-sm flex flex-col items-center gap-2"
            >
              <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center`}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-foreground">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Housemates */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-foreground">Your Housemates</h3>
            <button className="text-secondary font-medium text-sm">View All</button>
          </div>
          <div className="flex gap-4">
            {housemates.length > 0 ? housemates.map((mate) => (
              <div key={mate.id} className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-muted overflow-hidden">
                    <img
                      src={mate.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mate.name}`}
                      alt={mate.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-card" />
                </div>
                <span className="text-xs font-medium text-foreground mt-1">
                  {mate.name.split(' ')[0]}
                </span>
              </div>
            )) : (
              <>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">Alex M.</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">Jamie L.</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Open Requests */}
        <div className="bg-card rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔧</span>
              <h3 className="font-bold text-foreground">Open Requests</h3>
            </div>
            <span className="badge-warning">
              {issues.filter(i => i.status === 'pending').length} New
            </span>
          </div>
          
          {issues.length > 0 ? issues.map((issue) => (
            <div key={issue.id} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">{issue.title}</p>
                <p className="text-xs text-muted-foreground">
                  Submitted {new Date(issue.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className={`text-sm font-medium ${
                issue.status === 'in_progress' ? 'text-secondary' : 
                issue.status === 'resolved' ? 'text-success' : 'text-warning'
              }`}>
                {issue.status === 'in_progress' ? 'In Progress' : 
                 issue.status === 'resolved' ? 'Resolved' : 'Pending'}
              </span>
            </div>
          )) : (
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">Kitchen Sink Leak</p>
                <p className="text-xs text-muted-foreground">Submitted 2 days ago</p>
              </div>
              <span className="text-sm font-medium text-secondary">In Progress</span>
            </div>
          )}
        </div>

        {/* Announcements */}
        <div className="bg-card rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">📢</span>
              <h3 className="font-bold text-foreground">Announcements</h3>
            </div>
            <button className="text-secondary font-medium text-sm">See All</button>
          </div>
          
          {announcements.map((announcement) => (
            <div key={announcement.id} className="flex gap-3 py-2">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                <Building className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="font-medium text-foreground">{announcement.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {announcement.content}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(announcement.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResidentHome;
