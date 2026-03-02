
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Props = { id: string | null; onClose: () => void }

export default function EventModal({ id, onClose }: Props) {
  const event = id ? {
    title: 'Event detail',
    description: 'Description for the event. Add rich media and RSVP here.',
    video: '/events/e1.mp4'
  } : null

  return (
    <AnimatePresence>
      {id && event && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
        >
          <motion.div initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }}
            className="bg-[var(--card-bg)] rounded-xl max-w-3xl w-full p-6 mx-4"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-[var(--accent)]">{event.title}</h3>
              <button onClick={onClose} aria-label="Close" className="text-[var(--text-secondary)]">✕</button>
            </div>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <p className="text-[var(--text-secondary)]">{event.description}</p>
                <div className="mt-4 text-sm text-[var(--accent)] font-semibold cursor-pointer">Register</div>
              </div>
              <div>
                <video src={event.video} controls className="w-full rounded" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


