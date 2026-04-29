"use client";

import React from 'react';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import ClassCard from './ClassCard';

interface DashboardViewProps {
  classes: any[];
  onOpenList: (cls: any) => void;
  onStartSession: (cls: any) => void;
  loading?: boolean;
}

export default function DashboardView({ classes, onOpenList, onStartSession, loading }: DashboardViewProps) {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.15 
      } 
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="pb-20 relative z-10"
    >
      <header className="mb-8 space-y-6 w-full">
        {/* Title Section */}
        <div className="flex items-center gap-4 bg-[var(--card-bg)]/40 backdrop-blur-xl p-6 rounded-3xl border border-[var(--border-color)]/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-[var(--accent)]/20 rotate-3 shrink-0">
             <Calendar className="w-6 h-6" />
          </div>
          <div>
             <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--accent)] tracking-tight">Today's Schedule</h1>
             <p className="text-sm text-[var(--text-secondary)] font-medium mt-1">Manage automated geolocation and network telemetry tracking ({today}).</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-start gap-8 bg-[var(--card-bg)]/40 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-[var(--border-color)]/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="flex items-center gap-8 px-2">
            <div className="text-center">
              <p className="text-3xl font-bold text-white tracking-tight">{classes.length}</p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.15em] font-bold mt-1.5 opacity-80">Total Classes</p>
            </div>
            <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-[var(--border-color)] to-transparent"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[var(--accent)] drop-shadow-[0_0_10px_rgba(194,184,255,0.3)] tracking-tight">{classes.reduce((acc, curr) => acc + (curr.totalStudents || 0), 0)}</p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.15em] font-bold mt-1.5 opacity-80">Students</p>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full">
        {loading ? (
            <div className="p-16 flex flex-col items-center justify-center gap-4 text-[var(--text-secondary)] bg-[var(--card-bg)]/40 backdrop-blur-xl border border-[var(--border-color)]/30 rounded-3xl mt-6">
              <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
              <p className="font-medium animate-pulse">Syncing today's schedule...</p>
            </div>
        ) : classes.length === 0 ? (
            <div className="p-20 text-center text-[var(--text-secondary)] flex flex-col items-center bg-[var(--card-bg)]/40 backdrop-blur-xl border border-[var(--border-color)]/30 rounded-3xl mt-6">
               <div className="w-20 h-20 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mb-6">
                 <span className="text-4xl">☕</span>
               </div>
               <h3 className="text-xl font-bold text-white mb-2">No Classes Scheduled</h3>
               <p className="text-sm max-w-sm">You have no classes scheduled for today. Your network telemetry engine is currently on standby.</p>
            </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6"
          >
            {classes.map((cls) => (
              <ClassCard 
                key={cls.id || cls._id} 
                data={cls} 
                onOpenList={() => onOpenList(cls)}
                onStartSession={() => onStartSession(cls)}
              />
            ))}
          </motion.div>
        )}
      </main>
    </motion.div>
  );
}
