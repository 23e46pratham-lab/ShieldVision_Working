import React from 'react';
import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface StatsCardProps {
  label: string;
  value: string | number;
  subLabel?: string;
  icon: LucideIcon;
  colorClass?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, subLabel, icon: Icon, colorClass = "text-blue-600" }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center transition-all hover:shadow-md">
      <div className={clsx("p-3 rounded-full bg-slate-50 mb-4", colorClass)}>
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <h3 className="text-3xl font-bold text-slate-800 mb-1">{value}</h3>
      <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      {subLabel && <p className="text-xs text-slate-400 mt-2">{subLabel}</p>}
    </div>
  );
};

export default StatsCard;