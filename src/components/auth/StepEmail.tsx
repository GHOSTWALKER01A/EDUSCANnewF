
import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'

export default function StepEmail({
  email,
  setEmail,
  onNext,
}: {
  email: string
  setEmail: (v: string) => void
  onNext: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-4"
    >
      <Mail className="mx-auto h-16 w-16 text-[var(--accent)]" strokeWidth={1.5} />

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your college email"
        className="w-full rounded-lg border px-3 py-2 bg-[var(--bg-primary)]"
      />

      <button onClick={onNext} className="w-full rounded-full bg-[var(--accent)] py-2 font-semibold">
        Send OTP
      </button>
    </motion.div>
  )
}
