
'use client'
import React from 'react'
import { motion } from 'framer-motion'

type Props = {
  size?: number
  stroke?: number
  percentage: number
  label?: string
  color?: string
}

export default function ProgressRing({ size = 96, stroke = 8, percentage, label, color = 'var(--accent)' }: Props) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const dash = (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={`g-${label}`} x1="0" x2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={color} stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          <circle r={radius} fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
          <motion.circle
            r={radius}
            fill="transparent"
            stroke={`url(#g-${label})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference - dash}`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            transform="rotate(-90)"
          />
        </g>
      </svg>
      <div className="mt-2 text-center">
        <div className="text-sm font-semibold">{Math.round(percentage)}%</div>
        {label && <div className="text-xs text-[var(--text-secondary)]">{label}</div>}
      </div>
    </div>
  )
}
