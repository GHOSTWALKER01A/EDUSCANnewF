import React from 'react';
import { Activity } from 'lucide-react';
import { AttendanceRow } from '@/src/types/attendance';
import AttendanceTable from './AttendanceTable';
import ExportButtons from './ExportButtons';

interface AttendanceLogCardProps {
  rows:       AttendanceRow[];
  hasMore:    boolean;
  onLoadMore: () => void;
  onRowClick: (row: AttendanceRow) => void;
}

export const AttendanceLogCard: React.FC<AttendanceLogCardProps> = ({ rows, hasMore, onLoadMore, onRowClick }) => (
  <div className="bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)]/30 rounded-3xl shadow-xl shadow-black/5 overflow-hidden flex flex-col">
    {/* Header */}
    <div className="p-6 sm:p-8 border-b border-[var(--border-color)]/20 flex flex-col sm:flex-row justify-between sm:items-center gap-5 bg-gradient-to-r from-[var(--card-bg)] to-transparent">
      <div className="flex items-center gap-4">
        <div className="bg-[var(--accent)]/10 p-3 rounded-xl border border-[var(--accent)]/10">
          <Activity className="w-6 h-6 text-[var(--accent)]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Attendance Log</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-1 font-medium">
            Complete historical record of your presence.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ExportButtons rows={rows} />
      </div>
    </div>

    {/* Table */}
    <div className="w-full bg-[var(--bg-primary)]/30 min-h-[400px]">
      <div className="p-0 sm:p-4">
        <div className="bg-[var(--card-bg)] sm:rounded-2xl overflow-hidden sm:border border-[var(--border-color)]/20">
          <AttendanceTable
            rows={rows}
            onRowClick={onRowClick}
            onLoadMore={onLoadMore}
            hasMore={hasMore}
          />
        </div>
      </div>
    </div>
  </div>
);
