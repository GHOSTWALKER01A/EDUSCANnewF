'use client'
import React from 'react'
import type { EventItem } from '../../../types/events.types'
import { format, isValid, parseISO } from 'date-fns'
import { Calendar, MapPin } from 'lucide-react'

export default function EventCard({ ev, onOpen }: { ev: EventItem; onOpen: (e: EventItem) => void }) {
  let formattedDate = "No date"

  if (ev?.date) {
    const parsed = typeof ev.date === "string"
      ? parseISO(ev.date)
      : new Date(ev.date)

    if (isValid(parsed)) {
      formattedDate = format(parsed, 'MMM d, yyyy')
    }
  }

  // A helper function to truncate description
  const truncate = (str: string, length: number) => {
    return str.length > length ? str.substring(0, length) + '...' : str;
  }

  return (
    <article className="group relative flex flex-col h-[400px] w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(0,190,255,0.2)] transition-all duration-300">
      
      {/* 60% Height Media Section */}
      <div className="relative h-[60%] w-full overflow-hidden bg-black/40">
        {ev.media?.type === 'image' && ev.media?.url ? (
          <img 
            src={ev.media.url} 
            alt={ev.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
        ) : ev.media?.type === 'video' && ev.media?.thumbnailUrl ? (
          <>
            <img 
              src={ev.media.thumbnailUrl} 
              alt={ev.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80" 
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                <div className="w-0 h-0 border-y-[8px] border-y-transparent border-l-[14px] border-l-white ml-1"></div>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900/40 to-black/40 text-blue-300/50">
            <Calendar className="w-10 h-10 mb-2 opacity-50" />
            <span className="text-sm font-medium tracking-wider uppercase">No Media</span>
          </div>
        )}
        
        {/* Category Badge overlay on image */}
        {ev.category && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full">
            <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
              {ev.category}
            </span>
          </div>
        )}
      </div>

      {/* 40% Height Content Section */}
      <div className="h-[40%] flex flex-col p-4 justify-between bg-gradient-to-b from-transparent to-black/40">
        <div>
          <h3 className="text-lg font-bold text-white line-clamp-1 mb-1 group-hover:text-blue-400 transition-colors">
            {ev.title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
            {ev.description ? ev.description : "Join this event to learn more and connect with the community."}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
          <div className="flex flex-col gap-1 items-start">
            <div className="flex justify-center items-center text-xs text-gray-300 break-words line-clamp-1">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
              {formattedDate} {ev.time && `• ${ev.time}`}
            </div>
            {ev.location && (
             <div className="flex justify-center items-center text-xs text-gray-300 break-words line-clamp-1">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                {ev.location}
              </div>
            )}
          </div>
          <button 
            onClick={() => onOpen(ev)}
            className="shrink-0 ml-2 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all active:scale-95"
          >
            Details
          </button>
        </div>
      </div>
    </article>
  )
}