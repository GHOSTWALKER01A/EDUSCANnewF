
import React from 'react'
import { motion } from 'framer-motion'

type Props = { onOpen: (id: string) => void }

const events = [
  { id: 'e1', title: 'Science Fair', date: 'May 5, 2026', time: '10:00 AM', place: 'Main Hall', video: '/events/e1.mp4' },
  { id: 'e2', title: 'Cultural Fest', date: 'June 10, 2026', time: '2:00 PM', place: 'Auditorium', video: '/events/e2.mp4' },
  { id: 'e3', title: 'Sports Day', date: 'July 1, 2026', time: '8:00 AM', place: 'Ground', video: '/events/e3.mp4' },
  { id: 'e4', title: 'Guest Lecture', date: 'Aug 18, 2026', time: '3:00 PM', place: 'Seminar Hall', video: '/events/e4.mp4' }
]

export default function EventsGrid({ onOpen }: Props) {
  return (
    <motion.section
      id="events"
      className="py-16"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h3 className="text-2xl font-bold text-[var(--accent)]">Upcoming Events</h3>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.map((ev) => (
          <motion.div
            key={ev.id}
            className="bg-[var(--bg-secondary)] rounded-xl p-4 shadow cursor-pointer overflow-hidden"
            whileHover={{ scale: 1.02 }}
            onClick={() => onOpen(ev.id)}
          >
            <div className="h-36 bg-black rounded-md overflow-hidden mb-3">
              {/* show poster or thumbnail if available */}
              <video src={ev.video} muted className="w-full h-full object-cover" />
            </div>
            <h4 className="text-lg font-semibold">{ev.title}</h4>
            <p className="text-[var(--text-secondary)] text-sm">{ev.date} • {ev.time}</p>
            <p className="text-[var(--text-secondary)] text-sm mt-2">{ev.place}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
