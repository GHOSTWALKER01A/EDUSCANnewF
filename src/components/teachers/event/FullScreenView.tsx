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
    <ModalEvent open={open} onClose={onClose}  >
      <div className="w-full max-w-6xl mx-auto bg-black">
        {/* Title row: centered title + close button */}
        <div className="relative mb-6">
          <h2 className="text-center text-2xl md:text-3xl font-bold text-[var(--accent)] leading-tight">
            {event.title}
          </h2>

          {/* close button (top-right) */}
          <button
            aria-label="Close viewer"
            onClick={onClose}
            className="absolute top-0 right-0 -translate-y-2 translate-x-0 p-2 rounded-full bg-[rgba(0,0,0,0.35)] text-white hover:bg-[rgba(0,0,0,0.5)]"
          >
            ×
          </button>
        </div>

        {/* Main grid: left details, right media */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* LEFT: details */}
          <aside className="order-2 md:order-1">
            <div className="bg-[var(--card-bg)] rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold text-[var(--accent)] mb-3">Event details</h3>

              <dl className="grid grid-cols-1 gap-y-3">
                <div className="flex">
                  <dt className="w-36 text-sm text-[var(--text-secondary)]">Category</dt>
                  <dd className="flex-1 text-sm text-[var(--text-primary)]">{event.category || "—"}</dd>
                </div>

                <div className="flex">
                  <dt className="w-36 text-sm text-[var(--text-secondary)]">Start</dt>
                  <dd className="flex-1 text-sm text-[var(--text-primary)]">
                    {formatDate(event.startDate)} {event.startTime ? ` • ${formatTime(event.startTime)}` : ""}
                  </dd>
                </div>

                <div className="flex">
                  <dt className="w-36 text-sm text-[var(--text-secondary)]">End</dt>
                  <dd className="flex-1 text-sm text-[var(--text-primary)]">
                    {formatDate(event.endDate)} {event.endTime ? ` • ${formatTime(event.endTime)}` : ""}
                  </dd>
                </div>

                <div className="flex">
                  <dt className="w-36 text-sm text-[var(--text-secondary)]">Location</dt>
                  <dd className="flex-1 text-sm text-[var(--text-primary)]">{event.location || "—"}</dd>
                </div>

                <div>
                  <dt className="text-sm text-[var(--text-secondary)]">Description</dt>
                  <dd className="mt-2 text-sm text-[var(--text-primary)] whitespace-pre-line">{event.description || "No description provided."}</dd>
                </div>
              </dl>

              <div className="mt-6 flex gap-3">
              
                {mediaUrl && (
                  <>
                    <a
                      href={mediaUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[var(--accent)]
                       text-white text-sm hover:opacity-95"
                      aria-label="Open media in new tab"
                    >
                      Open media
                    </a>
                   
                  </>
                )}

                <button
                  onClick={onClose}
                  className="ml-auto px-3 py-2 rounded-md text-sm 
                  border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.02)]"
                >
                  Close
                </button>
              </div>
            </div>
          </aside>

        
          <div className="order-1 md:order-2">
            <div className="bg-[var(--bg-secondary)] rounded-lg p-4 flex items-center justify-center h-full min-h-[320px] shadow">
              {isImage ? (
                // optionally wrap with TransformWrapper for zoom
                // <TransformWrapper>
                //   <TransformComponent>
                //     <img src={mediaUrl} alt={event.title} className="max-w-full max-h-[60vh] object-contain rounded" />
                //   </TransformComponent>
                // </TransformWrapper>
                // simpler default:
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaUrl}
                  alt={event.title}
                  className="max-w-full max-h-[60vh] object-contain rounded shadow-inner"
                />
              ) : isVideo ? (
                <video
                  src={mediaUrl}
                  controls
                  className="max-w-full max-h-[60vh] rounded"
                  controlsList="nodownload"
                  playsInline
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="text-center px-6">
                  <div className="text-3xl mb-3">📁</div>
                  <div className="text-[var(--text-secondary)]">No preview available for this file type</div>
                  {mediaUrl && (
                    <div className="mt-4">
                      <a href={mediaUrl} 
                      target="_blank" rel="noreferrer" className="text-sm underline">Open file</a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ModalEvent>
  );
}
