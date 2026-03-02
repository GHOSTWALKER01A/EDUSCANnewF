
import React from 'react'
import { motion } from 'framer-motion'

const dummy = [
  { id: 'r1', title: 'Study Material - Maths', desc: 'Download notes & slides' },
  { id: 'r2', title: 'Lab Manual - ECE', desc: 'Practical lab instructions' },
  { id: 'r3', title: 'Previous Year Papers', desc: 'Past papers & solutions' },
  { id: 'r4', title: 'Doubt Forum', desc: 'Ask teacher & peers' }
]

export default function ResourcesGrid() {
  return (
    <motion.section
      id="resources"
      className="py-16"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h3 className="text-2xl font-bold text-[var(--accent)]">Resources</h3>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dummy.map((d, i) => (
          <motion.article
            key={d.id}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="bg-[var(--bg-secondary)] p-4 rounded-lg shadow cursor-pointer"
          >
            <h4 className="font-semibold text-lg">{d.title}</h4>
            <p className="text-[var(--text-secondary)] mt-2">{d.desc}</p>
            <div className="mt-4 text-sm text-[var(--accent)] font-semibold">Open</div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  )
}
