
import { motion } from 'framer-motion'

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
      <svg className="mx-auto h-16 w-16 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="1.5" d="M21 8v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8m18 0a2 2 0 00-2-2H5a2 2 0 00-2 2m18 0l-9 6-9-6" />
      </svg>

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
