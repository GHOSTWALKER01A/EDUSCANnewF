import React from 'react';
import { TrendingUp } from 'lucide-react';
import AttendanceCharts from './AttendanceCharts';

interface AttendanceTrendCardProps {
  series: { date: string; value: number }[] | undefined;
}

export const AttendanceTrendCard: React.FC<AttendanceTrendCardProps> = ({ series }) => (
  <div className="bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)]/30 p-6 sm:p-8 border-b-4 border-b-indigo-500/50 rounded-3xl shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-shadow duration-500">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-6 h-6 text-indigo-500" />
        <h3 className="text-xl font-bold text-[var(--text-primary)]">Attendance Trend</h3>
      </div>
    </div>

    <div className="h-[350px] w-full relative">
      {series ? (
        <AttendanceCharts series={series} />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-primary)]/20 rounded-2xl border border-[var(--border-color)]/20">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-[var(--accent)] rounded-full animate-spin" />
            <span className="text-[var(--text-secondary)] font-medium text-sm tracking-widest uppercase">
              Syncing Visual Data...
            </span>
          </div>
        </div>
      )}
    </div>
  </div>
);
