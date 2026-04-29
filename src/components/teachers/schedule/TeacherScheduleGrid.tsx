import React from 'react';
import { ArrowRightCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatusIndicator } from '@/src/components/students/schedule/StatusBadge';
import { TeacherScheduleSlot, TeacherSubjectData } from '@/src/types/schedule';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;

interface TeacherScheduleGridProps {
  scheduleData: TeacherScheduleSlot[];
  selectedDay: string;
  onHover: (e: React.MouseEvent, subject: TeacherSubjectData, time: string) => void;
  onLeave: () => void;
  onClick: (subject: TeacherSubjectData, time: string) => void;
}

export function TeacherScheduleGrid({ scheduleData, selectedDay, onHover, onLeave, onClick }: TeacherScheduleGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } }
  };

  return (
    <div className="glass-card rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-[var(--border-color)]/30 backdrop-blur-xl relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 via-transparent to-indigo-500/5 pointer-events-none" />
      <div className="overflow-x-auto custom-scrollbar rounded-[1.8rem] bg-[var(--bg-primary)]/60 relative z-10 pb-4">
        <table className="w-full min-w-[1050px] border-collapse text-left">
          <thead>
            <tr>
              <th className="px-6 py-5 bg-[#120a21] text-[var(--accent)] font-extrabold uppercase tracking-[0.2em] text-sm w-[150px] border-b border-[var(--border-color)] sticky left-0 z-30 shadow-[2px_0_10px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-2">Time</div>
              </th>
              {DAYS.map(day => (
                <th key={day} className="px-6 py-5 bg-[var(--bg-secondary)]/90 text-white font-extrabold uppercase tracking-widest text-sm border-b border-[var(--border-color)] backdrop-blur-md">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <motion.tbody variants={container} initial="hidden" animate="show">
            {scheduleData.map((slot, index) => (
              slot.recess ? (
                <motion.tr variants={item} key={index} className="bg-gradient-to-r from-[var(--accent)]/10 to-indigo-500/5 group border-l-4 border-[var(--accent)] relative overflow-hidden h-[90px]">
                  <td className="px-6 py-4 border-b border-[var(--border-color)]/30 font-mono text-indigo-300 font-bold text-sm sticky left-0 bg-[#0c0716] z-20 whitespace-nowrap shadow-[2px_0_10px_rgba(0,0,0,0.2)]">
                    {slot.time}
                  </td>
                  <td colSpan={5} className="px-6 py-4 border-b border-[var(--border-color)]/30 text-center relative">
                     {/* Animated background glow for recess */}
                     <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/20 via-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl pointer-events-none"></div>
                     <span className="relative z-10 inline-flex items-center gap-3 text-white font-extrabold tracking-[0.3em] uppercase text-sm bg-gradient-to-r from-[var(--accent)] to-indigo-500 px-8 py-2.5 rounded-full shadow-[0_0_20px_var(--accent-glow)] transform group-hover:scale-105 transition-transform duration-300 border border-white/20">
                      ☕ Recess Break
                    </span>
                  </td>
                </motion.tr>
              ) : (
                <motion.tr variants={item} key={index} className="hover:bg-[var(--bg-secondary)]/40 transition-colors border-l-4 border-transparent hover:border-indigo-400 group">
                  <td className="px-6 py-4 border-b border-[var(--border-color)]/30 font-mono text-white text-sm font-bold sticky left-0 bg-[#0c0716] z-20 whitespace-nowrap shadow-[2px_0_10px_rgba(0,0,0,0.2)]">
                    {slot.time}
                  </td>
                  
                  {DAYS.map((day, dayIndex) => {
                    const subject = slot.subjects?.find(s => s.day === day);
                    if (!subject) return (
                      <td key={dayIndex} className="border-b border-[var(--border-color)]/30 p-2 relative h-[80px]">
                        {/* Free Period styling */}
                        <div className={`w-full h-full min-h-[85px] rounded-xl flex items-center justify-center border-2 border-dashed border-[var(--border-color)]/30 bg-[var(--bg-primary)]/30 ${selectedDay === day ? 'ring-1 ring-[var(--border-color)]/50' : ''}`}>
                          <span className="text-[var(--text-secondary)]/50 text-xs font-bold uppercase tracking-widest px-3 py-1 bg-[var(--bg-secondary)]/30 rounded-lg">Free Period</span>
                        </div>
                      </td>
                    );

                    return (
                      <td key={dayIndex} className="border-b border-[var(--border-color)]/30 p-2 relative h-[80px]">
                        <GridCellCard 
                          subject={subject} 
                          isSelectedDay={selectedDay === day}
                          onHover={(e) => onHover(e, subject, slot.time)}
                          onLeave={onLeave}
                          onClick={() => onClick(subject, slot.time)}
                        />
                      </td>
                    );
                  })}
                </motion.tr>
              )
            ))}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
}

function GridCellCard({ subject, isSelectedDay, onHover, onLeave, onClick }: { 
  subject: TeacherSubjectData, 
  isSelectedDay: boolean,
  onHover: (e: React.MouseEvent) => void,
  onLeave: () => void,
  onClick: () => void
}) {
  const statusStyles = {
    ongoing: 'border-blue-500/50 bg-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.3)] ring-1 ring-blue-400/50',
    cancelled: 'border-red-500/30 bg-red-500/10 opacity-80',
    rescheduled: 'border-amber-500/40 bg-amber-500/15',
    completed: 'border-emerald-500/30 bg-emerald-500/10 opacity-70 grayscale-[20%]',
    scheduled: 'border-[var(--border-color)]/50 bg-[var(--card-bg)]/80 backdrop-blur-md'
  };

  const textColors = {
    ongoing: 'text-blue-100',
    cancelled: 'text-red-200 line-through',
    rescheduled: 'text-amber-100',
    completed: 'text-emerald-100',
    scheduled: 'text-white'
  };

  const glowStyles = {
    ongoing: 'absolute inset-0 bg-blue-500/20 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500',
    cancelled: '',
    rescheduled: '',
    completed: '',
    scheduled: 'absolute inset-0 bg-[var(--accent)]/10 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500'
  }

  return (
    <div 
      className={`w-full h-full min-h-[85px] rounded-xl p-3.5 flex flex-col justify-center cursor-pointer transition-all duration-500 border relative overflow-hidden group hover:scale-[1.02] hover:z-10 ${statusStyles[subject.status]} ${isSelectedDay ? 'ring-2 ring-[var(--accent)] shadow-[0_0_15px_var(--accent-glow)]' : ''}`}
      onMouseMove={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {/* Dynamic Hover Glow */}
      <div className={glowStyles[subject.status]}></div>

      {/* Ongoing Pulse Animation */}
      {subject.status === 'ongoing' && (
        <div className="absolute -top-2 -right-2 w-12 h-12 bg-blue-500/30 rounded-full blur-xl animate-pulse"></div>
      )}

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-start justify-between gap-2">
          <h4 className={`text-sm font-extrabold leading-snug line-clamp-2 drop-shadow-sm transition-colors duration-300 ${textColors[subject.status]}`}>
            {subject.classGroup} - {subject.subject}
          </h4>
          <div className="mt-0.5 ml-1 flex-shrink-0 bg-[var(--bg-primary)]/40 p-1 rounded-full backdrop-blur-sm">
            <StatusIndicator status={subject.status} size="sm" />
          </div>
        </div>
        
        <div className="mt-2 flex flex-col gap-1">
          {subject.status === 'rescheduled' && (
            <p className="text-[10px] text-amber-300 font-bold flex items-center gap-1.5 uppercase tracking-wider bg-amber-500/20 px-2 py-0.5 rounded w-fit">
              <ArrowRightCircle className="w-3 h-3" /> {subject.rescheduledTo?.split(',')[0]}
            </p>
          )}
          {subject.status === 'cancelled' && (
            <p className="text-[10px] text-red-300 font-bold uppercase tracking-widest bg-red-500/20 px-2 py-0.5 rounded w-fit">Cancelled</p>
          )}
          {subject.status === 'ongoing' && (
             <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest bg-blue-500/20 px-2 py-0.5 rounded w-fit animate-pulse">Live Now</p>
          )}
          {subject.status === 'scheduled' && (
             <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest bg-[var(--bg-secondary)]/50 px-2 py-0.5 rounded w-fit">Room: {subject.room}</p>
          )}
        </div>
      </div>
    </div>
  );
}
