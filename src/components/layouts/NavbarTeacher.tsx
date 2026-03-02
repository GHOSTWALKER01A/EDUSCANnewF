'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar(){
  return (
    <header className="fixed w-full z-50 top-0 left-0 bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-primary)] shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-[var(--accent)] font-bold text-xl">
          <Image src="/logo.png" width={44} height={44} alt="logo" />
          EduScan
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
          <Link href="/teacher/dashboard/teacherprofile"><Image src="/profile.png" alt="profile" width={38} height={38} className="rounded-full" /></Link>
        </div>
      </div>
    </header>
  )
}
