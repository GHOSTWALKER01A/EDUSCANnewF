'use client'
import React, { useState } from 'react'
import Navbar from '@/src/components/layouts/Navbar'
import Footer from '@/src/components/layouts/Footerstu'
import { useEvents } from '@/src/hooks/useEvents'
import EventCard from '@/src/components/students/events/EventCard'
import EventDetailModal from '@/src/components/students/events/EventDetailModal'
// import EventCreateForm from '@/src/components/events/EventCreateForm'
import { EventItem } from '@/src/types/events.types'

export default function EventsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string|undefined>(undefined)
  const [selected, setSelected] = useState<EventItem|null>(null)
  const [page, setPage] = useState(1)
  const eventsQuery = useEvents(page, 9, query)

  const events = eventsQuery.query.data?.events ?? []
  const total = eventsQuery.query.data?.total ?? 0
  const hasMore = page * 9 < total

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto mt-16 px-4 py-8">
        <h1 className="text-3xl font-bold text-[var(--accent)] mb-4">Events</h1>

        <div className="mb-6 flex gap-3">
          <input placeholder="Search..." value={query} onChange={(e)=> { setQuery(e.target.value); setPage(1); }} className="p-2 border rounded w-full max-w-md" />
          <select value={category} onChange={(e)=>{ setCategory(e.target.value || undefined); setPage(1); }} className="p-2 border rounded">
            <option value="">All</option>
            <option>Academic</option>
            <option>Cultural</option>
            <option>Sports</option>
            <option>Community</option>
          </select>
        </div>

        {/* teacher/admin form can be hidden based on role */}
        {/* <div className="mb-6"> */}
        

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev: any)=> <EventCard key={ev._id} ev={ev as unknown as EventItem} onOpen={(e)=>setSelected(e)} />)}
        </div>

        <div className="mt-6 flex justify-between items-center w-full">
          <button 
            disabled={page === 1} 
            onClick={() => setPage(page - 1)} 
            className="px-4 py-2 bg-[var(--bg-secondary)] border rounded disabled:opacity-50">
            Previous
          </button>
          <span>Page {page}</span>
          <button 
            disabled={!hasMore} 
            onClick={() => setPage(page + 1)} 
            className="px-4 py-2 bg-[var(--accent)] text-[var(--bg-primary)] rounded disabled:opacity-50">
            Next
          </button>
        </div>

        <EventDetailModal open={!!selected} event={selected} onClose={()=>setSelected(null)} />
      </main>
      <Footer/>
    </>
  )
}
