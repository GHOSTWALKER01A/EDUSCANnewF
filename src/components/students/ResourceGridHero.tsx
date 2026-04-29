// components/ResourcesGrid.tsx
import React from 'react'
import { motion, Variants } from 'framer-motion'
import { FolderOpen, ArrowUpRight } from 'lucide-react'
import { useMaterials } from '../../hooks/useMaterials'

const dummy = [
  { _id: 'r1', title: 'Study Material - Maths', description: 'Download notes & slides', fileUrl: '#' },
  { _id: 'r2', title: 'Lab Manual - ECE', description: 'Practical lab instructions', fileUrl: '#' },
  { _id: 'r3', title: 'Previous Year Papers', description: 'Past papers & solutions', fileUrl: '#' },
  { _id: 'r4', title: 'Doubt Forum', description: 'Ask teacher & peers', fileUrl: '#' }
]

export default function ResourcesGrid() {
  const { data } = useMaterials({ limit: 4 })
  const fetchedMaterials = data?.pages?.[0]?.slice(0, 4) || []
  const resourcesToDisplay = fetchedMaterials.length > 0 ? fetchedMaterials : dummy

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
      id="resources"
      className="py-16"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
             <FolderOpen className="w-6 h-6 text-emerald-500" />
          </div>
          <h3 className="text-3xl font-bold text-[var(--accent)] tracking-tight">Quick Resources</h3>
        </div>
        <button className="text-sm font-semibold text-[var(--accent)] hover:text-emerald-400 transition-colors hidden sm:block">View All</button>
      </div>
      
      <motion.div 
         variants={containerVariants}
         initial="hidden"
         whileInView="visible"
         viewport={{ once: true }}
         className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {resourcesToDisplay.map((d, i) => (
          <motion.article
            key={d._id}
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
            className="group relative bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)]/30 p-6 rounded-3xl shadow-xl shadow-black/5 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-500/10 transition-colors" />
            <div className="relative z-10">
               <h4 className="font-bold text-lg text-[var(--text-primary)] group-hover:text-emerald-400 transition-colors line-clamp-1">{d.title}</h4>
               <p className="text-[var(--text-secondary)] mt-2 text-sm leading-relaxed line-clamp-2">{d.description || (d as any).desc}</p>
               <a href={d.fileUrl || '#'} target="_blank" rel="noreferrer" className="mt-6 flex items-center justify-between group/link">
                 <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] group-hover/link:text-[var(--text-primary)] transition-colors">Open Resource</span>
                 <div className="p-2 rounded-full bg-[var(--bg-primary)] border border-[var(--border-color)]/30 text-[var(--text-secondary)] group-hover/link:text-emerald-400 group-hover/link:border-emerald-500/30 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                 </div>
               </a>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </motion.section>
  )
}
