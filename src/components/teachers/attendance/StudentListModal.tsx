"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, XCircle, Clock4, Loader2, ClipboardList } from 'lucide-react';

function StatBox({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-3 text-center transition-colors hover:border-[var(--accent)]/30">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mt-1 font-medium">{label}</p>
    </div>
  );
}

function StudentStatusBadge({ status }: { status: string }) {
  if (status === 'present') return <div className="inline-flex flex-shrink-0 items-center gap-1.5 text-[var(--success)] bg-[var(--success)]/10 px-3 py-1.5 rounded-lg text-xs font-bold uppercase border border-[var(--success)]/20"><CheckCircle2 className="w-3.5 h-3.5" /> Present</div>;
  if (status === 'absent') return <div className="inline-flex flex-shrink-0 items-center gap-1.5 text-[var(--danger)] bg-[var(--danger)]/10 px-3 py-1.5 rounded-lg text-xs font-bold uppercase border border-[var(--danger)]/20"><XCircle className="w-3.5 h-3.5" /> Absent</div>;
  if (status === 'late') return <div className="inline-flex flex-shrink-0 items-center gap-1.5 text-[var(--warning)] bg-[var(--warning)]/10 px-3 py-1.5 rounded-lg text-xs font-bold uppercase border border-[var(--warning)]/20"><Clock4 className="w-3.5 h-3.5" /> Late</div>;
  return <div className="inline-flex flex-shrink-0 items-center gap-1.5 text-gray-400 bg-gray-500/10 px-3 py-1.5 rounded-lg text-xs font-bold uppercase border border-gray-500/20">Pending</div>;
}

interface StudentListModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: any;
  students: any[];
  isLoading: boolean;
}

export default function StudentListModal({ isOpen, onClose, classData, students, isLoading }: StudentListModalProps) {
  return (
    <AnimatePresence>
      {isOpen && classData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pb-20">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[#0B0A0F]/80 backdrop-blur-md" 
            onClick={onClose}
          />
          
          {/* Centered Popup Panel */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-[var(--card-bg)]/40 backdrop-blur-3xl border border-[var(--border-color)]/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col rounded-3xl overflow-hidden"
          >
            {/* Header Section */}
            <div className="p-6 md:p-8 border-b border-[var(--border-color)]/30 bg-[var(--bg-secondary)]/30 backdrop-blur-sm relative z-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2 tracking-tight">{classData.subject}</h3>
                  <p className="text-sm md:text-base font-medium text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1 rounded-full inline-flex border border-[var(--accent)]/20">
                    {classData.code} • {classData.branch}
                  </p>
                </div>
                <button onClick={onClose} className="p-2.5 text-[var(--text-secondary)] hover:text-white bg-[var(--card-bg)] hover:bg-[var(--danger)] hover:border-[var(--danger)] border border-[var(--border-color)] rounded-full transition-all group shadow-sm z-20">
                  <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 relative z-10">
                <StatBox label="Total Expected" value={students.length} color="text-white" />
                <StatBox label="Present" value={students.filter(s => s.status === 'present').length} color="text-[var(--success)]" />
                <StatBox label="Absent" value={students.filter(s => s.status === 'absent').length} color="text-[var(--danger)]" />
                <StatBox label="Pending/Late" value={students.filter(s => s.status === 'pending' || s.status === 'late').length} color="text-[var(--warning)]" />
              </div>
            </div>

            {/* Student List Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[var(--bg-primary)]/40 relative z-10 custom-scrollbar">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-[var(--text-secondary)]">
                  <Loader2 className="w-12 h-12 animate-spin mb-4 text-[var(--accent)]" />
                  <p className="font-medium animate-pulse">Syncing student records...</p>
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-20 text-[var(--text-secondary)]">
                  <div className="w-20 h-20 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-6 opacity-50">
                    <ClipboardList className="w-8 h-8" />
                  </div>
                  <p className="text-lg font-medium text-white mb-2">No Students Found</p>
                  <p className="text-sm">Cannot find enrollment data for this class.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {students.map((student, i) => (
                    <motion.div
                      key={student.id || i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group flex items-center justify-between p-4 rounded-xl border border-[var(--border-color)]/30 bg-[var(--bg-secondary)]/30 hover:bg-[var(--bg-secondary)] hover:border-[var(--accent)]/30 hover:shadow-lg transition-all"
                    >
                      <div>
                        <p className="font-bold text-gray-200 group-hover:text-white transition-colors">{student.name}</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono tracking-wide">{student.regNo || student.roll}</p>
                        {student.method && (
                           <p className="text-[10px] text-[var(--accent)] mt-0.5 opacity-80 uppercase tracking-wider">{student.method}</p>
                        )}
                      </div>
                      <StudentStatusBadge status={student.status} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/50 text-center text-xs text-[var(--text-secondary)] font-medium tracking-wide">
              {students.length} Total Registered Identities
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
