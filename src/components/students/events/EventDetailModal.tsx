'use client'
import React, { useEffect, useRef } from 'react'
import type { EventItem } from '../../../types/events.types'
import ReactPlayerOriginal from 'react-player'
const ReactPlayer = ReactPlayerOriginal as any
import { Calendar, MapPin, X, ExternalLink, Clock } from 'lucide-react'
import { format, isValid, parseISO } from 'date-fns'

export default function EventDetailModal({ open, event, onClose }: { open: boolean; event?: EventItem | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement | null>(null)
  
  useEffect(() => { 
    if(open) closeRef.current?.focus() 
  }, [open])

  if (!open || !event) return null

  let formattedDate = "No date"
  if (event?.startDate) {
    const parsed = typeof event.startDate === "string" ? parseISO(event.startDate) : new Date(event.startDate)
    if (isValid(parsed)) {
      formattedDate = format(parsed, 'MMMM d, yyyy')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-gradient-to-b from-[#0a192f]/95 to-[#020c1b]/95 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-[0_0_40px_rgba(0,190,255,0.15)] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Sticky Header with Actions */}
        <div className="absolute top-0 right-0 z-10 flex items-center gap-2 p-4">
          {event.mediaUrl && (
            <a 
              href={event.mediaUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 text-white transition-colors"
              title="Open media in new tab"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
          <button 
            ref={closeRef} 
            onClick={onClose} 
            className="p-2 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 text-white transition-colors hover:text-red-400"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          
          {/* Top Media Section */}
          <div className="w-full bg-black/40 min-h-[150px] sm:min-h-[200px] flex items-center justify-center border-b border-white/10 relative">
            {event.mediaType === 'image' && event.mediaUrl ? (
              <img 
                src={event.mediaUrl} 
                alt={event.title} 
                className="w-full max-h-[50vh] object-contain bg-black/50" 
              />
            ) : event.mediaType === 'video' && event.mediaUrl ? (
              <div className="w-full h-full max-h-[50vh] aspect-video">
                <ReactPlayer 
                  url={event.mediaUrl} 
                  controls 
                  width="100%" 
                  height="100%"
                  style={{ maxHeight: '50vh' }}
                  light={false}
                />
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-blue-300/40">
                <Calendar className="w-16 h-16 mb-4 opacity-50" />
                <span className="text-lg font-medium tracking-wider uppercase">Event Details</span>
              </div>
            )}
            
            {/* Category overlapping badge */}
            {event.category && (
              <div className="absolute bottom-4 left-6 px-4 py-1.5 bg-blue-600/90 backdrop-blur-md rounded-full border border-blue-400/30 shadow-lg">
                <span className="text-sm font-bold text-white uppercase tracking-widest">{event.category}</span>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-6 sm:p-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-300 mb-6 leading-tight">
              {event.title}
            </h2>

            <div className="flex flex-wrap gap-4 sm:gap-8 mb-8">
              <div className="flex items-center text-blue-200">
                <div className="p-2 bg-blue-500/10 rounded-lg mr-3 border border-blue-500/20">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-blue-400/70 font-semibold uppercase tracking-wider mb-0.5">Date</p>
                  <p className="text-sm sm:text-base font-medium">{formattedDate}</p>
                </div>
              </div>

              {event.startTime && (
                <div className="flex items-center text-blue-200">
                  <div className="p-2 bg-blue-500/10 rounded-lg mr-3 border border-blue-500/20">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-400/70 font-semibold uppercase tracking-wider mb-0.5">Time</p>
                    <p className="text-sm sm:text-base font-medium">{event.startTime}</p>
                  </div>
                </div>
              )}

              {event.location && (
                <div className="flex items-center text-blue-200">
                  <div className="p-2 bg-blue-500/10 rounded-lg mr-3 border border-blue-500/20">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-400/70 font-semibold uppercase tracking-wider mb-0.5">Location</p>
                    <p className="text-sm sm:text-base font-medium">{event.location}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="prose prose-invert prose-blue max-w-none">
              <h3 className="text-xl font-semibold text-blue-300 mb-4 border-b border-blue-500/20 pb-2">About this event</h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line text-base sm:text-lg">
                {event.description || "No detailed description available for this event."}
              </p>
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Basic hidden scrollbar styles for cleaner appearance */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
      `}} />
    </div>
  )
}
