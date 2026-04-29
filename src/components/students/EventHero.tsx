// components/EventHero.tsx
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CalendarDays, MapPin, CheckCircle2 } from 'lucide-react'

type Props = { id: string | null; onClose: () => void }

export default function EventModal({ id, onClose }: Props) {
  const event = id ? {
    title: 'Science Fair 2026',
    date: 'May 5, 2026',
    time: '10:00 AM - 4:00 PM',
    place: 'Main Hall',
    description: 'Join us for the annual Science Fair featuring groundbreaking student projects. Discover innovations in AI, robotics, and renewable energy. Food and refreshments will be provided. RSVP early to secure your spot!',
    video: '/events/e1.mp4'
  } : null

  return (
    <AnimatePresence>
      {id && event && (
        <motion.div
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div 
            initial={{ y: 40, scale: 0.95 }} 
            animate={{ y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } }} 
            exit={{ y: 40, scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[var(--card-bg)]/90 backdrop-blur-2xl border border-[var(--border-color)]/50 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden relative"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 md:p-8 border-b border-[var(--border-color)]/20">
               <div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--accent)] tracking-tight">
                    {event.title}
                  </h3>
               </div>
               <button 
                  onClick={onClose} 
                  aria-label="Close" 
                  className="p-2 rounded-full bg-[var(--bg-primary)] border border-[var(--border-color)]/30 text-[var(--text-secondary)] hover:text-white hover:bg-rose-500 hover:border-rose-500 transition-all"
               >
                 <X className="w-5 h-5" />
               </button>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Info Column */}
              <div className="lg:col-span-2 space-y-6">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg-primary)]/50 p-3 rounded-xl border border-[var(--border-color)]/30">
                       <CalendarDays className="w-5 h-5 text-amber-500" />
                       <span>{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg-primary)]/50 p-3 rounded-xl border border-[var(--border-color)]/30">
                       <MapPin className="w-5 h-5 text-emerald-500" />
                       <span>{event.place}</span>
                    </div>
                 </div>
                 
                 <div>
                    <h4 className="font-bold text-[var(--text-primary)] mb-2 uppercase tracking-wide text-sm">About the event</h4>
                    <p className="text-[var(--text-secondary)] leading-relaxed text-sm md:text-base">
                      {event.description}
                    </p>
                 </div>

                 <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[var(--accent)] to-indigo-600 text-white font-bold shadow-lg shadow-[var(--accent)]/20 hover:shadow-[var(--accent)]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300">
                    <CheckCircle2 className="w-5 h-5" />
                    RSVP / Register
                 </button>
              </div>

              {/* Media Column */}
              <div className="lg:col-span-3">
                 <div className="bg-black/60 rounded-2xl overflow-hidden border border-[var(--border-color)]/30 shadow-inner">
                    <video src={event.video} controls className="w-full aspect-video object-cover" poster="/events/poster-placeholder.jpg" />
                 </div>
              </div>
            </div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

