// components/teacher/events/EventCard.tsx
"use client"
import React from "react";
import { TeacherEvent } from "../../../types/events.types";
import { motion } from "framer-motion";

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
  return (
    <motion.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-[#071133] to-[#081b3a] p-4 rounded-2xl shadow-lg">
      <div className="flex gap-3">
        <div className="w-28 h-20 rounded-lg overflow-hidden bg-[rgba(255,255,255,0.02)] flex items-center justify-center">
          {event.mediaType === "image" && event.mediaUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={event.mediaUrl} alt={event.title} className="w-full h-full object-cover" />
          ) : event.mediaType === "video" && event.mediaUrl ? (
            <video src={event.mediaUrl} className="w-full h-full object-cover" />
          ) : (
            <div className="text-[var(--text-secondary)]">No media</div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-semibold text-[var(--accent)] truncate">{event.title}</h4>
          <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mt-1">{event.description}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs px-2 py-1 rounded bg-[rgba(255,255,255,0.03)] text-[var(--text-secondary)]">{event.category || "General"}</span>
            <span className="ml-auto text-xs text-[var(--text-secondary)]">{new Date(event.createdAt || Date.now()).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button onClick={() => onOpenFull(event)} className="px-3 py-1 rounded bg-[var(--accent)] text-white">Open</button>
        <button onClick={() => onEdit(event)} className="px-3 py-1 rounded border border-[rgba(255,255,255,0.06)]">Edit</button>
        <button onClick={() => onDelete(event._id)} className="ml-auto px-3 py-1 rounded bg-red-600 text-white">Delete</button>
      </div>
    </motion.article>
  );
}
