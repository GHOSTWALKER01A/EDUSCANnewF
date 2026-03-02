
'use client'
import React, { useEffect, useState } from 'react'
import { Tip } from '../../types/metrics'
import { motion } from 'framer-motion'

export default function TipsCarousel({ tips }: { tips: Tip[] }) {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % tips.length), 4000)
    return () => clearInterval(id)
  }, [tips.length])
  if (!tips || tips.length === 0) return null
  
  return (
    <div className="relative w-full">
      <motion.div key={tips[index].id} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="p-3">
        <p className="text-sm text-[var(--text-secondary)]">{tips[index].text}</p>
      </motion.div>
      <div className="flex gap-1 mt-2">
        {tips.map((t, i) => (
          <div key={t.id} className={`w-2 h-2 rounded-full ${i === index ? 'bg-[var(--accent)]' : 'bg-white/20'}`} />
        ))}
      </div>
    </div>
  )
}
