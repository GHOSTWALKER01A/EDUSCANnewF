
'use client'

function EduScanIconMark() {
  return (
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

      <style>{`
        @keyframes scan {
          0%   { top: 0;    opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  )
}
import Link from 'next/link'
import { useState } from 'react'



export default function Navbardummy() {
  const [search, setSearch] = useState('')


  return (
    <>
    <header className='fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 py-3 bg-gradient-to-r from-bgSecondary to-bgPrimary shadow-lg'>
      <Link href="#home" className="group relative flex items-center gap-3 z-50">
          
          {/* The "EduScan" Icon Mark */}
          <EduScanIconMark />

          {/* Typography */}
          <div className="flex flex-col justify-center">
            <span className="text-2xl md:text-3xl font-extrabold tracking-tight">
              <span className="text-white">Edu</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)]">Scan</span>
            </span>
          </div>
        </Link>

      <nav className='hidden md:flex items-center space-x-6'>
        {['Home','Materials','Schedule','Attendance','Doubt','Events'].map((t)=>(
          <Link key={t} href="/login" className='relative text-sm md:text-base font-medium text-textSecondary hover:text-accent transition-colors after:absolute after:left-0 after:bottom-[-6px]'>
            {t}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[var(--accent)] to-indigo-600 shadow-md shadow-[var(--accent)]/20 hover:shadow-[var(--accent)]/40 hover:-translate-y-0.5 transition-all"
        >
          Login
        </Link>
      </div>


    </header>
 </>
)
}

