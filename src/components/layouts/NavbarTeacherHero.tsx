"use client"

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '../../context/AuthContext'

type Props = { heroInView: boolean }

export default function NavbarTeacherHero({ heroInView }: Props) {
  // show nav once hero not in view (i.e., after scroll)
  const [show, setShow] = useState(false)
  const { user } = useAuth()
  const photoUrl = user?.profilePhoto || (user as any)?.profilephoto
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    setShow(!heroInView)
  }, [heroInView])

  return (
    <AnimatePresence>
      {show && (
        <motion.header
          initial={{ y: -80, rotateX: 90, opacity: 0 }}
          animate={{ y: 0, rotateX: 0, opacity: 1 }}
          exit={{ y: -80, rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-md bg-gradient-to-r from-bgSecondary to-bgPrimary shadow-lg"
        >
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
           <Link href="/" className="group relative flex items-center gap-3 z-50">
              
              {/* The "EduScan" Icon Mark */}
              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] border border-[var(--accent)]/30 group-hover:border-[var(--accent)]/80 transition-colors duration-500 overflow-hidden shadow-[0_0_15px_rgba(194,184,255,0.05)] group-hover:shadow-[0_0_20px_rgba(194,184,255,0.25)]">
                
                {/* Scanner Laser Animation */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[var(--accent)] shadow-[0_0_12px_2px_var(--accent)] opacity-80 animate-[scan_3s_ease-in-out_infinite]" />
                
                {/* Custom SVG: Open Book + Scanner Reticles */}
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px] text-[var(--accent)] group-hover:scale-105 transition-transform duration-500">
                  {/* Scanner Reticles (Corners) */}
                  <path d="M4 8V6C4 4.89543 4.89543 4 6 4H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M4 16V18C4 19.1046 4.89543 20 6 20H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M20 8V6C20 4.89543 19.1046 4 18 4H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M20 16V18C20 19.1046 19.1046 20 18 20H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  
                  {/* Open Book */}
                  <path d="M12 8V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M12 16C12 16 9.5 14.5 7 14.5V7.5C9.5 7.5 12 8 12 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M12 16C12 16 14.5 14.5 17 14.5V7.5C14.5 7.5 12 8 12 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Typography */}
              <div className="flex flex-col justify-center">
                <span className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  <span className="text-white">Edu</span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)]">Scan</span>
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex gap-6 text-[var(--text-secondary)]">
              <Link href="/"><span className="hover:text-[var(--accent)]">Home</span></Link>
              <Link href="/teacher/dashboard/teachermaterial"><span className="hover:text-[var(--accent)]">Materials</span></Link>
              <Link href="/teacher/dashboard/teacherschedule"><span className="hover:text-[var(--accent)]">Schedule</span></Link>
              <Link href="/teacher/dashboard/teacherattendance"><span className="hover:text-[var(--accent)]">Attendance</span></Link>
              <Link href="/teacher/dashboard/teacherevent"><span className="hover:text-[var(--accent)]">Events</span></Link>
              <Link href="/teacher/dashboard/teacherdoubts"><span className="hover:text-[var(--accent)]">Doubt</span></Link>
              <Link href="/teacher/dashboard/studentrecord"><span className="hover:text-[var(--accent)]">Record</span></Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/teacher/dashboard/teacherprofile">
                {photoUrl && !imgError ? (
                  <img 
                    src={photoUrl} 
                    alt="profile" 
                    className="w-[38px] h-[38px] rounded-full object-cover border border-[var(--shadow)]/10" 
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <Image src="/profile.png" alt="profile" width={38} height={38} className="rounded-full" />
                )}
              </Link>
            </div>
          </div>

           <style>{`
            @keyframes scan {
              0% { top: 0; opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { top: 100%; opacity: 0; }
            }
          `}</style>
        </motion.header>
      )}
    </AnimatePresence>
  )
}
