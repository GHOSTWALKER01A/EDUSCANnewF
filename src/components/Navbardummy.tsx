// src/components/Navbardummy.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbardummy({ onOpenIntro }: { onOpenIntro?: () => void }) {
  const [search, setSearch] = useState('')

  return (
    <header className='fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 py-3 bg-gradient-to-r from-bgSecondary to-bgPrimary shadow-lg'>
      <div className="flex items-center gap-4">
        <Link href="/login" className="relative text-2xl md:text-3xl font-bold tracking-wide text-accent flex items-center">
          EduScan
          <Image src="/logo.png" alt="Logo" width={60} height={60} className="ml-3" />
        </Link>
      </div>

      <nav className='hidden md:flex items-center space-x-6'>
        {['Home','Materials','Schedule','Attendance','Doubt','Events'].map((t)=>(
          <Link key={t} href="/login" className='relative text-sm md:text-base font-medium text-textSecondary hover:text-accent transition-colors after:absolute after:left-0 after:bottom-[-6px]'>
            {t}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <button onClick={() => onOpenIntro?.()} className="hidden md:inline-block text-sm text-textSecondary hover:text-accent">Intro</button>
        <Link href="/login">
          <Image src="/profile.png" alt="Profile" width={44} height={44} className="rounded-full bg-[#c2b8ff]" />
        </Link>
      </div>
    </header>
  )
}
