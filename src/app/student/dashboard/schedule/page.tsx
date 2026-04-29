'use client'

import React, { useState, useEffect } from 'react';
import { Calendar, RefreshCw, Clock } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

import Navbar from '@/src/components/layouts/Navbar';
import Footer from '@/src/components/layouts/Footerstu';
import { ScheduleGrid } from '@/src/components/students/schedule/ScheduleGrid';
import { DailyDetailCard } from '@/src/components/students/schedule/DailyDetailCard';
import { FloatingTooltip } from '@/src/components/students/schedule/FloatingTooltip';
import { DetailModal } from '@/src/components/students/schedule/DetailModal';
import { StatusLegend } from '@/src/components/students/schedule/StatusBadge';
import { ScheduleSlot, SubjectData } from '@/src/types/schedule';
import { useSchedule } from '@/src/hooks/useSchedule';
import api from '@/src/lib/api';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;

export default function SchedulePage() {
  const {
    selectedDay, setSelectedDay,
    loading, setLoading,
    scheduleData, setScheduleData,
    isModalOpen, closeModal,
    selectedPeriod,
    hoveredData, closeTooltip,
    mousePos,
    handleMouseMove,
    handlePeriodClick
  } = useSchedule<ScheduleSlot, SubjectData>();

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const res = await api.get('/schedule/student');
        if (res.data?.success) {
           const formattedData = res.data.data.map((slot: any) => {
             // Let's identify if a slot is entirely a recess break
             // If all subjects in this slot have isRecess, or there is only one "Recess" entry, mark slot as recess
             const isRecess = slot.subjects?.some((s: any) => s.isRecess || s.subject?.toLowerCase() === 'recess');
             
             if (isRecess) {
               return { time: slot.time, recess: true };
             }
             
             return {
               ...slot,
               subjects: slot.subjects?.map((sub: any) => ({
                 ...sub,
                 teacher: sub.teacherId?.fullname || 'Unknown Teacher'
               }))
             };
           });
           setScheduleData(formattedData);
        }
      } catch (err) {
        console.error('Failed to fetch schedule', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [setScheduleData, setLoading]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 15 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] relative overflow-x-hidden font-sans selection:bg-[var(--accent)] selection:text-black pb-20">
      {/* Abstract Background Elements matching Attendance Page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none border-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <Navbar />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 mt-20 md:mt-24 space-y-10 relative z-10 pb-24">
        {/* Page Header */}
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
                Academic Timetable
              </h1>
            </div>
            <p className="text-[var(--text-secondary)] mt-3 flex items-center gap-2 font-medium text-lg ml-1">
              View your weekly schedule, monitor live classes, and keep track of sessions.
            </p>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <RefreshCw className="w-12 h-12 text-[var(--accent)] animate-spin mb-6" />
            <p className="text-[var(--text-secondary)] animate-pulse font-bold tracking-widest uppercase">Syncing schedule...</p>
          </div>
        ) : scheduleData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Calendar className="w-16 h-16 text-[var(--text-secondary)]/50 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">No Classes Found</h2>
            <p className="text-[var(--text-secondary)]">You don't have any classes scheduled for this week.</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-16"
          >
            {/* Legend */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 mb-8 bg-[var(--bg-primary)]/40 p-5 rounded-[2rem] border border-[var(--border-color)]/30 backdrop-blur-md shadow-inner">
              <StatusLegend label="Scheduled" dotColor="bg-white" />
              <StatusLegend label="Ongoing" dotColor="bg-blue-500" />
              <StatusLegend label="Completed" dotColor="bg-emerald-500" />
              <StatusLegend label="Cancelled" dotColor="bg-red-500" />
              <StatusLegend label="Rescheduled" dotColor="bg-amber-500" />
            </motion.div>

            {/* Day Selector Pills */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-3">
              {DAYS.map((day) => (
                <button 
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-8 py-3.5 rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-500 shadow-sm ${
                    selectedDay === day 
                      ? 'bg-gradient-to-r from-[var(--accent)] to-indigo-600 text-white shadow-[0_0_20px_var(--accent-glow)] scale-105 ring-2 ring-white/10' 
                      : 'bg-[var(--bg-secondary)]/50 text-[var(--text-secondary)] border border-[var(--border-color)]/50 hover:bg-[var(--bg-primary)] hover:text-white hover:border-[var(--accent)]/50 backdrop-blur-sm'
                  }`}
                >
                  {day}
                </button>
              ))}
            </motion.div>

            {/* Section 1: Weekly Grid View */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-1 bg-gradient-to-r from-[var(--accent)] to-indigo-500 rounded-full"></span> 
                Full Week Overview
              </h2>
              <ScheduleGrid 
                scheduleData={scheduleData}
                selectedDay={selectedDay}
                onHover={handleMouseMove}
                onLeave={closeTooltip}
                onClick={handlePeriodClick}
              />
            </motion.div>

            {/* Section 2: Daily Detailed View */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3 capitalize">
                <span className="w-8 h-1 bg-gradient-to-r from-[var(--accent)] to-indigo-500 rounded-full"></span> 
                {selectedDay}'s Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {scheduleData.map((slot, index) => {
                  if (slot.recess) {
                    return (
                      <div key={index} className="bg-[var(--card-bg)]/30 backdrop-blur-sm rounded-3xl p-8 flex flex-col items-center justify-center text-center border-dashed border-2 border-[var(--border-color)]/50 transition-all hover:bg-[var(--card-bg)]/50 hover:border-[var(--text-secondary)]/50 group">
                         <Clock className="w-10 h-10 text-[var(--text-secondary)] mb-4 opacity-50 group-hover:opacity-100 group-hover:text-[var(--accent)] transition-all group-hover:scale-110" />
                         <h3 className="text-xl font-bold text-[var(--text-secondary)] uppercase tracking-widest group-hover:text-white transition-colors">Recess Break</h3>
                         <p className="font-mono text-[var(--accent)] mt-2 font-bold bg-[var(--accent)]/10 px-4 py-1.5 rounded-full border border-[var(--accent)]/20 shadow-inner">{slot.time}</p>
                      </div>
                    );
                  }

                  const subject = slot.subjects?.find(s => s.day === selectedDay);
                  if (!subject) return null;

                  return (
                    <DailyDetailCard 
                      key={index} 
                      subject={subject} 
                      time={slot.time} 
                      onClick={() => handlePeriodClick(subject, slot.time)}
                    />
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>

      <Footer />

      <AnimatePresence>
         {hoveredData && (
           <FloatingTooltip data={hoveredData} mousePos={mousePos} />
         )}
      </AnimatePresence>

      <DetailModal isOpen={isModalOpen} onClose={closeModal} data={selectedPeriod} />
    </div>
  );
}