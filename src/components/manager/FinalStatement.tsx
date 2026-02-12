import React, { useState, useEffect } from 'react';
import { ChevronLeft, Download, FileText, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { View, Inspection, Issue } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useClientId } from '@/hooks/useClientId';

const FinalStatement: React.FC = () => {
  const { setActiveView } = useAppContext();
  const { toast } = useToast();
  const { clientId } = useClientId();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  const originalDeposit = 3000;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [inspectionsRes, issuesRes] = await Promise.all([
      supabase
        .from('inspections')
        .select('*')
        .eq('damage_detected', true),
      supabase
        .from('issues')
        .select('*')
        .gt('estimated_cost', 0),
    ]);

    if (inspectionsRes.data) setInspections(inspectionsRes.data as Inspection[]);
    if (issuesRes.data) setIssues(issuesRes.data as Issue[]);
    setLoading(false);
  };

  const inspectionDeductions = inspections.reduce((sum, i) => sum + (i.repair_cost || 0), 0);
  const issueDeductions = issues.reduce((sum, i) => sum + (i.estimated_cost || 0), 0);
  const totalDeductions = inspectionDeductions + issueDeductions;
  const finalAmount = originalDeposit - totalDeductions;

  const handleGenerateStatement = async () => {
    try {
      // Get a sample employee and unit
      const { data: employees } = await supabase.from('employees').select('id').limit(1);
      const { data: units } = await supabase.from('units').select('id').limit(1);

      if (!employees?.[0]?.id || !units?.[0]?.id) {
        throw new Error('No data found');
      }

      await supabase.from('security_deposit_statements').insert({
        employee_id: employees[0].id,
        unit_id: units[0].id,
        original_deposit: originalDeposit,
        inspection_deductions: inspectionDeductions,
        issue_deductions: issueDeductions,
        final_amount: finalAmount,
        status: 'generated',
        client_id: clientId,
      });

      toast({
        title: 'Statement Generated',
        description: 'Security deposit statement has been created.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate statement.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading statement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-screen bg-background">
      {/* Header */}
      <div className="header-gradient text-primary-foreground p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveView(View.MAINTENANCE)}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg font-bold">Security Deposit Statement</h1>
            <p className="text-xs opacity-80">Unit 402-B • Bayside Community</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Summary Card */}
        <div className="bg-card rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Deposit Calculation</h2>
              <p className="text-sm text-muted-foreground">Automated from inspections & issues</p>
            </div>
          </div>

          {/* Original Deposit */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-foreground">Original Security Deposit</span>
            <span className="font-bold text-foreground">${originalDeposit.toFixed(2)}</span>
          </div>

          {/* Inspection Deductions */}
          {inspections.length > 0 && (
            <div className="py-3 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-foreground font-medium">Inspection Damages</span>
                <span className="text-destructive font-bold">-${inspectionDeductions.toFixed(2)}</span>
              </div>
              {inspections.map((inspection) => (
                <div key={inspection.id} className="flex items-center justify-between text-sm text-muted-foreground pl-4">
                  <span>{inspection.room_name}: {inspection.area_name}</span>
                  <span>-${inspection.repair_cost?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Issue Deductions */}
          {issues.length > 0 && (
            <div className="py-3 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-foreground font-medium">Reported Issues</span>
                <span className="text-destructive font-bold">-${issueDeductions.toFixed(2)}</span>
              </div>
              {issues.map((issue) => (
                <div key={issue.id} className="flex items-center justify-between text-sm text-muted-foreground pl-4">
                  <span>{issue.title}</span>
                  <span>-${issue.estimated_cost?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          {/* No Deductions */}
          {totalDeductions === 0 && (
            <div className="py-4 flex items-center gap-3 text-success">
              <Check className="w-5 h-5" />
              <span className="font-medium">No deductions - full deposit returned</span>
            </div>
          )}

          {/* Final Amount */}
          <div className="flex items-center justify-between pt-4 mt-2">
            <span className="text-lg font-bold text-foreground">Final Amount Due</span>
            <span className={`text-2xl font-bold ${finalAmount >= 0 ? 'text-success' : 'text-destructive'}`}>
              ${Math.abs(finalAmount).toFixed(2)}
              {finalAmount < 0 && <span className="text-sm ml-1">(owed)</span>}
            </span>
          </div>
        </div>

        {/* Warning if large deduction */}
        {totalDeductions > originalDeposit * 0.5 && (
          <div className="bg-warning/10 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">High Deduction Alert</p>
              <p className="text-sm text-muted-foreground">
                Deductions exceed 50% of the original deposit. Please review before finalizing.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <Button 
            onClick={handleGenerateStatement}
            className="w-full h-12 bg-success hover:bg-success/90"
          >
            <Check className="w-4 h-4 mr-2" />
            Generate Final Statement
          </Button>
          <Button variant="outline" className="w-full h-12">
            <Download className="w-4 h-4 mr-2" />
            Download as PDF
          </Button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-muted-foreground pt-4">
          Statement generated by Be Connect Platform<br />
          All deductions are calculated automatically from inspection reports and maintenance tickets.
        </p>
      </div>
    </div>
  );
};

export default FinalStatement;
