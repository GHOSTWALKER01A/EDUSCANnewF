// components/teachers/event/FullscreenViewer.tsx
"use client";

import React, { useEffect, useCallback } from "react";
import ModalEvent from "../../UI/ModalEvent";
import { TeacherEvent } from "../../../types/events.types";
// import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type Props = {
  open: boolean;
  event: TeacherEvent | null;
  onClose: () => void;
};

export default function FullscreenViewer({ open, event, onClose }: Props) {
  // close on escape for extra robustness (ModalEvent may already do this)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const formatDate = useCallback((v?: string | Date) => {
    if (!v) return "—";
    try {
      const d = typeof v === "string" ? new Date(v) : v;
      return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    } catch {
      return String(v);
    }
  }, []);

  const formatTime = useCallback((v?: string) => {
    if (!v) return "—";
    try {
      const t = new Date(v);
      return t.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", hour12: true });
    } catch {
      return String(v);
    }
  }, []);

  if (!open || !event) return null;

  const mediaUrl = event.mediaUrl || "";
  const isImage = event.mediaType === "image" && mediaUrl;
  const isVideo = (event.mediaType === "video" || String(mediaUrl).match(/\.(mp4|webm|ogg)$/i)) && mediaUrl;

  return (
    <ModalEvent open={open} onClose={onClose}>
      <div className="w-full max-w-6xl mx-auto bg-[var(--bg-primary)]/90 backdrop-blur-3xl rounded-3xl overflow-hidden shadow-2xl border border-[var(--border-color)]/30 max-h-[90vh] flex flex-col relative z-50">
        
        {/* Header Row */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]/20 bg-black/20">
          <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--accent)] truncate pr-4">
            {event.title}
          </h2>
          <button
            aria-label="Close viewer"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-[var(--text-primary)] hover:text-rose-400 transition-colors shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Main grid: details (left) + media (right) */}
        <div className="flex-1 overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row">
          
          {/* LEFT: details pane */}
          <aside className="lg:w-[400px] shrink-0 bg-black/10 border-r border-[var(--border-color)]/10 p-6 lg:overflow-y-auto custom-scrollbar flex flex-col gap-6">
             <div className="space-y-4">
               <div>
                  <h3 className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold mb-1">Category</h3>
                  <div className="inline-flex items-center px-3 py-1 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 text-sm font-semibold">
                    {event.category || "General"}
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-[var(--bg-secondary)]/40 p-3 rounded-xl border border-[var(--border-color)]/10">
                   <h3 className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold mb-1">Starts</h3>
                   <div className="text-sm font-medium text-[var(--text-primary)]">{formatDate(event.startDate)}</div>
                   {event.startTime && <div className="text-xs text-[var(--text-secondary)] mt-0.5">{formatTime(event.startTime)}</div>}
                 </div>
                 <div className="bg-[var(--bg-secondary)]/40 p-3 rounded-xl border border-[var(--border-color)]/10">
                   <h3 className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold mb-1">Ends</h3>
                   <div className="text-sm font-medium text-[var(--text-primary)]">{formatDate(event.endDate)}</div>
                   {event.endTime && <div className="text-xs text-[var(--text-secondary)] mt-0.5">{formatTime(event.endTime)}</div>}
                 </div>
               </div>

               {event.location && (
                 <div>
                   <h3 className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold mb-1">Location</h3>
                   <div className="text-sm text-[var(--text-primary)] flex items-start gap-2 bg-[var(--bg-secondary)]/20 p-3 rounded-xl border border-[var(--border-color)]/10">
                      <svg className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span>{event.location}</span>
                   </div>
                 </div>
               )}

               <div>
                 <h3 className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold mb-2">Description</h3>
                 <div className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                   {event.description || "No description provided."}
                 </div>
               </div>
             </div>

             <div className="mt-auto pt-6">
                {mediaUrl && (
                  <a href={mediaUrl} target="_blank" rel="noreferrer noopener" className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[var(--accent)] to-indigo-600 hover:from-indigo-500 hover:to-[var(--accent)] text-white font-medium shadow-lg shadow-[var(--accent)]/20 transition-all active:scale-[0.98]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    View Original Media
                  </a>
                )}
             </div>
          </aside>

          {/* RIGHT: media pane */}
          <div className="flex-1 bg-black/40 min-h-[300px] lg:min-h-0 relative flex items-center justify-center p-6">
             {isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaUrl} alt={event.title} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl ring-1 ring-white/10" />
             ) : isVideo ? (
                <video src={mediaUrl} controls className="max-w-full max-h-full rounded-xl shadow-2xl ring-1 ring-white/10" controlsList="nodownload" playsInline>
                  Your browser does not support the video tag.
                </video>
             ) : (
                <div className="flex flex-col items-center justify-center text-center max-w-sm">
                  <div className="w-20 h-20 bg-[var(--bg-secondary)]/50 rounded-full flex items-center justify-center mb-4 ring-1 ring-white/5 shadow-inner">
                     <svg className="w-8 h-8 text-[var(--text-secondary)]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No Visual Media</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-6">There is no image or video preview available to display for this event.</p>
                  {mediaUrl && (
                    <a href={mediaUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors ring-1 ring-white/10">
                      Download Attached File
                    </a>
                  )}
                </div>
             )}
          </div>

        </div>
      </div>
    </ModalEvent>
  );
}
