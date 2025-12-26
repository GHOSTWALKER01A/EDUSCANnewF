// src/components/student/GradesModal.tsx
'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import clsx from 'clsx'

type SubjectRow = {
  subject: string
  midSemester?: number
  practicals?: number
  semester?: number
}

export default function GradesModal({
  open,
  onClose,
  grades = [],
}: {
  open: boolean
  onClose: () => void
  grades: { semester: number; subjects: SubjectRow[] }[]
}) {
  const [selectedSemester, setSelectedSemester] = useState<number>(grades?.[0]?.semester ?? 1)

  React.useEffect(() => {
    if (grades?.length) setSelectedSemester(grades[0].semester)
  }, [grades])

  const semesterOptions = grades.map(g => g.semester)

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/50">
          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}
           className="bg-[var(--card-bg)] w-full max-w-4xl p-6 rounded-xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-[var(--accent)]">Grades Overview</h3>
              <button className="px-3 py-2 rounded border" onClick={onClose}>Close</button>
            </div>

            <div className="flex gap-2 flex-wrap mb-4">
              {semesterOptions.map(s => (
                <button key={s} onClick={() => setSelectedSemester(s)} className={clsx('px-3 py-2 rounded', selectedSemester === s ? 'bg-[var(--accent)] text-[var(--bg-primary)]' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)]')}>
                  Semester {s}
                </button>
              ))}
            </div>

            <div className="overflow-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[var(--bg-secondary)]">
                    <th className="p-3 border">Subject</th>
                    <th className="p-3 border">Mid (out of 20)</th>
                    <th className="p-3 border">Prac (out of 10)</th>
                    <th className="p-3 border">Sem (out of 70)</th>
                    <th className="p-3 border">Final (out of 100)</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.find(g => g.semester === selectedSemester)?.subjects?.map((sub, i) => {
                    const final = (sub.midSemester || 0) + (sub.practicals || 0) + (sub.semester || 0)
                    return (
                      <tr key={i} className="odd:bg-[rgba(255,255,255,0.02)]">
                        <td className="p-3 border">{sub.subject}</td>
                        <td className="p-3 border text-center">{sub.midSemester ?? 0}</td>
                        <td className="p-3 border text-center">{sub.practicals ?? 0}</td>
                        <td className="p-3 border text-center">{sub.semester ?? 0}</td>
                        <td className="p-3 border text-center">{final}</td>
                      </tr>
                    )
                  }) ?? <tr><td colSpan={5} className="p-4 text-center text-[var(--text-secondary)]">No data</td></tr>}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
