'use client'
import React from 'react'

type ToggleSwitchProps = {
  checked: boolean
  onChange: () => void
}

export default function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  return (
    <button
      onClick={onChange}
      aria-checked={checked}
      role="switch"
      className="focus:outline-none"
    >
      <svg
        width="42"
        height="24"
        viewBox="0 0 42 24"
        className="cursor-pointer"
      >
        {/* Track */}
        <rect
          x="0"
          y="0"
          width="42"
          height="24"
          rx="12"
          fill={checked ? 'var(--accent)' : 'var(--bg-secondary)'}
          className="transition-colors duration-300"
        />

        {/* Thumb */}
        <circle
          cx={checked ? 30 : 12}
          cy="12"
          r="8"
          fill="white"
          className="transition-all duration-300"
        />
      </svg>
    </button>
  )
}
