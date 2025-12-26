
import { motion } from 'framer-motion'

export default function StepOTP({
  otp,
  setOtp,
  onNext,
}: {
  otp: string
  setOtp: (v: string) => void
  onNext: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-4"
    >
      <svg className="mx-auto h-16 w-16 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeWidth="1.5" d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3v3h-6v-3z" />
        <path strokeWidth="1.5" d="M6 11h12v10H6z" />
      </svg>

      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="w-full rounded-lg border px-3 py-2"
      />

      <button onClick={onNext} className="w-full rounded-full bg-[var(--accent)] py-2 font-semibold">
        Verify OTP
      </button>
    </motion.div>
  )
}
