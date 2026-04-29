
'use client'
import Image from 'next/image'
import { IUser } from '../../types'
import { motion } from 'framer-motion'
import { QrCode, Edit3, Wifi, Mail,
 Phone, BookOpen, Clock, Fingerprint, LogOut, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

type Props = {
  profile: IUser
  onScanClick: () => void
  onEditClick: () => void
  onEnrollMac?: () => void
}

export default function ProfileHeader({ profile, onScanClick, onEditClick, onEnrollMac }: Props) {
  const photoUrl = profile.profilePhoto || (profile as any).profilephoto
  const [imgError, setImgError] = useState(false)
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  }

  const { logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await logout()
    } catch (error) {
      console.error(error)
    
      setIsLoggingOut(false)
    }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden" 
      animate="visible" 
      className="relative overflow-hidden bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)]/30 p-6 md:p-8 rounded-3xl shadow-2xl shadow-black/10 group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
        
        {/* Profile Image */}
        <motion.div variants={itemVariants} className="shrink-0 relative">
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-[var(--card-bg)] shadow-[0_0_0_4px_rgba(var(--accent-rgb),0.3)] overflow-hidden bg-[var(--bg-secondary)] relative z-10 group-hover:shadow-[0_0_0_4px_rgba(var(--accent-rgb),0.6)] transition-shadow duration-500">
            {photoUrl && !imgError ? (
              <img 
                src={photoUrl} 
                alt={`${profile.fullname}'s Profile`} 
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-[var(--accent)] flex items-center justify-center text-white text-5xl font-bold uppercase shadow-inner">
                {profile.fullname?.[0] || '?'}
              </div>
            )}
          </div>
          {/* Decorative rotating accent ring behind image */}
          <div className="absolute inset-[-8px] rounded-full border border-[var(--accent)]/30 border-dashed animate-[spin_10s_linear_infinite] pointer-events-none" />
        </motion.div>

        {/* Profile Info */}
        <div className="flex-1 w-full text-center md:text-left">
          <motion.div variants={itemVariants} className="mb-4">
            <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--accent)] tracking-tight">
              {profile.fullname}
            </h1>
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 rounded-full text-sm font-semibold">
               <Fingerprint className="w-4 h-4" />
               ID: {profile.registrationNo}
            </div>
          </motion.div>

          {/* Info Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-[var(--text-secondary)] font-medium">
            <div className="flex items-center gap-3">
              <div className="bg-[var(--bg-primary)] p-2 rounded-lg border border-[var(--border-color)]/30"><Mail className="w-4 h-4 text-indigo-400" /></div>
              <span className="truncate">{profile.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[var(--bg-primary)] p-2 rounded-lg border border-[var(--border-color)]/30"><Phone className="w-4 h-4 text-emerald-400" /></div>
              <span>{profile.phoneNumber || 'Not provided'}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[var(--bg-primary)] p-2 rounded-lg border border-[var(--border-color)]/30"><BookOpen className="w-4 h-4 text-amber-400" /></div>
              <span>{profile.branch} • Sem {profile.semester}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[var(--bg-primary)] p-2 rounded-lg border border-[var(--border-color)]/30"><Clock className="w-4 h-4 text-rose-400" /></div>
              <span>Joined {profile.joinDate}</span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
            <button 
              onClick={onScanClick} 
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--accent)] to-indigo-600 text-white font-semibold shadow-lg shadow-[var(--accent)]/20 hover:shadow-[var(--accent)]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              <QrCode className="w-5 h-5" />
              Scan QR
            </button>
            <button 
              onClick={onEditClick} 
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]/50 text-[var(--text-primary)] font-semibold shadow-md hover:border-[var(--accent)]/50 hover:bg-[var(--bg-secondary)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              <Edit3 className="w-5 h-5 opacity-70" />
              Edit Profile
            </button>
            <button 
              onClick={handleLogout} 
              disabled={isLoggingOut}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white font-semibold shadow-md hover:shadow-lg hover:shadow-red-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isLoggingOut ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogOut className="w-5 h-5" />
              )}
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
            {!profile.macHash && onEnrollMac ? (
              <button 
                onClick={onEnrollMac} 
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--bg-secondary)] border border-dashed border-[var(--text-secondary)]/30 text-[var(--text-secondary)] hover:text-white hover:border-white/50 font-semibold shadow-md transition-all duration-300"
              >
                <Wifi className="w-5 h-5" />
                Enroll MAC
              </button>
            ) : profile.macHash && onEnrollMac ? (
              <button 
                onClick={onEnrollMac} 
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--bg-secondary)] border border-dashed border-[var(--text-secondary)]/30 text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent)] hover:text-[var(--accent)] font-semibold shadow-md transition-all duration-300"
              >
                <Wifi className="w-5 h-5" />
                Reset MAC
              </button>
            ) : null}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
