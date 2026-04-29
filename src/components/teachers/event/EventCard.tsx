
"use client"
import React from "react";
import { TeacherEvent } from "../../../types/events.types";
import { motion, Variants } from "framer-motion";
import { Calendar, MapPin, Edit, Trash2, Maximize2, Image as ImageIcon, Video } from "lucide-react";

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function EventCard({
  event,
  onEdit,
  onDelete,
  onOpenFull
}: {
  event: TeacherEvent;
  onEdit: (e: TeacherEvent) => void;
  onDelete: (id: string) => void;
  onOpenFull: (e: TeacherEvent) => void;
}) {
  const isImage = event.mediaType === "image" && event.mediaUrl;
  const isVideo = event.mediaType === "video" && event.mediaUrl;

  return (
    <motion.article 
      variants={itemVariants}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative bg-[var(--card-bg)]/40 backdrop-blur-xl border border-[var(--border-color)]/30 rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] hover:border-[var(--accent)]/30 transition-all duration-300 flex flex-col"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300 pointer-events-none" />
      
      {/* Top section: Media + Core details */}
      <div className="flex gap-4">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] border border-[var(--border-color)]/20 shadow-inner flex shrink-0 items-center justify-center relative group-hover:shadow-[var(--accent)]/20 transition-all">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={event.mediaUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : isVideo ? (
            <div className="relative w-full h-full">
               <video src={event.mediaUrl} className="w-full h-full object-cover" />
               <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Video className="w-8 h-8 text-white/80" />
               </div>
            </div>
          ) : (
             <div className="flex flex-col items-center gap-1 text-[var(--text-secondary)]/50">
               <ImageIcon className="w-6 h-6" />
               <span className="text-[10px] uppercase font-bold tracking-wider">No Media</span>
             </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-start justify-between gap-2">
             <h4 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate">{event.title}</h4>
          </div>
          <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mt-1.5 leading-relaxed">{event.description}</p>
        </div>
      </div>

      {/* Meta tags */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
         <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 text-xs font-semibold shadow-[0_0_10px_rgba(99,102,241,0.1)]">
           {event.category || "General"}
         </span>
         <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-medium">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(event.startDate || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
         </span>
         {event.location && (
           <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-medium truncate max-w-[120px]">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate">{event.location}</span>
           </span>
         )}
      </div>

      {/* Action Bar */}
      <div className="mt-5 pt-4 border-t border-[var(--border-color)]/20 flex items-center justify-end gap-2">
        <button 
          onClick={() => onOpenFull(event)} 
          className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded-xl transition-colors tooltip-trigger" 
          title="View Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onEdit(event)} 
          className="p-2 text-[var(--text-secondary)] hover:text-indigo-400 hover:bg-indigo-400/10 rounded-xl transition-colors tooltip-trigger"
          title="Edit Event"
        >
          <Edit className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-[var(--border-color)]/30 mx-1" />
        <button 
          onClick={() => onDelete(event._id)} 
          className="p-2 text-[var(--text-secondary)] hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-colors tooltip-trigger"
          title="Delete Event"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.article>
  );
}
