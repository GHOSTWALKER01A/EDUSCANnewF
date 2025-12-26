
'use client'
import React, { useEffect, useRef, useState } from 'react'
import api from '../../lib/api'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

type AssignmentPayload = {
  _id?: string
  subject: string
  description?: string
  filePreview?: string
  fileType?: string
}

export default function AssignmentForm({
  initial,
  onCancel,
  onSaved,
}: {
  initial?: AssignmentPayload | null
  onCancel: () => void
  onSaved: (saved: any) => void
}) {
  const [subject, setSubject] = useState(initial?.subject ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | undefined>(initial?.filePreview)
  const [fileType, setFileType] = useState<string | undefined>(initial?.fileType)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setSubject(initial?.subject ?? '')
    setDescription(initial?.description ?? '')
    setFilePreview(initial?.filePreview)
    setFileType(initial?.fileType)
    setFile(null)
  }, [initial])

  const handleFile = (f?: FileList | null) => {
    const chosen = f?.[0] ?? null
    if (!chosen) {
      setFile(null)
      setFilePreview(undefined)
      setFileType(undefined)
      return
    }
    setFile(chosen)
    setFileType(chosen.type)
    const reader = new FileReader()
    reader.onload = () => setFilePreview(reader.result as string)
    reader.readAsDataURL(chosen)
  }

  const validate = () => {
    if (!subject.trim()) {
      toast.error('Please enter subject')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('subject', subject)
      fd.append('description', description ?? '')
      if (file) fd.append('file', file)

      let resp
      if (initial && initial._id) {
        resp = await api.put(`/api/assignments/${initial._id}`,
           fd, 
           { headers: { 'Content-Type': 'multipart/form-data' } 
          })
      } else {
        resp = await api.post('/api/assignments',
           fd,
            { headers: { 'Content-Type': 'multipart/form-data' } 
          })
      }

      toast.success('Assignment saved')
      onSaved(resp.data.data)
    } catch (err: any) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--card-bg)] p-4 rounded">
      <div className="space-y-3">
        <label className="text-sm text-[var(--accent)]">Subject</label>
        <input className="w-full p-2 rounded bg-[var(--bg-primary)]" value={subject} onChange={(e) => setSubject(e.target.value.toUpperCase())} />

        <label className="text-sm text-[var(--accent)]">Description (optional)</label>
        <textarea className="w-full p-2 rounded bg-[var(--bg-primary)]" value={description} onChange={(e) => setDescription(e.target.value)} />

        <label className="text-sm text-[var(--accent)]">File (image / pdf / doc)</label>
        <input ref={(r) => { fileRef.current = r }} 
        type="file" 
        accept="image/*,application/pdf,.doc,.docx" 
        onChange={(e) => handleFile(e.target.files)} />

        {filePreview && (
          <div className="mt-2">
            {fileType?.startsWith('image/') ? (
              <img src={filePreview} alt="preview" className="max-w-[160px] rounded" />
            ) : fileType === 'application/pdf' ? (
              <iframe src={filePreview} title="pdf" className="w-full h-44 rounded" />
            ) : (
              <p className="text-sm text-[var(--text-secondary)]">File ready: {file?.name ?? 'existing file'}</p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-3">
          <button onClick={onCancel} className="px-4 py-2 rounded border">Cancel</button>
          <button onClick={handleSubmit} disabled={saving} className="px-4 py-2 rounded bg-[var(--accent)] text-[var(--bg-primary)]">
            {saving ? 'Saving...' : initial ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

