
'use client'
import React from 'react'
import { Resource } from '../../../types/resource.type'
import { format, isValid } from 'date-fns'
import { FileText, User, Calendar, Download, Eye } from 'lucide-react'

export default function ResourceCard({ resource, onOpen }: { resource: Resource; onOpen: (r: Resource) => void }) {
  const dateObj = resource.createdAt ? new Date(resource.createdAt) : new Date();
  return (
    <article className="group relative flex flex-col h-full bg-[var(--card-bg)]/60 backdrop-blur-xl border border-[var(--border-color)]/30 rounded-2xl p-5 shadow-lg shadow-black/5 hover:shadow-[var(--accent)]/10 hover:border-[var(--accent)]/40 hover:-translate-y-1 transition-all duration-300">
      
      {/* Type badge */}
      <div className="absolute top-4 right-4 bg-[var(--bg-primary)] px-3 py-1 rounded-full border border-[var(--border-color)]/30 shadow-sm z-10">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Resource</span>
      </div>

      <div className="flex-grow">
        <div className="w-12 h-12 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] border border-[var(--border-color)]/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-[var(--accent)]/20 transition-all duration-300">
            <FileText className="w-6 h-6 text-[var(--accent)]" />
        </div>

        <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2 line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
          {resource.title}
        </h4>
        <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-3 leading-relaxed">
          {resource.description || 'No description provided for this resource.'}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--border-color)]/20 space-y-2">
        <div className="flex items-center text-xs text-[var(--text-secondary)] font-medium">
          <User className="w-4 h-4 mr-2 text-[var(--accent)] opacity-70" />
          <span className="truncate">By {resource.uploadedBy?.fullname || 'Unknown Educator'}</span>
        </div>
        <div className="flex items-center text-xs text-[var(--text-secondary)] font-medium">
          <Calendar className="w-4 h-4 mr-2 text-indigo-400 opacity-70" />
          <span>{isValid(dateObj) ? format(dateObj, 'PPP') : 'Unknown Date'}</span>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button 
           onClick={() => onOpen(resource)} 
           className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--accent)] text-[var(--text-primary)] hover:text-white text-sm font-semibold transition-all duration-300 border border-[var(--border-color)]/30 hover:border-transparent active:scale-95 shadow-sm"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
        <a 
           href={resource.fileUrl} 
           target="_blank" 
           rel="noreferrer" 
           className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-gradient-to-r hover:from-[var(--accent)] hover:to-indigo-600 text-[var(--text-secondary)] hover:text-white border border-[var(--border-color)]/30 hover:border-transparent transition-all duration-300 shadow-sm active:scale-95"
           title="Download Resource"
        >
          <Download className="w-4 h-4" />
        </a>
      </div>

      {/* Decorative gradient line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--accent)] to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl" />
    </article>
  )
}
