// src/components/student/EditProfileModal.tsx
'use client'
import { useState, useRef } from 'react'
import { IUser } from '../../types'
import api from '../../lib/api'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

type Props = {
  open: boolean
  profile?: IUser | null
  onClose: () => void
  onSaved: (updated: IUser) => void
}

export default function EditProfileModal({ open, profile, onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    fullname: profile?.fullname ?? '',
    email: profile?.email ?? '',
    phoneNumber: profile?.phoneNumber ?? '',
  })
  const [file, setFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  if (!open) return null

  async function save() {
    try {
      const fd = new FormData()
      fd.append('fullname', form.fullname)
      fd.append('email', form.email)
      fd.append('phoneNumber', form.phoneNumber ?? '')
      if (file) fd.append('profilephoto', file)
      const resp = await api.put('/api/student/profile',
     fd, 
     { headers: { 'Content-Type': 'multipart/form-data' }
     })
      toast.success('Profile updated')
      onSaved(resp.data.data)
    } catch (err: any) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Failed to save')
    }
  }

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/50">
      <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[var(--card-bg)] p-6 rounded-lg w-full max-w-lg">
        <h3 className="text-xl text-[var(--accent)] mb-4">Edit Profile</h3>
        <div className="space-y-3">
          <input className="w-full p-2 rounded bg-[var(--bg-primary)]" value={form.fullname} onChange={e => setForm(f => ({ ...f, fullname: e.target.value }))} />
          <input className="w-full p-2 rounded bg-[var(--bg-primary)]" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          <input className="w-full p-2 rounded bg-[var(--bg-primary)]" value={form.phoneNumber} onChange={e => setForm(f => ({ ...f, phonenumber: e.target.value }))} />
          <div className="flex items-center gap-2">
            <input ref={fileRef} type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
            <button onClick={save} className="px-4 py-2 rounded bg-[var(--accent)] text-[var(--bg-primary)]">Save</button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
