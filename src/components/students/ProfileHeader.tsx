
'use client'
import Image from 'next/image'
import { IUser } from '../../types'
import { motion } from 'framer-motion'

type Props = {
  profile: IUser
  onScanClick: () => void
  onEditClick: () => void
  onEnrollMac?: () => void
}

export default function ProfileHeader({ profile, onScanClick, onEditClick, onEnrollMac }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--card-bg)] p-6 rounded-xl shadow-[0_8px_20px_var(--shadow)]">
      <div className="flex gap-6 items-center">
        <div className="w-36 h-36 rounded-full border-4 border-[var(--accent)] overflow-hidden">
          {profile.profilePhoto ? (
            // next/image prefers static imports but public path works
            // using img for simplicity
            <img src={profile.profilePhoto} alt="Profile" className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full bg-slate-700 flex items-center justify-center text-white text-xl">{profile.fullname?.[0]}</div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--accent)]">{profile.fullname}</h1>
          <div className="mt-2 text-[var(--text-secondary)] space-y-1">
            <div>Student ID: <strong className="text-white">{profile.registrationNo}</strong></div>
            <div>Email: <strong className="text-white">{profile.email}</strong></div>
            <div>Phone: <strong className="text-white">{profile.phoneNumber || '—'}</strong></div>
            <div>Branch / Semester: <strong className="text-white">{profile.branch} / {profile.semester}</strong></div>
            <div>Join Date: <strong className="text-white">{profile.joinDate}</strong></div>
            
          </div>

          <div className="mt-4 flex gap-3">
            <button onClick={onScanClick} className="px-4 py-2 rounded-lg bg-[var(--accent)] text-[var(--bg-primary)] font-semibold hover:scale-[1.02] transition">
              Scan QR
            </button>
            <button onClick={onEditClick} className="px-4 py-2 rounded-lg border border-[var(--accent)] text-[var(--accent)] bg-transparent hover:bg-[var(--accent)] hover:text-[var(--bg-primary)] transition">
              Edit Profile
            </button>
            {!profile.macHash && onEnrollMac && (
              <button onClick={onEnrollMac} className="px-4 py-2 rounded-lg bg-white/5 text-white hover:scale-[1.02] transition">
                Enroll MAC
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
