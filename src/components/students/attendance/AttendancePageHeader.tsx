import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, QrCode, Book } from 'lucide-react';

interface AttendancePageHeaderProps {
  canScan:       boolean;
  onScanClick:   () => void;
}

export const AttendancePageHeader: React.FC<AttendancePageHeaderProps> = ({ canScan, onScanClick }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[var(--border-color)]/20 pb-6"
  >
    <div>
      <div className="flex items-center gap-4">
        <div className="p-3.5 bg-[var(--accent)]/10 rounded-2xl shadow-inner shadow-[var(--accent)]/10">
          <Calendar className="w-8 h-8 text-[var(--accent)]" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] via-[var(--accent)] to-indigo-500 tracking-tight pb-1">
          My Attendance
        </h1>
      </div>
      <p className="text-[var(--text-secondary)] mt-3 flex items-center gap-2 font-medium text-lg ml-1">
        <Book className="w-5 h-5 text-amber-500" />
        Track your classes and maintain a perfect streak.
      </p>
    </div>

    <motion.button
      whileHover={canScan ? { scale: 1.05 } : {}}
      whileTap={canScan ? { scale: 0.95 } : {}}
      onClick={() => canScan && onScanClick()}
      disabled={!canScan}
      className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 ring-2 ${
        canScan
          ? 'bg-gradient-to-r from-[var(--accent)] to-indigo-600 text-white shadow-lg shadow-[var(--accent)]/20 hover:shadow-[var(--accent)]/40 hover:from-indigo-600 hover:to-[var(--accent)] ring-white/10'
          : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]/50 ring-transparent cursor-not-allowed opacity-80'
      }`}
    >
      <QrCode className="w-5 h-5" />
      <span className="mt-0.5">{canScan ? 'Scan QR To Prompt' : 'Scanner Locked'}</span>
    </motion.button>
  </motion.div>
);
