import React from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  accent?: 'primary' | 'secondary' | 'success';
}

const bubbleStyles = {
  primary: 'bg-primary/10 text-primary border-primary/30',
  secondary: 'bg-secondary/10 text-secondary border-secondary/30',
  success: 'bg-success/10 text-success border-success/30',
};

const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value, accent = 'primary' }) => {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-elegant"
      aria-label={`${label}: ${value}`}
    >
      <div className="absolute inset-x-6 top-3 h-16 rounded-full bg-gradient-primary/10 blur-3xl" />
      <div className="relative flex items-center justify-between gap-4 p-6">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">{label}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div
          className={cn(
            'flex h-14 w-14 items-center justify-center rounded-2xl border text-2xl shadow-inner transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow',
            bubbleStyles[accent]
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
