// src/components/EduScanLoader.tsx
'use client'
import { motion } from 'framer-motion'

export default function EduScanLoader({ size = 120, shimmerLoop=false }: { size?: number; shimmerLoop?: boolean }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bgPrimary">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: shimmerLoop ? Infinity : 0, duration: 1.6, ease: "linear" }}
        style={{ width: size, height: size }}
        className="rounded-full bg-[linear-gradient(135deg,#fff4,rgba(255,255,255,0.03))] flex items-center justify-center shadow-lg"
      >
        <div className="h-10 w-10 rounded-full bg-accent" />
      </motion.div>
    </div>
  )
}
