
import React from 'react'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--bg-primary)]/80 backdrop-blur-md">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute w-24 h-24 rounded-full border-4 border-transparent border-t-indigo-500 border-r-blue-500 opacity-60 animate-spin" style={{ animationDuration: '2s' }}></div>
        
        {/* Inner reverse spinning ring */}
        <div className="absolute w-16 h-16 rounded-full border-4 border-transparent border-t-amber-500 opacity-80 animate-spin" style={{ animationDuration: '1.2s', animationDirection: 'reverse' }}></div>
        
        {/* Center pulsing icon or dot */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-amber-500 animate-pulse shadow-[0_0_20px_rgba(99,102,241,0.6)]"></div>
      </div>
      <p className="mt-8 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-[var(--accent)] to-amber-500 animate-pulse tracking-widest">
        LOADING
      </p>
    </div>
  )
}
