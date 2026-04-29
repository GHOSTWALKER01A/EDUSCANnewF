import React from 'react';
import { MapPin, Users } from 'lucide-react';
import { StatusBadge } from '@/src/components/students/schedule/StatusBadge';
import { TeacherSubjectData } from '@/src/types/schedule';

interface TooltipProps {
  data: TeacherSubjectData & { time: string };
  mousePos: { x: number; y: number };
}

export function TeacherFloatingTooltip({ data, mousePos }: TooltipProps) {
  // Offset the tooltip slightly from the cursor
  const x = mousePos.x + 15;
  const y = mousePos.y + 15;

  return (
    <div 
      className="fixed z-[100] pointer-events-none transition-opacity duration-200 animate-fade-in"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      <div className="bg-[#1a1033]/95 backdrop-blur-xl border border-[var(--accent)]/40 p-4 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] w-[260px]">
        <div className="flex justify-between items-start mb-2">
          <StatusBadge status={data.status} size="sm" />
          <span className="text-xs font-mono font-bold text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded">{data.time}</span>
        </div>
        
        <h4 className="text-lg font-bold text-white mb-3 leading-tight">{data.subject}</h4>
        
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <MapPin className="w-4 h-4 text-[var(--accent)]/70" /> {data.room}
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Users className="w-4 h-4 text-[var(--accent)]/70" /> {data.classGroup}
          </div>
        </div>

        {data.status === 'rescheduled' && (
          <div className="mt-3 bg-[var(--status-rescheduled)]/10 border border-[var(--status-rescheduled)]/30 p-2 rounded-lg text-xs">
            <span className="text-[var(--status-rescheduled)] font-bold">Moved to:</span> <br/>
            <span className="text-white">{data.rescheduledTo}</span>
          </div>
        )}
      </div>
    </div>
  );
}
