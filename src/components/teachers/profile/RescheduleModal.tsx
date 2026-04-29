import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarClock } from "lucide-react";
import Button from "@/src/components/UI/Button";

type RescheduleFormState = {
  newDate: string;
  newTime: string;
  newRoom: string;
};

type Props = {
  isOpen: boolean;
  form: RescheduleFormState;
  onFormChange: (form: RescheduleFormState) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export default function RescheduleModal({ isOpen, form, onFormChange, onClose, onSubmit }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="reschedule-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-[#020617]/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-[var(--card-bg)] rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 p-8 w-full max-w-md relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative elements for modal */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)] opacity-[0.1] blur-[40px] rounded-full pointer-events-none"></div>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center border border-white/5">
                 <CalendarClock size={24} className="text-[var(--accent)]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Reschedule Class</h3>
                <p className="text-sm text-[var(--text-secondary)]">Update the timing for this session</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest block mb-2">New Date</label>
                <input 
                  type="date" 
                  value={form.newDate} 
                  onChange={(e) => onFormChange({ ...form, newDate: e.target.value })} 
                  className="w-full bg-[var(--bg-secondary)]/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)] transition-all" 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest block mb-2">New Time</label>
                <input 
                  type="time" 
                  value={form.newTime} 
                  onChange={(e) => onFormChange({ ...form, newTime: e.target.value })} 
                  className="w-full bg-[var(--bg-secondary)]/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)] transition-all" 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest block mb-2">New Room</label>
                <input 
                  type="text" 
                  placeholder="e.g. Room 204" 
                  value={form.newRoom} 
                  onChange={(e) => onFormChange({ ...form, newRoom: e.target.value })} 
                  className="w-full bg-[var(--bg-secondary)]/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)] transition-all" 
                />
              </div>
            </div>

            <div className="flex gap-4 pt-8">
              <Button 
                className="flex-1 bg-transparent border border-white/10 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-white transition-colors py-3" 
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-[var(--accent)] to-[#9f7aea] text-white shadow-[0_4px_15px_rgba(139,92,246,0.3)] hover:shadow-[0_4px_20px_rgba(139,92,246,0.5)] border-0 py-3" 
                onClick={onSubmit}
              >
                Confirm Changes
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
