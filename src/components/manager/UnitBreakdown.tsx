import React from 'react';

interface BreakdownItem {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

interface UnitBreakdownProps {
  items: BreakdownItem[];
}

const UnitBreakdown: React.FC<UnitBreakdownProps> = ({ items }) => {
  return (
    <div className="bg-card rounded-xl p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-foreground">Unit Breakdown</h3>
        <p className="text-sm text-muted-foreground">Real-time status of all properties</p>
      </div>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {item.count} ({item.percentage}%)
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${item.percentage}%`,
                  backgroundColor: item.color 
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnitBreakdown;
