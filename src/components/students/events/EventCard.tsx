'use client'
import React from 'react'
import type { EventItem } from '../../../types/events.types'
import { format, isValid, parseISO } from 'date-fns'
import { Calendar, MapPin, Image as ImageIcon, Video, CalendarDays } from 'lucide-react'

export default function EventCard({ ev, onOpen }: { ev: EventItem; onOpen: (e: EventItem) => void }) {
  let formattedDate = "No date"

  if (ev?.startDate) {
    const parsed = typeof ev.startDate === "string"
      ? parseISO(ev.startDate)
      : new Date(ev.startDate)

    if (isValid(parsed)) {
      formattedDate = format(parsed, 'MMM d, yyyy')
    }
  }

  // A helper function to truncate description
  const truncate = (str: string, length: number) => {
    return str.length > length ? str.substring(0, length) + '...' : str;
  }

  return (
    <article className="group relative flex flex-col h-[400px] w-full bg-[var(--card-bg)]/60 backdrop-blur-xl border border-[var(--border-color)]/30 rounded-3xl overflow-hidden shadow-xl shadow-black/5 hover:shadow-[var(--accent)]/20 hover:border-[var(--accent)]/50 transition-all duration-500">
      
      {/* 55% Height Media Section with Image Zoom Effect */}
      <div className="relative h-[55%] w-full overflow-hidden bg-[var(--bg-primary)]/80">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] to-transparent z-10 opacity-60" />

        {ev.mediaType === 'image' && ev.mediaUrl ? (
          <img 
            src={ev.mediaUrl} 
            alt={ev.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
          />
        ) : ev.mediaType === 'video' && ev.mediaUrl ? (
          <>
            <video 
              src={ev.mediaUrl} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90" 
            />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="w-14 h-14 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:bg-[var(--accent)]/80 group-hover:scale-110 transition-all duration-300">
                <div className="w-0 h-0 border-y-[8px] border-y-transparent border-l-[14px] border-l-white ml-1"></div>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] text-[var(--accent)]/50">
            <CalendarDays className="w-12 h-12 mb-3 opacity-60 group-hover:scale-110 transition-transform duration-500" />
            <span className="text-xs font-semibold tracking-widest uppercase opacity-80">Event Media</span>
          </div>
        )}
        
        {/* Category Badge overlay */}
        {ev.category && (
          <div className="absolute top-4 right-4 px-4 py-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-full z-20 shadow-lg shadow-black/20">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {ev.category}
            </span>
          </div>
        )}
      </div>

      {/* 45% Height Content Section */}
      <div className="h-[45%] flex flex-col p-5 sm:p-6 justify-between bg-gradient-to-b from-transparent to-[var(--bg-primary)]/20 relative z-20">
        <div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] line-clamp-1 mb-2 group-hover:text-[var(--accent)] transition-colors duration-300">
            {ev.title || "Untitled Event"}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
            {ev.description ? ev.description : "Join this event to learn more and connect with the community. Discover new opportunities and expand your network."}
          </p>
        </div>

        <div className="flex items-end justify-between mt-4 pt-4 border-t border-[var(--border-color)]/20">
          <div className="flex flex-col gap-2 flex-grow truncate mr-4">
            <div className="flex items-center text-xs text-[var(--text-secondary)] font-medium truncate">
              <Calendar className="w-4 h-4 mr-2 text-[var(--accent)] shrink-0" />
              <span className="truncate">{formattedDate} {ev.startTime && <span className="text-[var(--text-secondary)]/70 px-1">•</span>} {ev.startTime}</span>
            </div>
            {ev.location && (
             <div className="flex items-center text-xs text-[var(--text-secondary)] font-medium truncate">
                <MapPin className="w-4 h-4 mr-2 text-indigo-400 shrink-0" />
                <span className="truncate">{ev.location}</span>
              </div>
            )}
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onOpen(ev); }}
            className="shrink-0 px-4 py-2 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--accent)] text-[var(--text-primary)] hover:text-white text-sm font-semibold shadow-md active:scale-95 transition-all duration-300 border border-[var(--border-color)]/30 hover:border-transparent"
          >
            Details
          </button>
        </div>
      </div>
      
      {/* Hover bottom gradient glow */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--accent)] to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </article>
  )
}