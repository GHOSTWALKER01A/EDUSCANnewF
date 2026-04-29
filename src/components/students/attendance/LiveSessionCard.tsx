import React from 'react';
import { motion } from 'framer-motion';
import {
  QrCode, Wifi, Clock, MapPin, CheckCircle2,
  ShieldCheck, AlertCircle, Scan, Calendar,
} from 'lucide-react';

interface CurrentPeriod {
  id:          string;
  subject:     string;
  type:        string;
  time:        string;
  room:        string;
  teacherName: string;
  endTime:     Date;
}

interface LiveSessionCardProps {
  currentPeriod:  CurrentPeriod | null;
  timeLeft:       number;
  checks:         number;
  isPresent:      boolean;
  isAutoPresent:  boolean;
  needsFailover:  boolean;
  onOpenQR:       () => void;
}

export const LiveSessionCard: React.FC<LiveSessionCardProps> = ({
  currentPeriod, timeLeft, checks,
  isPresent, isAutoPresent, needsFailover, onOpenQR,
}) => (
  <div className="bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)]/30 rounded-3xl shadow-xl shadow-black/5 overflow-hidden relative group p-6 sm:p-8">
    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 relative z-10 border-b border-[var(--border-color)]/20 pb-5">
      {currentPeriod ? (
        <>
          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
              <span className="w-2 h-6 bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1] animate-pulse" />
              Active Session
              <span className="text-[var(--text-secondary)] font-medium text-lg ml-2">/ {currentPeriod.subject}</span>
            </h2>
            <p className="text-[var(--text-secondary)] mt-2 text-sm font-medium flex items-center gap-2 ml-4">
              <Clock className="w-4 h-4 text-[var(--accent)]" /> {currentPeriod.time}
              &nbsp;•&nbsp;
              <MapPin className="w-4 h-4 text-emerald-400 ml-1" /> {currentPeriod.room}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center gap-2 text-indigo-300 font-bold text-sm">
            <Clock className="w-4 h-4" />
            {timeLeft > 0 ? `${timeLeft} Mins Remaining` : 'Session Ended'}
          </div>
        </>
      ) : (
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <span className="w-2 h-6 bg-[var(--text-secondary)]/30 rounded-full" />
            No Active Session
          </h2>
          <p className="text-[var(--text-secondary)] mt-2 text-sm font-medium flex items-center gap-2 ml-4">
            <Calendar className="w-4 h-4 text-[var(--text-secondary)]" /> You are currently free.
          </p>
        </div>
      )}
    </div>

    {/* Body */}
    <div className="relative z-10">
      {!currentPeriod && (
        <div className="bg-[var(--bg-primary)]/40 border border-[var(--border-color)]/30 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-[var(--text-secondary)]/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-[var(--text-secondary)]/50" />
          </div>
          <h4 className="font-bold text-[var(--text-primary)] text-xl mb-1 tracking-tight">You're All Caught Up</h4>
          <p className="text-[var(--text-secondary)] text-sm font-medium max-w-sm">
            There are no ongoing classes requiring your attendance. Review your history below.
          </p>
        </div>
      )}

      {currentPeriod && isPresent && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-inner shadow-emerald-500/5">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)] shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-bold text-emerald-400 text-2xl mb-1 tracking-tight">
              {isAutoPresent ? '🎉 Attendance Secured Automatically' : '✅ Attendance Marked via QR'}
            </h4>
            <p className="text-sm text-emerald-200/70 font-medium">
              {isAutoPresent
                ? `You maintained ${checks}/15 network checks. You do not need to scan the QR code.`
                : 'Your Golden Key scan was successful.'}
            </p>
          </div>
        </div>
      )}

      {currentPeriod && !isPresent && needsFailover && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-inner shadow-amber-500/5">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)] shrink-0">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-amber-500 text-2xl mb-1 tracking-tight">⚠️ Network Disconnect Detected</h4>
            <p className="text-sm text-amber-200/80 font-medium mb-4">
              You did not meet the continuous Wi-Fi requirement ({checks}/15). You MUST scan the Golden Key to save your attendance.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenQR}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2.5 text-sm bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 ring-1 ring-white/10"
            >
              <Scan className="w-5 h-5" /> Scan Golden Key Now
            </motion.button>
          </div>
        </div>
      )}

      {currentPeriod && !isPresent && !needsFailover && (
        <div className="bg-[var(--bg-primary)]/40 border border-[var(--border-color)]/30 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-6 gap-4">
            <div>
              <h4 className="font-bold text-[var(--text-primary)] flex items-center gap-2 text-lg">
                <Wifi className="w-5 h-5 text-indigo-400 animate-pulse" /> Polling Network...
              </h4>
              <p className="text-sm text-[var(--text-secondary)] mt-1.5 font-medium">
                Stay connected to the instructor's Wi-Fi. 12 checks required for auto-attendance.
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-4xl font-mono font-black tracking-tighter text-white">{checks}</span>
              <span className="text-[var(--text-secondary)] text-lg font-bold ml-1">/ 15</span>
            </div>
          </div>

          <div className="w-full bg-[var(--bg-secondary)] rounded-full h-3.5 mb-3 border border-[var(--border-color)]/50 shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(checks / 15) * 100}%` }}
              className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-indigo-500 to-[var(--accent)] shadow-[0_0_10px_var(--accent)]"
            />
          </div>

          <div className="flex justify-between items-center text-xs text-[var(--text-secondary)] font-mono font-bold uppercase tracking-wider px-1">
            <span>0</span>
            <span className="relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0.5 h-2.5 bg-amber-500/70 rounded-full" />
              12 (Auto Threshold)
            </span>
            <span>15</span>
          </div>

          <div className="mt-6 flex items-start gap-3 p-4 bg-[var(--card-bg)] border border-[var(--border-color)]/30 rounded-xl shadow-sm">
            <QrCode className="w-5 h-5 text-[var(--accent)] flex-shrink-0" />
            <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
              You can manually scan the Golden Key displayed on the instructor's board anytime to secure your attendance.
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
);
