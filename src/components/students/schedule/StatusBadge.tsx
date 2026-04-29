import React from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { ScheduleStatus } from '@/src/types/schedule';

export function StatusIndicator({ status, size = 'md' }: { status: ScheduleStatus; size?: 'sm' | 'md' }) {
  const s = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3';
  if (status === 'ongoing') return <div className={`${s} rounded-full bg-[var(--status-ongoing)] animate-pulse shadow-[0_0_8px_var(--status-ongoing)]`}></div>;
  if (status === 'cancelled') return <XCircle className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} text-[var(--status-cancelled)]`} />;
  if (status === 'completed') return <CheckCircle2 className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} text-[var(--status-completed)]`} />;
  if (status === 'rescheduled') return <AlertCircle className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} text-[var(--status-rescheduled)]`} />;
  return <div className={`${s} rounded-full bg-[var(--text-secondary)]`}></div>; // scheduled
}

export function StatusBadge({ status, size = 'md' }: { status: ScheduleStatus; size?: 'sm' | 'md' }) {
  const config = {
    ongoing: { color: 'text-[var(--status-ongoing)]', bg: 'bg-[var(--status-ongoing)]/10', border: 'border-[var(--status-ongoing)]/30', label: 'Ongoing' },
    cancelled: { color: 'text-[var(--status-cancelled)]', bg: 'bg-[var(--status-cancelled)]/10', border: 'border-[var(--status-cancelled)]/30', label: 'Cancelled' },
    rescheduled: { color: 'text-[var(--status-rescheduled)]', bg: 'bg-[var(--status-rescheduled)]/10', border: 'border-[var(--status-rescheduled)]/30', label: 'Rescheduled' },
    completed: { color: 'text-[var(--status-completed)]', bg: 'bg-[var(--status-completed)]/10', border: 'border-[var(--status-completed)]/30', label: 'Completed' },
    scheduled: { color: 'text-[var(--accent)]', bg: 'bg-[var(--accent)]/10', border: 'border-[var(--accent)]/30', label: 'Scheduled' }
  };
  const c = config[status] || config['scheduled'];
  const py = size === 'sm' ? 'py-0.5' : 'py-1';
  const px = size === 'sm' ? 'px-2' : 'px-3';
  const text = size === 'sm' ? 'text-[10px]' : 'text-xs';

  return (
    <div className={`inline-flex items-center gap-1.5 ${px} ${py} rounded-full ${text} font-bold uppercase tracking-wider ${c.bg} ${c.color} border ${c.border}`}>
      <StatusIndicator status={status} size={size} />
      {c.label}
    </div>
  );
}

export function StatusLegend({ label, dotColor }: { label: string; dotColor: string }) {
  return (
    <div className={`flex items-center gap-2.5 text-sm font-bold text-white bg-[var(--bg-secondary)]/80 backdrop-blur-xl px-5 py-2 rounded-full border border-[var(--border-color)]/50 shadow-lg hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-default ring-1 ring-white/5 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] group`}>
      <div className={`w-3 h-3 rounded-full ${dotColor} shadow-[0_0_10px_currentColor] group-hover:animate-ping`}></div>
      <span className="tracking-wide">{label}</span>
    </div>
  );
}
