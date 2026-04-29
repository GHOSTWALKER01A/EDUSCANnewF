
'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Users, GraduationCap } from 'lucide-react';
import type { IUser } from '../../../types/index';
import StudentRow from './studentRow';
import clsx from 'clsx';

export default function StudentGroup({
  semester,
  branch,
  students,
  onToggle,
  onView
}: {
  semester: number;
  branch: string;
  students: IUser[];
  onToggle: (id: string, block: boolean) => void;
  onView: (id: string, s: IUser) => void;
}) {
  const [open, setOpen] = useState(true);
  const [version, setVersion] = useState(0);
  const refresh = () => setVersion(v => v + 1);

  return (
    <div className="mb-6 rounded-2xl border border-[var(--border-color)]/30 bg-[var(--card-bg)]/60 backdrop-blur-xl shadow-lg overflow-hidden transition-colors hover:border-[var(--accent)]/30">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-6 py-4 bg-gradient-to-r from-[var(--bg-secondary)]/80 to-[var(--bg-primary)]/80 flex justify-between items-center transition-all hover:bg-[var(--bg-secondary)] focus:outline-none"
        aria-expanded={open}
      >
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center ring-1 ring-[var(--accent)]/20 text-[var(--accent)]">
              <GraduationCap className="w-5 h-5" />
           </div>
           <div>
             <div className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
               Semester {semester} <span className="text-[var(--text-secondary)] opacity-50">•</span> <span className="text-[var(--accent)]">{branch}</span>
             </div>
             <div className="text-xs font-medium text-[var(--text-secondary)] flex items-center gap-1.5 mt-0.5 uppercase tracking-wider">
               <Users className="w-3.5 h-3.5" /> {students.length} Student{students.length !== 1 ? 's' : ''}
             </div>
           </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-[var(--bg-primary)] border border-[var(--border-color)]/30 flex items-center justify-center text-[var(--text-secondary)] transition-transform duration-300 shadow-sm" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
           <motion.div
             initial={{ height: 0, opacity: 0 }}
             animate={{ height: 'auto', opacity: 1 }}
             exit={{ height: 0, opacity: 0 }}
             transition={{ duration: 0.3, ease: 'easeInOut' }}
           >
             <div className="overflow-x-auto border-t border-[var(--border-color)]/30">
               <table className="w-full whitespace-nowrap">
                 <thead>
                   <tr className="text-left bg-[var(--bg-secondary)]/30 text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold border-b border-[var(--border-color)]/30">
                     <th className="px-6 py-4">Reg. No</th>
                     <th className="px-6 py-4">Student</th>
                     <th className="px-6 py-4">Grade</th>
                     <th className="px-6 py-4">% Attendance</th>
                     <th className="px-6 py-4">Risk Profile</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-[var(--border-color)]/20">
                   {students.map(s => (
                     <StudentRow key={s._id} student={s} onToggle={onToggle} onView={(id) => onView(id, s)} onRefresh={refresh} />
                   ))}
                 </tbody>
               </table>
             </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
