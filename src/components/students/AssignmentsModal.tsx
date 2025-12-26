
'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import api from '../../lib/api'
import AssignmentForm from './AssignmentsForm'
import FullScreenViewer from './FullScreenView'
import { IAssignment } from '../../types'
import clsx from 'clsx'

export default function AssignmentsModal({
  open,
  onClose,
  initialAssignments = [],
  onChange,
}: {
  open: boolean
  onClose: () => void
  initialAssignments?: IAssignment[]
  onChange?: (updated: IAssignment[]) => void
}) {
  const [assignment, setAssignment] = useState<IAssignment[]>(initialAssignments)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<IAssignment | null>(null)
  const [viewerItem, setViewerItem] = useState<any | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => setAssignment(initialAssignments), [initialAssignments])

  useEffect(() => {
    if (!open) {
      setShowForm(false)
      setEditing(null)
    }
  }, [open])

  async function fetchAssignments() {
    try {
      setLoading(true)
      const resp = await api.get('/api/assignments')
      setAssignment(resp.data.data || [])
      onChange?.(resp.data.data || [])
    } catch (err) {
      console.error(err)
      toast.error('Failed to load assignments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) fetchAssignments()
  
  }, [open])

  const handleAddClick = () => {
    setEditing(null)
    setShowForm(true)
  }

  const handleEdit = (assignment: IAssignment) => {
    setEditing(assignment)
    setShowForm(true)
    setDropdownOpen(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this assignment?')) return
    try {
      await api.delete(`/api/assignments/${id}`)
      setAssignment((s) => s.filter(a => a._id !== id))
      onChange?.(assignment.filter(a => a._id !== id))
      toast.success('Deleted')
      setDropdownOpen(null)
    } catch (err) {
      console.error(err)
      toast.error('Delete failed')
    }
  }

  const handleSaved = (saved: IAssignment) => {
    // saved from server: either new or updated
    const exists = assignment.find(a => a._id === saved._id)
    let newList
    if (exists) {
      newList = assignment.map(a => a._id === saved._id ? saved : a)
    } else {
      newList = [saved, ...assignment]
    }
    setAssignment(newList)
    onChange?.(newList)
    setShowForm(false)
    setEditing(null)
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/50">
          <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="bg-[var(--card-bg)] p-6 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-[var(--accent)]">Assignments</h3>
              <div className="flex items-center gap-2">
                <button onClick={handleAddClick} className="px-3 py-2 rounded bg-[var(--accent)] text-[var(--bg-primary)]">Add</button>
                <button onClick={onClose} className="px-3 py-2 rounded border">Close</button>
              </div>
            </div>

            <div className="mb-4">
              {showForm && (
                <div className="mb-4">
                  <AssignmentForm initial={editing ? {
                    _id: editing._id,
                    subject: editing.subject,
                    description: editing.description,
                    filePreview: editing.filePreview,
                    fileType: editing.fileType
                  } : null} onCancel={() => { setShowForm(false); setEditing(null) }} onSaved={handleSaved}/>
                </div>
              )}

              {loading ? (
                <div className="p-6 text-center">Loading...</div>
              ) : assignment.length === 0 ? (
                <div className="p-6 text-center text-[var(--text-secondary)]">No assignments yet</div>
              ) : (
                <div className="space-y-3">
                  {assignment.map((a) => (
                    <div key={a._id} className="p-3 rounded bg-[var(--bg-secondary)] flex items-start gap-4 hover:shadow-md transition">
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-lg text-[var(--accent)] font-semibold">{a.subject}</h4>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">{a.description}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button className="px-2 py-1 text-sm bg-white/5 rounded" onClick={() => setViewerItem(a)}>Preview</button>

                            <div className="relative">
                              <button onClick={() => setDropdownOpen(dropdownOpen === a._id ? null : a._id)} className="px-2 py-1 text-lg">⋮</button>
                              {dropdownOpen === a._id && (
                                <div className="absolute right-0 top-8 bg-[var(--bg-primary)] border border-white/10 rounded shadow p-2 z-50">
                                  <button onClick={() => handleEdit(a)} className="block w-full text-left px-3 py-1 hover:bg-white/5">Edit</button>
                                  <button onClick={() => handleDelete(a._id)} className="block w-full text-left px-3 py-1 hover:bg-white/5">Delete</button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {a.filePreview && (
                          <div className="mt-3">
                            {a.fileType?.startsWith('image/') ? (
                              <img src={a.filePreview} alt={a.subject} className="max-w-[160px] rounded cursor-pointer" onClick={() => setViewerItem(a)} />
                            ) : a.fileType === 'application/pdf' ? (
                              <div className="w-full h-36 bg-black/5 rounded p-1">
                                <iframe src={a.filePreview} className="w-full h-full" title={a.subject} />
                              </div>
                            ) : (
                              <a href={a.filePreview} target="_blank" rel="noreferrer" className="underline">Open file</a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <FullScreenViewer open={!!viewerItem} item={viewerItem ? {
              filePreview: viewerItem.filePreview,
              fileType: viewerItem.fileType,
              subject: viewerItem.subject,
              description: viewerItem.description,
              fileName: viewerItem.fileName,
              fileUrl: viewerItem.fileUrl,
            } : null} onClose={() => setViewerItem(null)} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
