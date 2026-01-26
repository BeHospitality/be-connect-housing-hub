import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down';
  };
  icon: LucideIcon;
  variant?: 'cyan' | 'warning' | 'default';
  alert?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  variant = 'default',
  alert = false,
}) => {
  const borderClass = variant === 'cyan' 
    ? 'border-l-secondary' 
    : variant === 'warning' 
    ? 'border-l-warning' 
    : 'border-l-muted';

  return (
    <div className={`stat-card ${borderClass}`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {title}
        </span>
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      
      <div className="text-3xl font-bold text-foreground mb-1">
        {value}
      </div>
      
      {trend && (
        <div className="flex items-center gap-1">
          {trend.direction === 'up' ? (
            <TrendingUp className="w-4 h-4 text-success" />
          ) : (
            <TrendingDown className="w-4 h-4 text-destructive" />
          )}
          <span className={`text-sm font-medium ${
            trend.direction === 'up' ? 'text-success' : 'text-destructive'
          }`}>
            {trend.value}
          </span>
          {subtitle && (
            <span className="text-sm text-muted-foreground">{subtitle}</span>
          )}
        </div>
      )}
      
      {!trend && subtitle && (
        <p className={`text-sm ${alert ? 'text-warning font-medium' : 'text-muted-foreground'}`}>
          {alert && '⚠ '}{subtitle}
        </p>
      )}
    </div>
  );
};

export default StatCard;
