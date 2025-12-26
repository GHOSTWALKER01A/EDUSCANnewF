// src/components/EduscanIntro.tsx
'use client'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import Image from 'next/image'

export default function EduscanIntro({ onFinish }: { onFinish?: () => void }) {

  useEffect(() => {
    const t = setTimeout(() => onFinish?.(), 2000)  // plays for 2s
    return () => clearTimeout(t)
  }, [onFinish])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-bgPrimary text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div animate={{ rotate: [0, 8, -8, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} className="rounded-full p-4 bg-white/6">
          <Image src="/logo.png" width={90} height={90} alt="logo" />
        </motion.div>
        <motion.h2 initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-2xl font-semibold">
          EduScan
        </motion.h2>
      </motion.div>
    </div>
  )
}
