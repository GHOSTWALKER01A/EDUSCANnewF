"use client";

import React from 'react';
import { Clock, MapPin, Users, BookOpen, Play, ClipboardList, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';
import { isBefore, isAfter, subMinutes, addMinutes, parse } from 'date-fns';

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; bg: string; dot: string; label: string }> = {
    ongoing: { color: 'text-green-400', bg: 'bg-green-400/10', dot: 'bg-green-400 animate-pulse', label: 'Ongoing' },
    completed: { color: 'text-[var(--text-secondary)]', bg: 'bg-[var(--bg-secondary)]', dot: 'bg-gray-500', label: 'Completed' },
    upcoming: { color: 'text-[var(--accent)]', bg: 'bg-[var(--accent)]/10', dot: 'bg-[var(--accent)]', label: 'Upcoming' }
  };
  const current = config[status];

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${current.bg} ${current.color} border border-current border-opacity-20`}>
      <span className={`w-2 h-2 rounded-full ${current.dot}`}></span>
      {current.label}
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactElement; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-[var(--text-secondary)]">
        {icon}
      </div>
      <div>
        <p className="text-xs text-[var(--text-secondary)] mb-0.5 uppercase tracking-wider font-medium">{label}</p>
        <p className="text-sm font-semibold text-gray-200">{value}</p>
      </div>
    </div>
  );
}

interface ClassCardProps {
  data: any;
  onOpenList: () => void;
  onStartSession: () => void;
}

export default function ClassCard({ data, onOpenList, onStartSession }: ClassCardProps) {
  const isOngoing = data.status === 'ongoing';
  const isCompleted = data.status === 'completed';
  const [sessionState, setSessionState] = React.useState({
    canStart: false,
    message: isCompleted ? 'Session Ended' : 'Start Session'
  });

  // Strict 15-minute validation logic based on class time
  React.useEffect(() => {
    if (isCompleted || isOngoing) return;

    const checkTime = () => {
      try {
        // Example time format: "11:00 AM - 12:30 PM"
        const [startTimeStr, endTimeStr] = data.time.split(' - ');
        
        // Parse the times assuming today's date
        const baseDate = new Date();
        const startTime = parse(startTimeStr, 'hh:mm a', baseDate);
        const endTime = parse(endTimeStr, 'hh:mm a', baseDate);

        // Strict allowance: Can only start strictly 15 minutes before the class ends
        const allowableWindowStart = subMinutes(endTime, 15);
        const allowableWindowEnd = endTime; // or slightly after if needed
        const now = new Date();

        if (isBefore(now, allowableWindowStart)) {
          setSessionState({ 
            canStart: false, 
            message: `Available at ${allowableWindowStart.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` 
          });
        } else if (isAfter(now, allowableWindowEnd)) {
           setSessionState({ canStart: false, message: 'Class timeframe passed' });
        } else {
           setSessionState({ canStart: true, message: 'Start Session & Show Key' });
        }
      } catch (e) {
        // Fallback if parsing fails
        setSessionState({ canStart: true, message: 'Start Session' });
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 30000); // Recheck every 30s
    return () => clearInterval(interval);
  }, [data.time, isCompleted, isOngoing]);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  return (
    <motion.div 
      variants={itemVariants} 
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`group relative bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)]/30 p-6 md:p-8 rounded-3xl shadow-xl shadow-black/5 overflow-hidden transition-all duration-300 hover:border-indigo-500/40 hover:shadow-indigo-500/10 flex flex-col lg:flex-row gap-8 lg:items-center justify-between ${
        isOngoing ? 'shadow-[0_0_30px_rgba(194,184,255,0.2)] border-[var(--accent)]/50' : ''
      }`}
    >
      {isOngoing && (
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[var(--accent)] via-purple-500 to-[var(--accent)] opacity-20 p-[1px] [mask-image:linear-gradient(white,white)] -z-10 animate-[pulse_3s_ease-in-out_infinite]"></div>
      )}

      {/* Background Icon Watermark effect similar to StatsGrid */}
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 pointer-events-none text-[var(--accent)]">
        <Users className="w-32 h-32" />
      </div>

      <div className="flex-1 space-y-5 relative z-10 w-full">
        <div className="flex items-center gap-3">
          <StatusBadge status={data.status} />
          <div className="flex items-center gap-2 text-[var(--accent)] font-medium bg-[var(--accent)]/10 px-3 py-1 rounded-full text-sm border border-[var(--accent)]/20">
            <Clock className="w-4 h-4" />
            {data.time}
          </div>
        </div>
        
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold text-white bg-white/10 px-2.5 py-1 rounded uppercase tracking-wider border border-white/10 shadow-sm backdrop-blur-md">
              {data.code}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white group-hover:text-[var(--accent)] transition-colors tracking-tight">
            {data.subject}
          </h2>
        </div>
      </div>

      <div className="flex-[1.2] grid grid-cols-2 gap-y-6 gap-x-6 relative z-10 w-full">
        <div className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--bg-secondary)]/30 border border-white/5 group/detail hover:bg-[var(--bg-secondary)]/50 transition-colors">
           <div className="bg-[var(--accent)]/10 p-2.5 rounded-xl text-[var(--accent)] group-hover/detail:scale-110 transition-transform">
             <MapPin className="w-5 h-5" />
           </div>
           <div>
             <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-bold mb-1">Location</p>
             <p className="text-sm font-bold text-gray-200">{data.room}, {data.building}</p>
           </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--bg-secondary)]/30 border border-white/5 group/detail hover:bg-[var(--bg-secondary)]/50 transition-colors">
           <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-500 group-hover/detail:scale-110 transition-transform">
             <BookOpen className="w-5 h-5" />
           </div>
           <div>
             <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-bold mb-1">Program</p>
             <p className="text-sm font-bold text-gray-200">{data.branch} • {data.semester}</p>
           </div>
        </div>
        
        <div className="col-span-2 bg-[var(--card-bg)]/60 border border-[var(--border-color)]/50 rounded-2xl p-4 md:p-5 flex items-center gap-5 shadow-inner">
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-[var(--text-secondary)] mb-1.5 font-medium uppercase tracking-wider">Students Expected</p>
            <div className="flex items-end justify-between">
              <p className="font-extrabold text-white text-2xl">
                {isCompleted ? <span className="text-[var(--accent)] drop-shadow-[0_0_8px_rgba(194,184,255,0.4)]">{data.studentsPresent || 0}</span> : data.totalStudents}
                {isCompleted && <span className="text-lg text-[var(--text-secondary)] ml-1">/ {data.totalStudents}</span>}
              </p>
            </div>
            {isCompleted && (
              <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden mt-3 shadow-inner">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-[var(--accent)]" style={{ width: `${((data.studentsPresent || 0) / (data.totalStudents || 1)) * 100}%` }}></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:w-56 lg:border-l lg:border-white/10 lg:pl-8 relative z-10 w-full">
        <button 
          onClick={onStartSession}
          disabled={isCompleted || (!isOngoing && !sessionState.canStart)}
          className={`group/btn relative w-full flex items-center justify-center gap-2.5 py-4 px-4 rounded-xl font-bold transition-all overflow-hidden shadow-lg ${
            isCompleted || (!isOngoing && !sessionState.canStart)
              ? 'bg-[var(--bg-secondary)]/80 text-[var(--text-secondary)] cursor-not-allowed border border-white/5' 
              : 'bg-gradient-to-r from-[var(--accent)] to-indigo-600 text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:-translate-y-0.5 active:translate-y-0'
          }`}
        >
          {(!isCompleted && (isOngoing || sessionState.canStart)) && <span className="absolute top-0 left-[-100%] w-1/2 h-full bg-white/20 skew-x-[-20deg] group-hover/btn:animate-[shine_1.5s_ease-in-out_infinite]"></span>}
          <Play className={`w-5 h-5 flex-shrink-0 ${(isCompleted || (!isOngoing && !sessionState.canStart)) ? '' : 'fill-current group-hover/btn:scale-110 transition-transform'}`} />
          <span className="relative z-10 text-sm md:text-base tracking-wide">
            {isOngoing ? 'Resume Session' : sessionState.message}
          </span>
        </button>
        <button 
          onClick={onOpenList}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-[var(--bg-secondary)]/50 border border-white/10 text-white/90 font-medium hover:border-white/20 hover:bg-[var(--bg-secondary)] transition-all group/roster"
        >
          <ClipboardList className="w-4 h-4 text-[var(--text-secondary)] group-hover/roster:text-white transition-colors" />
          View Roster
        </button>
        <div className="mt-1 w-full text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-bold text-center flex items-center justify-center gap-1.5 opacity-80">
          <Wifi className="w-3 h-3 text-[var(--accent)]" /> Telemetry Active
        </div>
      </div>
    </motion.div>
  );
}
