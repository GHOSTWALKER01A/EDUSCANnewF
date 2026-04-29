
'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { FileText, Plus, Maximize2, MoreVertical, Edit2, Trash2, X, Download } from 'lucide-react'
import api from '../../lib/api'
import AssignmentForm from './AssignmentsForm'
import FullScreenViewer from './FullScreenView'
import { IAssignment } from '../../types'
import clsx from 'clsx'

export default function AssignmentsModal({
  open,
  onClose,
  assignments,
  loading,
  onDelete,
  onSave,
}: {
  open: boolean
  onClose: () => void
  assignments: IAssignment[]
  loading: boolean
  onDelete: (id: string) => Promise<boolean>
  onSave: (id: string | undefined, fd: FormData) => Promise<IAssignment>
}) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<IAssignment | null>(null)
  const [viewerItem, setViewerItem] = useState<any | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const [fullScreenItem, setFullScreenItem] = useState<any | null>(null)

  useEffect(() => {
    if (!open) {
      setShowForm(false)
      setEditing(null)
      setViewerItem(null)
    }
  }, [open])

  const handleAddClick = () => {
    setEditing(null)
    setViewerItem(null)
    setShowForm(true)
  }

  const handleEdit = (a: IAssignment) => {
    setEditing(a)
    setViewerItem(null)
    setShowForm(true)
    setDropdownOpen(null)
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Delete this assignment?')) return
    const success = await onDelete(id)
    if (success) {
      setDropdownOpen(null)
      if (viewerItem?._id === id) setViewerItem(null)
    }
  }

  const handleSaved = (saved: IAssignment) => {
    setShowForm(false)
    setEditing(null)
    setViewerItem(saved) // Select the newly saved or edited item
  }

  const selectItem = (a: IAssignment) => {
    setShowForm(false)
    setEditing(null)
    setViewerItem(a)
  }

  // Animation variants
  const modalVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 300, damping: 30 }
    },
    exit: { x: '-100%', opacity: 0, transition: { duration: 0.3 } }
  }

  return (
    <>
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1200] bg-black/60 backdrop-blur-sm flex items-center justify-start overflow-hidden">
          <motion.div 
            variants={modalVariants} 
            initial="hidden" 
            animate="visible" 
            exit="exit" 
            className="w-[95vw] md:w-[85vw] lg:w-[75vw] xl:w-[65vw] h-full sm:h-[90vh] sm:ml-[2.5vw] sm:rounded-2xl rounded-tr-2xl rounded-br-2xl bg-[var(--card-bg)]/90 backdrop-blur-2xl border border-[var(--border-color)]/30 shadow-2xl flex flex-col sm:flex-row overflow-hidden shadow-indigo-500/10"
          >
            {/* LEFT SIDE - LIST */}
            <div className="w-full sm:w-[320px] md:w-[380px] h-1/2 sm:h-full border-b sm:border-b-0 sm:border-r border-[var(--border-color)]/20 bg-gradient-to-b from-[var(--bg-secondary)]/40 to-transparent flex flex-col z-10 shrink-0">
              <div className="p-4 sm:p-5 border-b border-[var(--border-color)]/20 flex justify-between items-center bg-[var(--card-bg)]/50 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                    <FileText className="w-4 h-4 text-indigo-400" />
                  </div>
                  <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-primary)]/70">Assignments</h2>
                </div>
                <button 
                  onClick={handleAddClick} 
                  className="w-8 h-8 rounded-full bg-[var(--accent)] text-[var(--bg-primary)] flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-[var(--accent)]/30 transition-all"
                  aria-label="Add New Assignment"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-3 sm:p-4 space-y-3 custom-scrollbar">
                {loading ? (
                  <div className="animate-pulse flex flex-col gap-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-20 bg-[var(--border-color)]/10 rounded-xl" />
                    ))}
                  </div>
                ) : assignments.length === 0 ? (
                  <div className="text-center mt-10">
                    <div className="w-16 h-16 rounded-full bg-[var(--border-color)]/10 mx-auto flex items-center justify-center mb-3">
                      <FileText className="w-8 h-8 text-[var(--text-secondary)] opacity-50" />
                    </div>
                    <p className="text-[var(--text-secondary)] font-medium">No assignments yet</p>
                    <button onClick={handleAddClick} className="text-sm text-indigo-400 mt-2 hover:underline">Create your first</button>
                  </div>
                ) : (
                  <AnimatePresence>
                    {assignments.map((a) => (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={a._id} 
                        onClick={() => selectItem(a)}
                        className={clsx(
                          "p-4 rounded-xl cursor-pointer transition-all duration-300 relative group border",
                          dropdownOpen === a._id ? "z-[50]" : "z-10",
                          viewerItem?._id === a._id && !showForm
                            ? "bg-indigo-500/10 border-indigo-500/40 shadow-lg shadow-indigo-500/5"
                            : "bg-[var(--card-bg)]/50 border-[var(--border-color)]/20 hover:border-indigo-500/30 hover:bg-[var(--card-bg)] hover:shadow-md"
                        )}
                      >
                        {viewerItem?._id === a._id && !showForm && (
                           <motion.div layoutId="active-indicator" className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-xl" />
                        )}
                        <div className="flex items-start justify-between">
                          <div className="flex-1 pr-4">
                            <h3 className={clsx(
                              "font-semibold truncate transition-colors",
                              viewerItem?._id === a._id && !showForm ? "text-indigo-400 text-lg" : "text-[var(--text-primary)]"
                            )}>{a.subject}</h3>
                            <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2 leading-relaxed">
                              {a.description || 'No description provided.'}
                            </p>
                          </div>
                          
                          <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => setDropdownOpen(dropdownOpen === a._id ? null : a._id)} 
                              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--border-color)]/20 text-[var(--text-secondary)] transition-colors"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            
                            <AnimatePresence>
                              {dropdownOpen === a._id && (
                                <motion.div 
                                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  className="absolute right-0 top-10 w-36 bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)]/30 shadow-xl shadow-black/20 z-[100] overflow-hidden"
                                >
                                  <button onClick={(e) => { e.stopPropagation(); handleEdit(a) }} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-[var(--border-color)]/10 text-[var(--text-primary)] transition-colors">
                                    <Edit2 className="w-4 h-4" /> Edit
                                  </button>
                                  <button onClick={(e) => handleDelete(a._id!, e)} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-rose-500/10 text-rose-500 transition-colors">
                                    <Trash2 className="w-4 h-4" /> Delete
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* RIGHT SIDE - PREVIEW / FORM */}
            <div className="flex-1 h-1/2 sm:h-full bg-[var(--bg-primary)]/40 flex flex-col relative overflow-hidden">
              {/* Close Button Top Right */}
              <div className="absolute top-4 right-4 z-20">
                 <button onClick={onClose} className="w-10 h-10 rounded-full bg-[var(--card-bg)]/80 backdrop-blur-md border border-[var(--border-color)]/30 flex items-center justify-center text-[var(--text-secondary)] hover:text-rose-400 hover:border-rose-400/30 hover:bg-rose-400/10 transition-all shadow-lg hidden sm:flex">
                   <X className="w-5 h-5" />
                 </button>
                 <button onClick={onClose} className="w-8 h-8 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)]/30 flex items-center justify-center text-[var(--text-secondary)] sm:hidden">
                   <X className="w-4 h-4" />
                 </button>
              </div>

              {showForm ? (
                <div className="h-full flex flex-col w-full max-w-2xl mx-auto p-6 sm:p-10 overflow-y-auto custom-scrollbar">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-indigo-400">
                      {editing ? `Edit Assignment: ${editing.subject}` : 'Create New Assignment'}
                    </h2>
                    <p className="text-[var(--text-secondary)] mt-2">Fill in the details below to save your assignment.</p>
                  </motion.div>
                  <div className="bg-[var(--card-bg)]/60 backdrop-blur-xl border border-[var(--border-color)]/20 p-1 sm:p-6 rounded-2xl shadow-xl flex-shrink-0">
                    <AssignmentForm 
                      initial={editing ? {
                        _id: editing._id,
                        subject: editing.subject,
                        description: editing.description,
                        filePreview: editing.filePreview,
                        fileType: editing.fileType
                      } : null} 
                      onCancel={() => { 
                        setShowForm(false)
                        if (!editing && assignments.length > 0) setViewerItem(assignments[0])
                        setEditing(null) 
                      }} 
                      onSaved={handleSaved}
                      onSave={onSave}
                    />
                  </div>
                </div>
              ) : viewerItem ? (
                <div className="h-full flex flex-col p-6 sm:p-8 lg:p-12 overflow-y-auto custom-scrollbar relative">
                   <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col h-full bg-[var(--card-bg)]/50 backdrop-blur border border-[var(--border-color)]/20 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
                     <div className="flex justify-between items-start gap-4 mb-6">
                       <div>
                         <h2 className="text-3xl font-black text-[var(--text-primary)] leading-tight">{viewerItem.subject}</h2>
                         <p className="text-[var(--text-secondary)] mt-4 whitespace-pre-wrap leading-relaxed max-w-2xl">{viewerItem.description}</p>
                       </div>
                       <div className="flex gap-2 shrink-0">
                         {viewerItem.filePreview && (
                            <button 
                              onClick={() => setFullScreenItem(viewerItem)}
                              className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all group"
                              title="Full Screen Preview"
                            >
                               <Maximize2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                         )}
                       </div>
                     </div>

                     <div className="flex-1 mt-4 relative bg-black/20 rounded-2xl border border-[var(--border-color)]/20 overflow-hidden min-h-[300px] flex items-center justify-center group/preview">
                       {viewerItem.filePreview ? (
                         <>
                           {viewerItem.fileType?.startsWith('image/') ? (
                             <img 
                               src={viewerItem.filePreview} 
                               alt={viewerItem.subject} 
                               className="max-w-full max-h-full object-contain cursor-pointer transition-transform duration-500 group-hover/preview:scale-[1.02]" 
                               onClick={() => setFullScreenItem(viewerItem)} 
                             />
                           ) : viewerItem.fileType === 'application/pdf' ? (
                             <iframe 
                               src={viewerItem.filePreview} 
                               title={viewerItem.subject} 
                               className="w-full h-full border-none bg-black/40" 
                             />
                           ) : (
                             <div className="text-center p-8 bg-[var(--bg-primary)]/50 rounded-xl max-w-sm w-full mx-auto border border-[var(--border-color)]/20 backdrop-blur">
                               <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                                 <FileText className="w-8 h-8 text-indigo-400" />
                               </div>
                               <h3 className="font-semibold text-lg mb-2">Document Attached</h3>
                               <a 
                                 href={viewerItem.filePreview} 
                                 download 
                                 target="_blank" 
                                 rel="noreferrer" 
                                 className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--accent)] text-[var(--bg-primary)] font-semibold rounded-lg hover:bg-indigo-400 hover:shadow-lg hover:shadow-indigo-500/30 transition-all w-full"
                               >
                                 <Download className="w-4 h-4" /> Download File
                               </a>
                             </div>
                           )}
                         </>
                       ) : (
                         <div className="text-center opacity-50 flex flex-col items-center">
                           <FileText className="w-16 h-16 mb-4 text-[var(--border-color)]" />
                           <p className="font-medium text-[var(--text-secondary)]">No attachments for this assignment</p>
                         </div>
                       )}
                     </div>
                   </motion.div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[var(--bg-primary)]/40 to-transparent">
                  <div className="w-32 h-32 mb-6 opacity-30">
                    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-indigo-400">
                      <path d="M50 10L90 30V70L50 90L10 70V30L50 10Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                      <path d="M50 10V50M90 30L50 50M10 30L50 50M50 50V90" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Your Assignments Workspace</h3>
                  <p className="text-[var(--text-secondary)] max-w-sm leading-relaxed mb-8">
                    Select an assignment from the left panel to preview it, or click the + button to create a new one.
                  </p>
                  <button 
                    onClick={handleAddClick} 
                    className="px-6 py-3 rounded-xl bg-[var(--accent)] text-[var(--bg-primary)] font-bold shadow-lg shadow-[var(--accent)]/20 hover:scale-[1.02] transition-all flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" /> Start New Assignment
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    
    <FullScreenViewer 
      open={!!fullScreenItem} 
      item={fullScreenItem ? {
        filePreview: fullScreenItem.filePreview,
        fileType: fullScreenItem.fileType,
        subject: fullScreenItem.subject,
        description: fullScreenItem.description,
      } : null} 
      onClose={() => setFullScreenItem(null)} 
    />
    </>
  )
}

