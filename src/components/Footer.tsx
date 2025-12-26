
import Link from 'next/link'

export default function Footer(){
  return (
    <footer className="bg-[var(--card-bg)] px-6 md:px-16 py-8 text-center border-t-2 border-accent">
      <p className="mb-4 text-sm opacity-90">© 2025 EduScan. All rights reserved.</p>
      <div className="flex justify-center gap-4">
        <Link href="#" className="text-sm text-textSecondary hover:text-accent">Privacy</Link>
        <Link href="#" className="text-sm text-textSecondary hover:text-accent">Terms</Link>
        <Link href="#" className="text-sm text-textSecondary hover:text-accent">Support</Link>
      </div>
    </footer>
  )
}
