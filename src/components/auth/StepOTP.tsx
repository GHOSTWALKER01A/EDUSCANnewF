
import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'

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
      <ShieldCheck className="mx-auto h-16 w-16 text-[var(--accent)]" strokeWidth={1.5} />

      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="w-full rounded-lg border px-3 py-2"
      />

      <button onClick={onNext}
      type='button'
      className="w-full rounded-full bg-[var(--accent)] py-2 font-semibold">
        Verify OTP
      </button>
    </motion.div>
  )
}
