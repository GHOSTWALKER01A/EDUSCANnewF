
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { useState } from 'react'

export default function StepReset({
  onSubmit,
}: {
  onSubmit: (p: string, c: string) => void
}) {
  const [p1, setP1] = useState('')
  const [p2, setP2] = useState('')

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <Lock className="mx-auto h-16 w-16 text-[var(--accent)]" strokeWidth={1.5} />

      <input type="password" placeholder="New Password" onChange={(e) => setP1(e.target.value)} className="w-full rounded-lg border px-3 py-2" />
      <input type="password" placeholder="Confirm Password" onChange={(e) => setP2(e.target.value)} className="w-full rounded-lg border px-3 py-2" />

      <button onClick={() => onSubmit(p1, p2)} className="w-full rounded-full bg-[var(--accent)] py-2 font-semibold">
        Save Password
      </button>
    </motion.div>
  )
}
