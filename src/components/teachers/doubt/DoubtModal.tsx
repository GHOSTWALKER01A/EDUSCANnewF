// client/src/components/teachers/doubt/DoubtModal.tsx
'use client'
import React, { useEffect, useState, useRef } from 'react'
import type { DoubtItem } from '../../../types/doubt.type'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { X, Send, Paperclip, Loader2, FileText, UserCircle2 } from 'lucide-react'
import clsx from 'clsx'

export default function DoubtModal({
  open,
  doubt,
  onClose,
  onReply
} : {
  open: boolean
  doubt: DoubtItem | null
  onClose: () => void
  onReply: (id: string, fd: FormData) => Promise<any>
}) {
  const [text, setText] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (open) {
      setText('')
      setFiles([])
      setTimeout(scrollToBottom, 150)
    }
  }, [open, doubt])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files
    if (f && f.length) setFiles(prev => [...prev, ...Array.from(f)])
  }
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!doubt) return
    if (!text.trim() && files.length === 0) return
    
    try {
      setSubmitting(true)
      const fd = new FormData()
      if (text.trim()) fd.append('message', text)
      for (const f of files) fd.append('attachments', f)
      await onReply(doubt._id, fd)
      setText('')
      setFiles([])
      setTimeout(scrollToBottom, 300)
    } finally {
      setSubmitting(false)
    }
  }

  if (!doubt) return null

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] bg-[var(--card-bg)]/90 backdrop-blur-2xl border border-[var(--border-color)]/30 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <header className="px-6 py-4 border-b border-[var(--border-color)]/20 bg-[var(--bg-secondary)]/50 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent)]/20 to-indigo-500/20 border border-[var(--border-color)]/30 flex items-center justify-center text-[var(--accent)] shadow-inner">
                    {doubt.studentId?.fullname?.split(' ').map((s:string) => s[0]).slice(0,2).join('').toUpperCase() || <UserCircle2 className="w-6 h-6" />}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[var(--text-primary)] leading-tight">{doubt.studentId?.fullname || 'Student'}</h2>
                    <div className="text-xs font-semibold text-[var(--text-secondary)] mt-0.5 flex flex-wrap items-center gap-2">
                       <span className="text-[var(--accent)]">{doubt.studentId?.branch || 'N/A'}</span>
                       <span className="opacity-50">•</span>
                       <span className="text-[var(--accent)]">Sem {doubt.studentId?.semester || 'N/A'}</span>
                       <span className="opacity-50">•</span>
                       <span>{doubt.date} {doubt.time || ''}</span>
                    </div>
                  </div>
               </div>
               
               <button 
                 onClick={onClose}
                 className="p-2 rounded-full bg-[var(--bg-primary)]/50 border border-[var(--border-color)]/30 text-[var(--text-secondary)] hover:text-white hover:bg-rose-500/80 hover:border-rose-500 transition-all focus:outline-none"
               >
                 <X className="w-5 h-5" />
               </button>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-[var(--border-color)]/30 scrollbar-track-transparent">
               
               {/* Initial Student Doubt Bubble */}
               <div className="flex flex-col items-start max-w-[85%] sm:max-w-[75%]">
                 <div className="text-xs font-bold text-[var(--text-secondary)] mb-1.5 ml-1">{doubt.studentId?.fullname} <span className="opacity-50 font-normal ml-1">Original Question</span></div>
                 <div className="bg-[var(--bg-secondary)]/80 text-[var(--text-primary)] px-5 py-4 rounded-2xl rounded-tl-sm border border-[var(--border-color)]/20 shadow-sm leading-relaxed text-sm">
                    {doubt.description}
                    
                    {doubt.attachments && doubt.attachments.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-[var(--border-color)]/10 flex flex-wrap gap-2">
                         {doubt.attachments.map((a:any, i:number) => (
                           <a key={i} href={a.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-primary)] rounded-lg text-xs font-medium hover:text-[var(--accent)] transition-colors border border-[var(--border-color)]/20 hover:border-[var(--accent)]/30">
                             <FileText className="w-3.5 h-3.5" />
                             <span className="truncate max-w-[150px]">{a.fileName || `Attachment-${i+1}`}</span>
                           </a>
                         ))}
                      </div>
                    )}
                 </div>
               </div>

               {/* Replies */}
               {(doubt.replies || []).map((r:any, idx:number) => {
                  const isTeacher = true; // In this teacher view, replies are usually from teachers. Adjust logic if students can also reply in the same thread.
                  
                  return (
                    <div key={idx} className={clsx("flex flex-col", isTeacher ? "items-end" : "items-start")}>
                      <div className={clsx("text-xs font-bold text-[var(--text-secondary)] mb-1.5", isTeacher ? "mr-1" : "ml-1")}>
                         {r.by?.fullname || r.by?.name || 'Staff'} <span className="opacity-50 font-normal mx-1">{new Date(r.createdAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className={clsx(
                         "max-w-[85%] sm:max-w-[75%] px-5 py-4 rounded-2xl shadow-sm leading-relaxed text-sm",
                         isTeacher 
                           ? "bg-gradient-to-br from-[var(--accent)] to-indigo-600 text-white rounded-tr-sm shadow-[var(--accent)]/10"
                           : "bg-[var(--bg-secondary)]/80 text-[var(--text-primary)] rounded-tl-sm border border-[var(--border-color)]/20"
                      )}>
                         {r.message}
                         
                         {r.attachments && r.attachments.length > 0 && (
                           <div className="mt-4 pt-3 border-t border-white/20 flex flex-wrap gap-2">
                              {r.attachments.map((a:any, i:number) => (
                                <a key={i} href={a.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 bg-black/20 rounded-lg text-xs font-medium hover:bg-black/30 transition-colors">
                                  <FileText className="w-3.5 h-3.5" />
                                  <span className="truncate max-w-[150px]">{a.fileName || `Attachment-${i+1}`}</span>
                                </a>
                              ))}
                           </div>
                         )}
                      </div>
                    </div>
                  )
               })}
               <div ref={messagesEndRef} />
            </div>

            {/* Composer */}
            <div className="p-4 sm:p-6 bg-[var(--bg-secondary)]/30 border-t border-[var(--border-color)]/20 shrink-0">
               
               {/* Selected Files Preview */}
               <AnimatePresence>
                  {files.length > 0 && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="flex flex-wrap gap-2 mb-3 overflow-hidden"
                    >
                       {files.map((file, i) => (
                         <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-[var(--card-bg)] border border-[var(--border-color)]/30 rounded-lg text-xs font-medium group">
                           <FileText className="w-3.5 h-3.5 text-[var(--accent)]" />
                           <span className="truncate max-w-[120px]">{file.name}</span>
                           <button onClick={() => removeFile(i)} className="p-0.5 rounded-full hover:bg-rose-500/20 hover:text-rose-500 ml-1 opacity-50 group-hover:opacity-100 transition-all">
                             <X className="w-3.5 h-3.5" />
                           </button>
                         </div>
                       ))}
                    </motion.div>
                  )}
               </AnimatePresence>

               <form onSubmit={handleSubmit} className="flex items-end gap-3">
                 <div className="flex-1 relative bg-[var(--bg-primary)] border border-[var(--border-color)]/30 rounded-2xl focus-within:border-[var(--accent)] focus-within:ring-1 focus-within:ring-[var(--accent)] transition-all overflow-hidden flex flex-col group">
                    <textarea 
                       value={text} 
                       onChange={(e) => setText(e.target.value)}
                       onKeyDown={(e) => {
                         if (e.key === 'Enter' && !e.shiftKey) {
                           e.preventDefault()
                           handleSubmit()
                         }
                       }}
                       placeholder="Type your reply here... (Press Enter to send)" 
                       className="w-full bg-transparent p-4 min-h-[56px] max-h-[160px] resize-none outline-none text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] placeholder-opacity-50 scrollbar-thin overflow-y-auto"
                       rows={1}
                    />
                    <div className="px-3 pb-3 flex justify-between items-center bg-transparent">
                       <label className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 cursor-pointer transition-colors" title="Attach Files">
                          <input type="file" multiple onChange={handleFile} className="hidden" />
                          <Paperclip className="w-5 h-5" />
                       </label>
                    </div>
                 </div>
                 
                 <button 
                   type="submit" 
                   disabled={submitting || (!text.trim() && files.length === 0)}
                   className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-[var(--accent)]/20 hover:shadow-[var(--accent)]/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:-translate-y-0 disabled:hover:shadow-none transition-all focus:outline-none"
                   title="Send Reply"
                 >
                   {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-5 h-5 ml-1" />}
                 </button>
               </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
