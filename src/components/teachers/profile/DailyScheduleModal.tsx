import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarClock, Building2, Users, CheckCircle, Bell, Clock } from "lucide-react";
import Button from "@/src/components/UI/Button";
import type { ClassItem } from "@/src/types/class.types";
import { toast } from "react-toastify";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  classes: ClassItem[];
  onOpenReschedule: (classId: string) => void;
  onOpenStudents: (classId: string) => void;
  onConfirmClass?: (classId: string) => Promise<void>;
};

export default function DailyScheduleModal({ isOpen, onClose, classes, onOpenReschedule, onOpenStudents, onConfirmClass }: Props) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const handleConfirm = async (classId: string, subject: string) => {
    if (onConfirmClass) {
      try {
        setConfirmingId(classId);
        await onConfirmClass(classId);
        toast.success(`Class confirmed! A reminder will be sent 15 mins before ${subject} starts.`);
      } catch (err: any) {
        console.error("Failed to confirm class:", err);
        toast.error(err?.response?.data?.message || "Failed to confirm class");
      } finally {
        setConfirmingId(null);
      }
    } else {
      toast.success(`Class confirmed! A reminder will be sent 15 mins before ${subject} starts.`);
    }
  };

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
            className="relative w-full max-w-4xl bg-[var(--card-bg)]/90 backdrop-blur-2xl border border-[var(--border-color)]/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--border-color)]/30 flex items-center justify-between bg-gradient-to-r from-[var(--bg-secondary)]/80 to-transparent shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
                  <CalendarClock className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-[var(--text-primary)]">Daily Schedule</h2>
                  <p className="text-sm text-[var(--text-secondary)] font-medium mt-1">Manage and confirm your classes for today</p>
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
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-[var(--bg-primary)]/30">
              {classes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-[var(--text-secondary)]">
                  <div className="w-20 h-20 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mb-6">
                    <span className="text-4xl">🎉</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No Classes Today</h3>
                  <p className="text-sm max-w-sm text-center">You have no classes scheduled for today.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {classes.map((c) => {
                    const isConfirmed = c.isConfirmed;
                    const isConfirming = confirmingId === c._id;
                    
                    return (
                      <motion.div
                        key={c._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`group relative bg-[var(--card-bg)] border ${isConfirmed ? 'border-emerald-500/30 shadow-emerald-500/5' : 'border-[var(--border-color)]/50'} rounded-2xl p-5 hover:border-[var(--accent)]/50 transition-all duration-300 shadow-lg`}
                      >
                        {isConfirmed && (
                          <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Confirmed
                          </div>
                        )}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1">{c.subject}</h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)]">
                              {c.branch}
                            </span>
                          </div>
                          <div 
                            className="flex items-center gap-1.5 text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1.5 rounded-xl text-sm font-bold cursor-pointer hover:bg-[var(--accent)]/20 transition-colors"
                            onClick={() => onOpenStudents(c._id)}
                            title="View Students"
                          >
                            <Users className="w-4 h-4" />
                            {c.studentsPresent || 0} / {c.totalStudents || 0}
                          </div>
                        </div>

                        <div className="space-y-2 mb-6">
                          <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)] font-medium">
                            <Clock className="w-4 h-4 text-indigo-400" />
                            <span>{c.time}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)] font-medium">
                            <Building2 className="w-4 h-4 text-emerald-400" />
                            <span>{c.room || 'TBD'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-color)]/30">
                          <button
                            onClick={() => {
                               onClose();
                               onOpenReschedule(c._id);
                            }}
                            className="flex-1 py-2.5 rounded-xl border border-[var(--border-color)]/50 text-[var(--text-primary)] font-semibold text-sm hover:bg-[var(--bg-secondary)] hover:border-[var(--accent)]/50 transition-all"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleConfirm(c._id, c.subject)}
                            disabled={isConfirmed || isConfirming}
                            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                              isConfirmed 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 cursor-not-allowed'
                                : 'bg-[var(--accent)] text-white hover:bg-[#9f7aea] hover:shadow-lg shadow-[var(--accent)]/20 disabled:opacity-50 disabled:cursor-wait'
                            }`}
                          >
                            {isConfirmed ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Confirmed
                              </>
                            ) : isConfirming ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Confirming...
                              </>
                            ) : (
                              <>
                                <Bell className="w-4 h-4" />
                                Confirm
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
