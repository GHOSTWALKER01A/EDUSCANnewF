import React from 'react';
import { Clock, MapPin, User, Calendar } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { SubjectData } from '@/src/types/schedule';

interface DailyDetailCardProps {
  subject: SubjectData;
  time: string;
  onClick: () => void;
}

export function DailyDetailCard({ subject, time, onClick }: DailyDetailCardProps) {
  const statusBg = {
    ongoing: 'bg-[var(--status-ongoing)]/10 border-[var(--status-ongoing)]/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]',
    cancelled: 'bg-[var(--status-cancelled)]/5 border-[var(--status-cancelled)]/20',
    rescheduled: 'bg-[var(--status-rescheduled)]/10 border-[var(--status-rescheduled)]/30',
    completed: 'bg-[var(--bg-secondary)] border-[var(--border-color)]/30',
    scheduled: 'bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)]/30'
  };

  return (
    <div 
      onClick={onClick}
      className={`rounded-3xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] cursor-pointer group relative overflow-hidden ${statusBg[subject.status]}`}
    >
      {/* Background glow for ongoing */}
      {subject.status === 'ongoing' && (
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-[var(--status-ongoing)] rounded-full blur-[80px] opacity-30 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none"></div>
      )}

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-5">
          <div className="inline-flex items-center gap-2 bg-[var(--bg-primary)]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[var(--border-color)]/50 shadow-sm">
            <Clock className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-sm font-mono font-bold text-white tracking-wide">{time}</span>
          </div>
          <StatusBadge status={subject.status} size="md" />
        </div>

        <h3 className={`text-2xl font-extrabold tracking-tight mb-5 ${subject.status === 'cancelled' ? 'line-through text-[var(--text-secondary)]' : 'text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--accent)] group-hover:to-indigo-400 transition-all duration-300'}`}>
          {subject.subject}
        </h3>

        <div className="space-y-3 bg-[var(--bg-primary)]/40 p-4 rounded-2xl border border-[var(--border-color)]/20">
          <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)] font-medium">
            <div className="p-1.5 bg-[var(--accent)]/10 rounded-lg">
              <MapPin className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <span className="text-white">{subject.room}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)] font-medium">
            <div className="p-1.5 bg-indigo-500/10 rounded-lg">
              <User className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-white">{subject.teacher}</span>
          </div>
        </div>

        {subject.status === 'rescheduled' && (
          <div className="mt-5 pt-4 border-t border-[var(--border-color)]/30">
            <p className="text-xs text-[var(--status-rescheduled)] font-bold uppercase tracking-wider mb-2">Moved To</p>
            <p className="text-sm font-bold text-white flex items-center gap-2 bg-[var(--status-rescheduled)]/10 p-3 rounded-xl border border-[var(--status-rescheduled)]/20">
              <Calendar className="w-4 h-4" /> {subject.rescheduledTo}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
