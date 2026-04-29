'use client'
import React, { useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { CalendarDays, Search, Filter, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import Navbar from '@/src/components/layouts/Navbar'
import Footer from '@/src/components/layouts/Footerstu'
import { useEvents } from '@/src/hooks/useEvents'
import EventCard from '@/src/components/students/events/EventCard'
import EventDetailModal from '@/src/components/students/events/EventDetailModal'
import { EventItem } from '@/src/types/events.types'

export default function EventsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string|undefined>(undefined)
  const [selected, setSelected] = useState<EventItem|null>(null)
  const [page, setPage] = useState(1)
  const eventsQuery = useEvents(page, 9, query, category)

  const events = eventsQuery.query.data?.events ?? []
  const total = eventsQuery.query.data?.total ?? 0
  const hasMore = page * 9 < total

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] relative overflow-x-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none border-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <Navbar />
      
      <main className="max-w-7xl mx-auto p-4 sm:p-6 mt-20 md:mt-24 space-y-8 relative z-10 pb-24">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[var(--border-color)]/20 pb-6"
        >
          <div>
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-[var(--accent)]/10 rounded-2xl shadow-inner shadow-[var(--accent)]/10">
                 <CalendarDays className="w-8 h-8 text-[var(--accent)]" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] via-[var(--accent)] to-indigo-500 tracking-tight pb-1">
                Campus Events
              </h1>
            </div>
            <p className="text-[var(--text-secondary)] mt-3 flex items-center gap-2 font-medium text-lg ml-1">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Discover and participate in upcoming activities.
            </p>
          </div>
        </motion.div>

        {/* Filters Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)]/30 p-4 rounded-2xl shadow-xl shadow-black/5 flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-grow group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-[var(--accent)] transition-colors" />
            <input 
              placeholder="Search events by name or keyword..." 
              value={query} 
              onChange={(e)=> { setQuery(e.target.value); setPage(1); }} 
              className="w-full pl-12 pr-4 py-3.5 bg-[var(--bg-primary)]/50 border border-[var(--border-color)]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-transparent transition-all placeholder:text-[var(--text-secondary)]/50 text-[var(--text-primary)] font-medium" 
            />
          </div>
          
          <div className="relative md:w-64 group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-[var(--accent)] transition-colors z-10 pointer-events-none" />
            <select 
              value={category || ""} 
              onChange={(e)=>{ setCategory(e.target.value || undefined); setPage(1); }} 
              className="w-full pl-12 pr-10 py-3.5 bg-[var(--bg-primary)]/50 border border-[var(--border-color)]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-transparent transition-all text-[var(--text-primary)] font-medium appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              <option value="Academic">Academic & Learning</option>
              <option value="Cultural">Cultural & Arts</option>
              <option value="Sports">Sports & Athletics</option>
              <option value="Community">Community & Social</option>
            </select>
            {/* Custom downward arrow for select */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
              <svg className="w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[var(--accent)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </motion.div>

        {/* Events Grid */}
        {events.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {events.map((ev: any)=> (
              <motion.div key={ev._id} variants={itemVariants} className="h-full">
                <EventCard ev={ev as unknown as EventItem} onOpen={(e)=>setSelected(e)} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
             className="bg-[var(--card-bg)]/50 border border-[var(--border-color)]/20 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4"
          >
            <div className="p-4 bg-[var(--bg-primary)] rounded-full mb-2">
               <CalendarDays className="w-12 h-12 text-[var(--text-secondary)] opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">No events found</h3>
            <p className="text-[var(--text-secondary)] max-w-md">We couldn't find any events matching your search or filters. Try adjusting them to view more activities.</p>
          </motion.div>
        )}

        {/* Pagination Section */}
        {total > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-between items-center bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)]/30 px-6 py-4 rounded-2xl shadow-lg mt-8"
          >
            <button 
              disabled={page === 1} 
              onClick={() => setPage(page - 1)} 
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-color)]/50 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-[var(--text-primary)]"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>
            <div className="flex items-center gap-3">
               <span className="text-[var(--text-secondary)] font-medium">Page</span>
               <div className="w-10 h-10 flex items-center justify-center bg-[var(--accent)] text-white font-bold rounded-lg shadow-md">
                 {page}
               </div>
            </div>
            <button 
              disabled={!hasMore} 
              onClick={() => setPage(page + 1)} 
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--accent)] to-indigo-600 hover:from-indigo-600 hover:to-[var(--accent)] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-md shadow-[var(--accent)]/20"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        <EventDetailModal open={!!selected} event={selected} onClose={()=>setSelected(null)} />
      </main>

      <Footer/>
    </div>
  )
}
