import React from 'react';
import { PieChart } from 'lucide-react';
import AttendanceSummary from './AttendanceSummary';

interface OverviewMetricsCardProps {
  summary: any;
}

export const OverviewMetricsCard: React.FC<OverviewMetricsCardProps> = ({ summary }) => (
  <div className="bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)]/30 rounded-3xl shadow-2xl shadow-black/10 overflow-hidden hover:shadow-[0_0_30px_rgba(194,184,255,0.1)] transition-all duration-500 flex flex-col relative group">
    {/* Glow effects */}
    <div className="absolute top-[-80px] right-[-80px] w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    <div className="absolute bottom-[-80px] left-[-80px] w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

    {/* Header */}
    <div className="px-6 sm:px-8 py-6 border-b border-[var(--border-color)]/20 bg-gradient-to-br from-[var(--bg-secondary)]/80 to-transparent relative z-10">
      <div className="flex justify-between items-center mb-1.5">
        <h3 className="text-xl font-extrabold text-[var(--text-primary)] flex items-center gap-3 tracking-tight">
          <div className="bg-[var(--accent)]/10 p-2.5 rounded-xl border border-[var(--accent)]/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
            <PieChart className="w-5 h-5 text-[var(--accent)]" />
          </div>
          Overview Metrics
        </h3>
        <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full flex items-center gap-2 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          Live Sync
        </div>
      </div>
      <p className="text-[var(--text-secondary)] text-sm ml-14 font-medium">
        Your semester attendance health at a glance.
      </p>
    </div>

    {/* Body */}
    <div className="p-6 sm:p-8 flex-grow flex items-center relative z-10 bg-gradient-to-b from-transparent to-[var(--bg-primary)]/30">
      <AttendanceSummary summary={summary} />
    </div>
  </div>
);
