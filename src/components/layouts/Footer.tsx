'use client'
import Link from 'next/link'

export default function Footer(){
  return (
    <footer className="bg-[var(--card-bg)] border-t border-[var(--accent)] py-6 mt-12">
      <div className="max-w-6xl mx-auto px-6 text-center text-sm text-[var(--text-secondary)]">
        © {new Date().getFullYear()} EduScan — All rights reserved • <Link href="#" className="text-[var(--accent)]">Privacy</Link>
      </div>
    </footer>
  )
}
