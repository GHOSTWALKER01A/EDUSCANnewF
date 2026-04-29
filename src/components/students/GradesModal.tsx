'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, GraduationCap, Award, BookOpen, Loader2 } from 'lucide-react'
import clsx from 'clsx'
import { IGradesSemester, IGradeSubject } from '../../types'

export default function GradesModal({ 
  open, 
  onClose,
  grades,
  loading 
}: { 
  open: boolean, 
  onClose: () => void,
  grades: IGradesSemester[],
  loading: boolean
}) {
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);

  useEffect(() => {
    if (grades.length > 0 && !selectedSemester) {
      setSelectedSemester(grades[0].semester);
    }
  }, [grades, selectedSemester]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; }
  }, [open]);

  // Animation variants
  const modalVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 300, damping: 30 }
    },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.3 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 200 } }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1200] bg-black/60 backdrop-blur-sm flex justify-end overflow-hidden">
           {/* Backdrop click to close */}
           <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
           
           <motion.div 
             variants={modalVariants} 
             initial="hidden" 
             animate="visible" 
             exit="exit" 
             className="relative w-full sm:w-[85vw] md:w-[75vw] lg:w-[60vw] xl:w-[50vw] h-full sm:h-[96vh] sm:my-[2vh] sm:mr-[2vw] sm:rounded-2xl rounded-tl-2xl rounded-bl-2xl bg-[var(--card-bg)]/90 backdrop-blur-2xl border border-[var(--border-color)]/30 shadow-2xl flex flex-col overflow-hidden shadow-amber-500/10 z-10"
           >
              {/* Header */}
              <div className="p-6 border-b border-[var(--border-color)]/20 flex justify-between items-center bg-[var(--bg-secondary)]/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <GraduationCap className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">Grades Overview</h2>
                    <p className="text-sm text-[var(--text-secondary)]">Academic Performance Details</p>
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="w-10 h-10 rounded-full bg-[var(--card-bg)]/80 backdrop-blur-md border border-[var(--border-color)]/30 flex items-center justify-center text-[var(--text-secondary)] hover:text-amber-500 hover:border-amber-500/30 hover:bg-amber-500/10 transition-all shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content Box */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 bg-gradient-to-b from-transparent to-[var(--bg-primary)]/20">
                
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
                    <p className="text-[var(--text-secondary)] font-medium">Loading grades...</p>
                  </div>
                ) : grades.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-[var(--card-bg)]/80 flex items-center justify-center border border-[var(--border-color)]/30 mb-6 drop-shadow-md">
                      <GraduationCap className="w-10 h-10 text-[var(--text-secondary)]/50" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No Grades Yet</h3>
                    <p className="text-[var(--text-secondary)] max-w-sm">
                      Your academic records have not been uploaded or are currently unavailable.
                    </p>
                  </div>
                ) : (
                  <>
                  {/* Semester Selector */}
                  <div className="flex flex-wrap gap-3 justify-center mb-8">
                    {grades.map(({ semester }) => (
                      <button
                        key={semester}
                        className={clsx(
                          "px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 border shadow-sm",
                          selectedSemester === semester 
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-transparent shadow-amber-500/25 scale-105'
                            : 'bg-[var(--card-bg)]/50 text-[var(--text-secondary)] border-[var(--border-color)]/30 hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] hover:border-amber-500/30'
                        )}
                        onClick={() => setSelectedSemester(semester)}
                      >
                        Semester {semester}
                      </button>
                    ))}
                  </div>

                  {/* Table Container */}
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    key={selectedSemester} // re-trigger animations on change
                    className="bg-[var(--card-bg)]/40 rounded-3xl border border-[var(--border-color)]/20 p-2 shadow-inner overflow-x-auto"
                  >
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr>
                          <th className="p-4 rounded-tl-2xl font-semibold text-[var(--text-secondary)] bg-[var(--bg-secondary)]/50 border-b border-[var(--border-color)]/20">Subject</th>
                          <th className="p-4 font-semibold text-[var(--text-secondary)] bg-[var(--bg-secondary)]/50 border-b border-[var(--border-color)]/20 text-center">Mid Sem (20)</th>
                          <th className="p-4 font-semibold text-[var(--text-secondary)] bg-[var(--bg-secondary)]/50 border-b border-[var(--border-color)]/20 text-center">Practicals (10)</th>
                          <th className="p-4 font-semibold text-[var(--text-secondary)] bg-[var(--bg-secondary)]/50 border-b border-[var(--border-color)]/20 text-center">Semester (70)</th>
                          <th className="p-4 rounded-tr-2xl font-semibold text-center text-amber-500 bg-[var(--bg-secondary)]/50 border-b border-[var(--border-color)]/20">Final (100)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grades.find(g => g.semester === selectedSemester)?.subjects.map((sub, index) => {
                          // Handle optional finalGrade property if API calculates it, otherwise compute it fallback
                          const final = sub.finalGrade ?? (sub.midSemester + sub.practicals + sub.semester);
                          const isExcellent = final >= 85;
                          const isGood = final >= 70 && final < 85;
                        
                        return (
                          <motion.tr 
                            variants={itemVariants}
                            key={index} 
                            className="group transition-colors hover:bg-[var(--bg-secondary)]/40 border-b border-[var(--border-color)]/10 last:border-0"
                          >
                            <td className="p-4 font-medium text-[var(--text-primary)] flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]/30 flex items-center justify-center shrink-0">
                                <BookOpen className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-amber-500 transition-colors" />
                              </div>
                              {sub.subject}
                            </td>
                            <td className="p-4 text-center text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{sub.midSemester}</td>
                            <td className="p-4 text-center text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{sub.practicals}</td>
                            <td className="p-4 text-center text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{sub.semester}</td>
                            <td className="p-4 text-center">
                              <span className={clsx(
                                "inline-flex items-center justify-center min-w-[3.5rem] px-2.5 py-1.5 rounded-xl font-bold text-sm border shadow-sm transition-all",
                                isExcellent ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 group-hover:bg-emerald-500/20" :
                                isGood ? "bg-amber-500/10 text-amber-500 border-amber-500/20 group-hover:bg-amber-500/20" :
                                "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 group-hover:bg-indigo-500/20"
                              )}>
                                {final}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </motion.div>
                
                {/* Grade Analytics Summary Box */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-10 bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 rounded-3xl p-6 lg:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-inner shadow-amber-500/5"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                     <h3 className="text-xl font-bold text-[var(--text-primary)]">Keep up the great work!</h3>
                     <p className="text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                       Your performance in Semester {selectedSemester} is well above the class average. Consistent effort in practicals is showing great results.
                     </p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="shrink-0 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-amber-500/30 transition-all hover:scale-105"
                  >
                    Close Overview
                  </button>
                </motion.div>
                </>
                )}
              </div>
           </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
