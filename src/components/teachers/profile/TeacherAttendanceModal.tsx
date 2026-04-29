import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, CalendarDays, CheckCircle2 } from 'lucide-react';
import type { TeacherAttendanceStats } from '@/src/hooks/useTeacherAttendanceStats';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  stats?: TeacherAttendanceStats;
};

export default function TeacherAttendanceModal({ isOpen, onClose, stats }: Props) {
  if (!stats) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-[var(--card-bg)]/90 backdrop-blur-2xl border border-[var(--border-color)]/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--border-color)]/30 flex items-center justify-between bg-gradient-to-r from-rose-500/10 to-transparent shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/20">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-[var(--text-primary)]">Attendance Report</h2>
                  <p className="text-sm text-[var(--text-secondary)] font-medium mt-1">Semester Overview & Month-wise Breakdown</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-[var(--text-secondary)] hover:text-white rounded-full hover:bg-[var(--bg-primary)] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-[var(--bg-primary)]/30 space-y-6">
              
              {/* Overall Semester Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--card-bg)] border border-[var(--border-color)]/50 rounded-2xl p-5 shadow-lg flex items-center gap-4">
                   <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                      <CheckCircle2 className="w-6 h-6" />
                   </div>
                   <div>
                     <p className="text-sm text-[var(--text-secondary)] font-medium">Classes Attended</p>
                     <p className="text-2xl font-black text-white">{stats.classesAttended} <span className="text-sm text-[var(--text-secondary)] font-medium">/ {stats.totalClasses}</span></p>
                   </div>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--border-color)]/50 rounded-2xl p-5 shadow-lg flex items-center gap-4">
                   <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
                      <Activity className="w-6 h-6" />
                   </div>
                   <div>
                     <p className="text-sm text-[var(--text-secondary)] font-medium">Semester Rate</p>
                     <p className="text-2xl font-black text-white">{stats.rate}%</p>
                   </div>
                </div>
              </div>

              {/* Month-wise breakdown */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-[var(--accent)]" />
                  Monthly Breakdown
                </h3>
                
                {stats.monthWise.length === 0 ? (
                  <div className="text-center py-10 text-[var(--text-secondary)]">
                    <p>No classes scheduled yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats.monthWise.map((monthData, idx) => (
                      <div key={idx} className="bg-[var(--card-bg)] border border-[var(--border-color)]/30 rounded-2xl p-4 flex items-center justify-between hover:border-[var(--accent)]/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[var(--bg-secondary)] rounded-xl flex items-center justify-center font-bold text-[var(--text-primary)] border border-white/5">
                            {monthData.month}
                          </div>
                          <div>
                            <p className="font-semibold text-white">Attendance: {monthData.rate}%</p>
                            <p className="text-xs text-[var(--text-secondary)] mt-0.5">{monthData.attended} out of {monthData.total} classes conducted</p>
                          </div>
                        </div>
                        
                        <div className="w-24 bg-[var(--bg-secondary)] rounded-full h-2.5 overflow-hidden border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${monthData.rate}%` }}
                            transition={{ duration: 1, delay: 0.1 * idx, ease: "easeOut" }}
                            className={`h-full rounded-full ${monthData.rate >= 80 ? 'bg-emerald-500' : monthData.rate >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
