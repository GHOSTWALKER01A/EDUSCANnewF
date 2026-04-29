// src/components/materials/AcademicMaterials.tsx
'use client'
import React, { useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { Search, BookOpen } from 'lucide-react'
import ResourceCard from './ResourceCard'
import ResourceViewerModal from './ResourceViewerModal'
import { useMaterials } from '../../../hooks/useMaterials'
import { Resource } from '../../../types/resource.type'

export default function AcademicMaterials() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Resource | null>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useMaterials({ type: 'Academic Material', search, limit: 12 })

  const resources = data?.pages?.flat() ?? []

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  }

  return (
    <motion.section 
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.5, delay: 0.2 }}
       className="bg-[var(--card-bg)]/60 backdrop-blur-xl border border-[var(--border-color)]/30 rounded-3xl p-6 sm:p-8 shadow-xl shadow-black/5"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20">
            <BookOpen className="w-6 h-6 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--accent)]">Academic Materials</h2>
        </div>
        
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-[var(--accent)] transition-colors" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search academic materials..."
            className="w-full pl-12 pr-4 py-3 bg-[var(--bg-primary)]/50 border border-[var(--border-color)]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-transparent transition-all placeholder:text-[var(--text-secondary)]/50 text-[var(--text-primary)] font-medium"
            aria-label="Search academic materials"
          />
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {resources.map((r: Resource) => (
          <motion.div key={r._id} variants={itemVariants} className="h-full">
            <ResourceCard resource={r} onOpen={(res)=> setSelected(res)} />
          </motion.div>
        ))}
      </motion.div>

      {resources.length === 0 && status !== 'pending' && (
         <div className="text-center py-12 text-[var(--text-secondary)]">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No academic materials found</p>
         </div>
      )}

      <div className="mt-8 flex justify-center">
        {hasNextPage ? (
          <button 
             onClick={() => fetchNextPage()} 
             disabled={isFetchingNextPage} 
             className="px-6 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]/50 text-[var(--text-primary)] font-medium shadow-sm hover:bg-blue-600 hover:text-white hover:border-transparent transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isFetchingNextPage ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : 'Load more materials'}
          </button>
        ) : resources.length > 0 ? (
          <div className="text-sm font-medium text-[var(--text-secondary)] px-4 py-2 bg-[var(--bg-primary)] rounded-full border border-[var(--border-color)]/30">
            You've reached the end of the materials
          </div>
        ) : null}
      </div>

      <ResourceViewerModal open={!!selected} resource={selected} onClose={() => setSelected(null)} />
    </motion.section>
  )
}
