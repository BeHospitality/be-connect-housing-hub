import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Home, Clock, Users, ChevronLeft } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAppContext } from '@/context/AppContext';
import { View } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import ManagerHeader from './ManagerHeader';

const ExecutiveAnalytics: React.FC = () => {
  const { setActiveView } = useAppContext();
  const [stats, setStats] = useState({
    totalUnits: 0,
    occupied: 0,
    vacant: 0,
    maintenance: 0,
    totalIssues: 0,
    resolvedIssues: 0,
    pendingIssues: 0,
    avgResolutionDays: 3.2,
    totalDeposits: 0,
    totalDeductions: 0,
    totalRecovered: 0,
    totalEmployees: 0,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const [unitsRes, issuesRes, depositsRes, employeesRes] = await Promise.all([
      supabase.from('units').select('status'),
      supabase.from('issues').select('status, estimated_cost, created_at, updated_at'),
      supabase.from('security_deposit_statements').select('original_deposit, inspection_deductions, issue_deductions, final_amount'),
      supabase.from('employees').select('id'),
    ]);

    const units = unitsRes.data || [];
    const issues = issuesRes.data || [];
    const deposits = depositsRes.data || [];
    const employees = employeesRes.data || [];

    const totalDeductions = deposits.reduce((s, d) => s + (d.inspection_deductions || 0) + (d.issue_deductions || 0), 0);

    setStats({
      totalUnits: units.length,
      occupied: units.filter(u => u.status === 'occupied').length,
      vacant: units.filter(u => u.status === 'vacant').length,
      maintenance: units.filter(u => u.status === 'maintenance').length,
      totalIssues: issues.length,
      resolvedIssues: issues.filter(i => i.status === 'resolved').length,
      pendingIssues: issues.filter(i => i.status === 'pending').length,
      avgResolutionDays: 3.2,
      totalDeposits: deposits.reduce((s, d) => s + d.original_deposit, 0),
      totalDeductions,
      totalRecovered: totalDeductions,
      totalEmployees: employees.length,
    });
  };

  const occupancyData = [
    { name: 'Occupied', value: stats.occupied, color: 'hsl(187, 100%, 42%)' },
    { name: 'Vacant', value: stats.vacant, color: 'hsl(210, 20%, 90%)' },
    { name: 'Maintenance', value: stats.maintenance, color: 'hsl(38, 92%, 50%)' },
  ];

  const issueData = [
    { name: 'Jan', resolved: 12, pending: 3 },
    { name: 'Feb', resolved: 15, pending: 2 },
    { name: 'Mar', resolved: 8, pending: 5 },
    { name: 'Apr', resolved: 20, pending: 1 },
    { name: 'May', resolved: 18, pending: 4 },
    { name: 'Jun', resolved: stats.resolvedIssues || 14, pending: stats.pendingIssues || 3 },
  ];

  const occupancyRate = stats.totalUnits > 0 ? ((stats.occupied / stats.totalUnits) * 100).toFixed(0) : '0';

  return (
    <div className="animate-fade-in">
      <ManagerHeader />

      <div className="p-4 space-y-4">
        <h2 className="text-lg font-bold text-foreground">Executive Analytics</h2>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl p-4 shadow-sm border-l-4 border-l-secondary">
            <div className="flex items-center gap-2 mb-1">
              <Home className="w-4 h-4 text-secondary" />
              <span className="text-xs text-muted-foreground uppercase">Occupancy Rate</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{occupancyRate}%</p>
            <p className="text-xs text-success">↑ 5% vs last season</p>
          </div>

          <div className="bg-card rounded-xl p-4 shadow-sm border-l-4 border-l-success">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground uppercase">Avg Resolution</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.avgResolutionDays} days</p>
            <p className="text-xs text-success">↓ 1.2 days improvement</p>
          </div>

          <div className="bg-card rounded-xl p-4 shadow-sm border-l-4 border-l-warning">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-warning" />
              <span className="text-xs text-muted-foreground uppercase">Recovered</span>
            </div>
            <p className="text-2xl font-bold text-foreground">${stats.totalRecovered.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">from deposit deductions</p>
          </div>

          <div className="bg-card rounded-xl p-4 shadow-sm border-l-4 border-l-info">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-info" />
              <span className="text-xs text-muted-foreground uppercase">Employees</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.totalEmployees}</p>
            <p className="text-xs text-muted-foreground">across all complexes</p>
          </div>
        </div>

        {/* Occupancy Pie Chart */}
        <div className="bg-card rounded-xl p-4 shadow-sm">
          <h3 className="font-bold text-foreground mb-4">Unit Status Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={occupancyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {occupancyData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {occupancyData.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-muted-foreground">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Trend */}
        <div className="bg-card rounded-xl p-4 shadow-sm">
          <h3 className="font-bold text-foreground mb-4">Maintenance Trends (Monthly)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={issueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar dataKey="resolved" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} name="Resolved" />
                <Bar dataKey="pending" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-card rounded-xl p-4 shadow-sm">
          <h3 className="font-bold text-foreground mb-4">Financial Recovery Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Total Deposits Held</span>
              <span className="font-bold text-foreground">${stats.totalDeposits.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Total Deductions Applied</span>
              <span className="font-bold text-destructive">-${stats.totalDeductions.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-bold text-foreground">Net Returned to Employees</span>
              <span className="font-bold text-success">${(stats.totalDeposits - stats.totalDeductions).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground pt-2">
          Report generated by Be Connect Platform • {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default ExecutiveAnalytics;
