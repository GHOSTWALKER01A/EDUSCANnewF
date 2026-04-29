import React from "react";
import { motion } from "framer-motion";
import { CalendarClock, Building2, Users, QrCode } from "lucide-react";
import Button from "@/src/components/UI/Button";
import type { ClassItem } from "@/src/types/class.types";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const tableVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 },
};

type Props = {
  classes: ClassItem[];
  loading: boolean;
  onStartQr: (classId: string) => void;
  onOpenStudents: (classId: string) => void;
  onOpenReschedule: (classId: string) => void;
};

export default function ScheduleTable({ classes, loading, onStartQr, onOpenStudents, onOpenReschedule }: Props) {
  return (
    <motion.section variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
          <CalendarClock size={24} />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Today's Classes</h2>
      </div>
      
      <div className="bg-[var(--card-bg)]/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-black/5 border border-[var(--border-color)]/30 overflow-hidden">
        <div className="overflow-x-auto w-full">
          {loading ? (
            <div className="p-16 flex flex-col items-center justify-center gap-4 text-[var(--text-secondary)]">
              <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
              <p className="font-medium animate-pulse">Fetching today's schedule...</p>
            </div>
          ) : classes.length === 0 ? (
            <div className="p-20 text-center text-[var(--text-secondary)] flex flex-col items-center">
               <div className="w-20 h-20 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mb-6">
                 <span className="text-4xl">☕</span>
               </div>
               <h3 className="text-xl font-bold text-white mb-2">No Classes Scheduled</h3>
               <p className="text-sm max-w-sm">You have no classes scheduled for today. Enjoy your day off or catch up on other tasks!</p>
            </div>
          ) : (
            <table className="w-full text-left whitespace-nowrap min-w-[800px]">
              <thead className="bg-[#0f172a]/80 text-[var(--text-secondary)] text-xs uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-8 py-5 rounded-tl-3xl">Subject</th>
                  <th className="px-6 py-5">Branch</th>
                  <th className="px-6 py-5">Time</th>
                  <th className="px-6 py-5">Room</th>
                  <th className="px-6 py-5 text-center">Present</th>
                  <th className="px-8 py-5 text-right rounded-tr-3xl">Actions</th>
                </tr>
              </thead>
              <motion.tbody 
                variants={tableVariants}
                initial="hidden"
                animate="show"
                className="divide-y divide-white/5"
              >
                {classes.map((c) => (
                  <motion.tr 
                    variants={rowVariants}
                    key={c._id} 
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="font-bold text-base text-white">{c.subject}</div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5 font-medium">{c._id.substring(0,8).toUpperCase()}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--bg-secondary)] border border-white/10 text-[var(--text-secondary)]">
                        {c.branch}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-semibold text-white/90">{c.time}</td>
                    <td className="px-6 py-5">
                      <span className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] font-medium">
                        <Building2 size={14} />
                        {c.room}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div 
                        className="flex items-center justify-center gap-1.5 text-[var(--accent)] font-bold cursor-pointer hover:bg-[var(--accent)]/10 w-fit mx-auto px-3 py-1.5 rounded-lg transition-colors group/stats"
                        onClick={() => onOpenStudents(c._id)}
                      >
                        <Users size={16} className="group-hover/stats:scale-110 transition-transform" />
                        {c.studentsPresent || 0}/{c.totalStudents || 0}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <Button 
                          className="bg-[var(--accent)] hover:bg-[#9f7aea] text-white text-xs py-2 px-4 shadow-[0_0_15px_rgba(139,92,246,0.2)] flex items-center gap-1.5 border-0" 
                          onClick={() => onStartQr(c._id)}
                        >
                          <QrCode size={14} />
                          Generate QR
                        </Button>
                        <Button 
                          className="bg-[var(--bg-secondary)] border border-white/10 hover:border-white/20 text-white/90 text-xs py-2 px-4 flex items-center gap-1.5" 
                          onClick={() => onOpenReschedule(c._id)}
                        >
                          <CalendarClock size={14} />
                          Reschedule
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          )}
        </div>
      </div>
    </motion.section>
  );
}
