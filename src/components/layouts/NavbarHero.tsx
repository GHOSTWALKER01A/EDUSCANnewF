"use client"

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

type Props = { heroInView: boolean }

export default function NavBar({ heroInView }: Props) {
  // show nav once hero not in view (i.e., after scroll)
  const [show, setShow] = useState(false)

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
          className="fixed top-0 left-0 right-0 z-100 backdrop-blur-md bg-gradient-to-r from-bgSecondary to-bgPrimary shadow-lg"
        >
            {/* fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 py-3 bg-gradient-to-r from-bgSecondary to-bgPrimary shadow-lg */}
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-3 flex items-center justify-between">
            <div className="text-[var(--accent)] font-extrabold text-2xl">
            <Link href="/" className="flex items-center gap-3 text-[var(--accent)] font-bold text-xl">
          <Image src="/logo.png" width={44} height={44} alt="logo" />
          EduScan
        </Link>
            </div>
            <nav className="hidden md:flex gap-6 text-sm text-[var(--text-secondary)]">
              <Link href="/"><span className="hover:text-[var(--accent)]">Home</span></Link>
          <Link href="/student/dashboard/materials"><span className="hover:text-[var(--accent)]">Materials</span></Link>
          <Link href="/student/dashboard/schedule"><span className="hover:text-[var(--accent)]">Schedule</span></Link>
          <Link href="/student/dashboard/attendance"><span className="hover:text-[var(--accent)]">Attendance</span></Link>
          {/* <Link href="/student/dashboard/attendance"><span className="hover:text-[var(--accent)]">Attendance</span></Link> */}
          <Link href="/student/dashboard/events"><span className="hover:text-[var(--accent)]">Events</span></Link>
          <Link href="/student/dashboard/doubt"><span className="hover:text-[var(--accent)]">Doubt</span></Link>
            </nav>
             <div className="flex items-center gap-3">
                
          <Link href="/student/dashboard/profile"><Image src="/profile.png" alt="profile" width={38} height={38} className="rounded-full" /></Link>
        </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  )
}
