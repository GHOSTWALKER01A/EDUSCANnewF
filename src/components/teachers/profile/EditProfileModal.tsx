'use client'
import { useState, useRef, useEffect } from 'react'
import { Profile } from '../../../types/class.types'
import api from '../../../lib/api'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Edit3, Mail, Phone, User, Check, Loader2, Camera, BookOpen } from 'lucide-react'

type Props = {
  open: boolean
  profile?: Profile | null
  onClose: () => void
  onSaved: (updated: Profile) => void
}

export default function EditProfileModal({ open, profile, onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    subject: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (open && profile) {
      setForm({
        fullname: profile.fullname ?? '',
        email: profile.email ?? '',
        phoneNumber: profile.phoneNumber ?? '',
        subject: profile.department ?? '',
      })
      setFile(null)
      setPreview(profile.profilePhoto || null)
    }
  }, [open, profile])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
    }
  }

  async function save() {
    if (!form.fullname.trim() || !form.email.trim()) {
      toast.error('Name and email are required')
      return
    }

    try {
      setLoading(true)
      const fd = new FormData()
      fd.append('fullname', form.fullname)
      fd.append('email', form.email)
      fd.append('phoneNumber', form.phoneNumber ?? '')
      fd.append('subject', form.subject ?? '')
      if (file) fd.append('profilephoto', file)
      
      const resp = await api.put('/teacher/profile', fd, { 
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      toast.success('Profile updated successfully')
      
      const d = resp.data.data;
      const updatedProfile: Profile = {
        fullname: d.fullname,
        id: d.registrationNo?.toString(),
        email: d.email,
        phoneNumber: d.phoneNumber,
        department: d.subject,
        joinDate: d.join_date ? new Date(d.join_date).toISOString().split("T")[0] : undefined,
        profilePhoto: d.profilephoto,
      };

      onSaved(updatedProfile)
      onClose()
    } catch (err: any) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={loading ? undefined : onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-[var(--card-bg)]/90 backdrop-blur-xl border border-[var(--border-color)]/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--border-color)]/30 flex items-center justify-between bg-gradient-to-r from-[var(--bg-secondary)]/50 to-transparent shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--accent)]/10 text-[var(--accent)] rounded-lg">
                  <Edit3 className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Edit Profile</h2>
              </div>
              <button
                onClick={onClose}
                disabled={loading}
                className="p-2 text-[var(--text-secondary)] hover:text-white rounded-full hover:bg-[var(--bg-primary)] transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
              
              {/* Profile Photo Upload */}
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full border-4 border-[var(--card-bg)] shadow-[0_0_0_4px_rgba(var(--accent-rgb),0.3)] overflow-hidden bg-[var(--bg-secondary)] relative z-10 transition-shadow duration-500">
                    {preview ? (
                      <img src={preview} alt="Profile preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)]">
                        <User className="w-10 h-10 opacity-50" />
                      </div>
                    )}
                  </div>
                  <button 
                    disabled={loading}
                    onClick={() => fileRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-full shadow-lg hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-colors disabled:opacity-50 z-20"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-[var(--text-secondary)] font-medium bg-[var(--bg-primary)] px-3 py-1 rounded-full border border-[var(--border-color)]/50">Update Profile Picture</p>
                <input 
                  ref={fileRef} 
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  onChange={handleFileChange} 
                />
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[var(--text-primary)] pl-1">Full Name</label>
                  <div className="relative flex items-center">
                    <User className="w-5 h-5 text-[var(--text-secondary)] absolute left-4" />
                    <input 
                      disabled={loading}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)]/50 rounded-xl py-3 pl-12 pr-4 text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/50 transition-all font-medium disabled:opacity-60" 
                      placeholder="Jane Doe"
                      value={form.fullname} 
                      onChange={e => setForm(f => ({ ...f, fullname: e.target.value }))} 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[var(--text-primary)] pl-1">Email Address</label>
                  <div className="relative flex items-center">
                    <Mail className="w-5 h-5 text-[var(--text-secondary)] absolute left-4" />
                    <input 
                      disabled={loading}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)]/50 rounded-xl py-3 pl-12 pr-4 text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/50 transition-all font-medium disabled:opacity-60" 
                      placeholder="jane@example.com"
                      value={form.email} 
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[var(--text-primary)] pl-1">Phone Number</label>
                  <div className="relative flex items-center">
                    <Phone className="w-5 h-5 text-[var(--text-secondary)] absolute left-4" />
                    <input 
                      disabled={loading}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)]/50 rounded-xl py-3 pl-12 pr-4 text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/50 transition-all font-medium disabled:opacity-60" 
                      placeholder="+1 (555) 000-0000"
                      value={form.phoneNumber} 
                      onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))} 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[var(--text-primary)] pl-1">Department</label>
                  <div className="relative flex items-center">
                    <BookOpen className="w-5 h-5 text-[var(--text-secondary)] absolute left-4" />
                    <input 
                      disabled={loading}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)]/50 rounded-xl py-3 pl-12 pr-4 text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/50 transition-all font-medium disabled:opacity-60" 
                      placeholder="Computer Science"
                      value={form.subject} 
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} 
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[var(--border-color)]/30 bg-[var(--bg-secondary)]/30 flex justify-end gap-3 shrink-0">
              <button 
                onClick={onClose} 
                disabled={loading}
                className="px-5 py-2.5 rounded-xl border border-[var(--border-color)]/50 text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={save} 
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[var(--accent)] to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-[var(--accent)]/20 transition-all font-semibold disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
