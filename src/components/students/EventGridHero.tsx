// components/EventsGrid.tsx
import React from 'react'
import { motion, Variants } from 'framer-motion'
import { CalendarDays, MapPin, Clock } from 'lucide-react'
import { useEvents } from '../../hooks/useEvents'

type Props = { onOpen: (id: string) => void }

const dummyEvents = [
  { _id: 'e1', title: 'Science Fair', startDate: 'May 5, 2026', startTime: '10:00 AM', location: 'Main Hall', mediaUrl: '/events/e1.mp4' },
  { _id: 'e2', title: 'Cultural Fest', startDate: 'June 10, 2026', startTime: '2:00 PM', location: 'Auditorium', mediaUrl: '/events/e2.mp4' },
  { _id: 'e3', title: 'Sports Day', startDate: 'July 1, 2026', startTime: '8:00 AM', location: 'Ground', mediaUrl: '/events/e3.mp4' },
  { _id: 'e4', title: 'Guest Lecture', startDate: 'Aug 18, 2026', startTime: '3:00 PM', location: 'Seminar Hall', mediaUrl: '/events/e4.mp4' }
]

export default function EventsGrid({ onOpen }: Props) {
  const { query } = useEvents(1, 4)
  const fetchedEvents = query.data?.events || []
  const eventsToDisplay = fetchedEvents.length > 0 ? fetchedEvents : dummyEvents
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  }

  return (
    <motion.section
      id="events"
      className="py-16"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex items-center gap-3 mb-8">
         <div className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
            <CalendarDays className="w-6 h-6 text-amber-500" />
         </div>
         <h3 className="text-3xl font-bold text-[var(--accent)] tracking-tight">Upcoming Events</h3>
      </div>

      <motion.div 
         variants={containerVariants}
         initial="hidden"
         whileInView="visible"
         viewport={{ once: true }}
         className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {eventsToDisplay.map((ev) => (
          <motion.article
            key={ev._id}
            variants={cardVariants}
            className="group bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)]/30 rounded-3xl p-4 shadow-xl shadow-black/5 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-[var(--accent)]/10 hover:border-amber-500/40"
            whileHover={{ y: -6 }}
            onClick={() => onOpen(ev._id)}
          >
            <div className="h-40 bg-black/50 rounded-2xl overflow-hidden mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <video src={ev.mediaUrl} muted className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" />
              <div className="absolute bottom-3 left-3 z-20 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5">
                 <Clock className="w-3.5 h-3.5 text-amber-400" />
                 <span className="text-xs font-bold text-white tracking-widest">{new Date(ev.startDate).toLocaleDateString() === 'Invalid Date' ? ev.startDate : new Date(ev.startDate).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="px-2 pb-2">
               <h4 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-amber-400 transition-colors line-clamp-1">{ev.title}</h4>
               <div className="mt-3 space-y-2">
                 <div className="flex items-center text-sm text-[var(--text-secondary)] font-medium gap-2">
                   <Clock className="w-4 h-4 text-[var(--accent)] opacity-70" />
                   <span>{ev.startTime || 'TBD'}</span>
                 </div>
                 <div className="flex items-center text-sm text-[var(--text-secondary)] font-medium gap-2">
                   <MapPin className="w-4 h-4 text-emerald-400 opacity-70" />
                   <span className="truncate">{ev.location || 'TBA'}</span>
                 </div>
               </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </motion.section>
  )
}
