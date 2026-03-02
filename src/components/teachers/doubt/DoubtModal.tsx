// client/src/components/teachers/doubt/DoubtModal.tsx
'use client'
import React, { useEffect, useState } from 'react'
import type { DoubtItem } from '../../../types/doubt.type'
import Modal from '../../UI/Modal' 
import { toast } from 'react-toastify'

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

  useEffect(() => {
    if (!open) {
      setText('')
      setFiles([])
    } else {
      setText('')
      setFiles([])
    }
  }, [open, doubt])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files
    if (f && f.length) setFiles(prev => [...prev, ...Array.from(f)])
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!doubt) return
    if (!text.trim() && files.length === 0) {
      toast.error('Enter text or attach a file')
      return
    }
    try {
      setSubmitting(true)
      const fd = new FormData()
      fd.append('message', text)
      for (const f of files) fd.append('attachments', f)
      await onReply(doubt._id, fd)
      toast.success('Reply sent')
      onClose()
    } catch (err:any) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Failed to send reply')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open || !doubt) return null

  return (
    <Modal open={open} onClose={onClose} title={`${doubt.studentId?.fullname || 'Student'} — Doubt`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          {/* <h3 className="text-lg font-semibold text-[var(--accent)]">{doubt.title || 'Doubt'}</h3> */}
          <p className="text-sm text-[var(--text-secondary)] my-2">{doubt.description}</p>

          <div className="mt-4">
            <h4 className="font-semibold">Replies</h4>
            <div className="space-y-3 mt-2">
              {(doubt.replies || []).map((r:any, idx:number) => (
                <div key={idx} className="p-3 bg-[var(--bg-secondary)] rounded">
                  <div className="text-sm font-semibold">{r.by?.fullname || r.by?.name || 'Staff'}</div>
                  <div className="text-sm text-[var(--text-primary)] mt-1">{r.message}</div>
                  {r.attachments?.length > 0 && (
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {r.attachments.map((a:any, i:number) => (
                        <a key={i} href={a.url} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 bg-[rgba(255,255,255,0.03)] rounded">
                          {a.fileName || 'file'}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {(!doubt.replies || doubt.replies.length===0) && <div className="text-[var(--text-secondary)]">No replies yet</div>}
            </div>
          </div>
        </div>

        <aside className="md:col-span-1">
          <div className="p-3 bg-[var(--card-bg)] rounded">
            <div className="text-sm text-[var(--text-secondary)]">Student</div>
            <div className="font-semibold text-[var(--accent)]">{doubt.studentId?.fullname}</div>
            <div className="text-xs text-[var(--text-secondary)] mt-2">{doubt.branch}</div>
            <div className="text-xs text-[var(--text-secondary)] mt-2">{new Date(doubt.createdAt || doubt.date || '').toLocaleString()}</div>
          </div>

          <form className="mt-4" onSubmit={handleSubmit}>
            <label className="block text-sm mb-1">Your reply</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className="w-full p-2 rounded bg-[var(--bg-primary)]" />

            <label className="block text-sm mt-2 mb-1">Attachments</label>
            <input type="file" multiple onChange={handleFile} />

            <div className="flex gap-2 mt-4">
              <button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-[var(--accent)] text-white">
                {submitting ? 'Sending...' : 'Send Reply'}
              </button>
              <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Close</button>
            </div>
          </form>
        </aside>
      </div>
    </Modal>
  )
}
