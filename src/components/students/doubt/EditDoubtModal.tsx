'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { X, Save, Loader2, Edit2 } from 'lucide-react'
import type { DoubtItem } from '../../../types/doubt.type'
import { useDoubts } from '../../../hooks/useDoubt'
import api from '../../../lib/api'

export default function EditDoubtModal({
  open,
  doubt,
  onClose
} : {
  open: boolean
  doubt: DoubtItem | null
  onClose: () => void
}) { 
  const [subject, setSubject] = useState('')
  const [teacherId, setTeacherId] = useState('') 
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [teachers, setTeachers] = useState<any[]>([])

  const { update } = useDoubts()

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await api.get('/admin/records/teachers')
        if (response.data && response.data.data) {
          setTeachers(response.data.data)
        }
      } catch (err) {
        console.error('Failed to fetch teachers', err)
      }
    }
    fetchTeachers()
  }, [])

  useEffect(() => {
    if (open && doubt) {
      setSubject(doubt.subject || '')
      setDescription(doubt.description || '')
      setTeacherId(doubt.teacherId?._id || '')
    }
  }, [open, doubt])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!doubt) return
    if (!subject.trim() || !description.trim()) { 
      toast.error('Fill subject and description')
      return 
    }
    
    try {
      setSubmitting(true)
      await update.mutateAsync({
        id: doubt._id,
        data: { subject, description, teacherId }
      })
      toast.success('Doubt updated successfully')
      onClose()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update doubt')
    } finally {
      setSubmitting(false)
    }
  }

  if (!doubt) return null

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[var(--card-bg)]/90 backdrop-blur-2xl border border-[var(--border-color)]/30 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <header className="px-6 py-4 border-b border-[var(--border-color)]/20 bg-[var(--bg-secondary)]/50 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-3">
                  <div className="bg-[var(--accent)]/10 p-2 rounded-lg">
                     <Edit2 className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">Edit Doubt</h2>
               </div>
               
               <button 
                 onClick={onClose}
                 className="p-2 rounded-full bg-[var(--bg-primary)]/50 border border-[var(--border-color)]/30 text-[var(--text-secondary)] hover:text-white hover:bg-rose-500/80 hover:border-rose-500 transition-all focus:outline-none"
               >
                 <X className="w-5 h-5" />
               </button>
            </header>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1 overflow-y-auto custom-scrollbar">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[var(--text-secondary)]">Subject</label>
                  <select 
                    value={subject} 
                    onChange={e=>setSubject(e.target.value)}
                    className="w-full bg-[var(--bg-primary)] p-3 rounded-xl border border-[var(--border-color)]/30 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none text-[var(--text-primary)] transition-all" 
                  >
                    <option value="">Select Subject Id</option>
                    <option value="Maths101">Maths101</option>
                    <option value="Physics101">Physics101</option>
                    <option value="Chemistry101">Chemistry101</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[var(--text-secondary)]">Teacher (Optional)</label>
                  <select 
                    value={teacherId} 
                    onChange={e=>setTeacherId(e.target.value)}
                    className="w-full bg-[var(--bg-primary)] p-3 rounded-xl border border-[var(--border-color)]/30 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none text-[var(--text-primary)] transition-all"
                  >
                    <option value="">Any Available Teacher</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.fullname} {teacher.department ? `(${teacher.department})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[var(--text-secondary)]">Description</label>
                <textarea 
                  value={description} 
                  onChange={e=>setDescription(e.target.value)} 
                  rows={6}
                  placeholder="Describe your doubt in detail..." 
                  className="w-full bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-color)]/30 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none text-[var(--text-primary)] resize-y min-h-[120px] transition-all scrollbar-thin"
                />
              </div>

              <div className="pt-4 border-t border-[var(--border-color)]/20 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-[var(--border-color)]/30 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] font-medium transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting || !subject.trim() || !description.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--accent)] to-indigo-600 text-white font-medium shadow-lg shadow-[var(--accent)]/20 hover:shadow-[var(--accent)]/40 disabled:opacity-50 flex items-center gap-2 transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Save Changes
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
