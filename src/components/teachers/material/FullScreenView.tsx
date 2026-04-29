"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ModalMaterial from '../../UI/ModalMaterial';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Material } from '../../../types/material';
import Modal from '../../UI/Modal';

type Props = {
  open: boolean;
  material: Material | null;
  onClose: () => void;
};

function isImage(type?: string) {
  return !!type && type.startsWith('image/');
}
function isVideo(type?: string) {
  return !!type && type.startsWith('video/');
}
function isAudio(type?: string) {
  return !!type && type.startsWith('audio/');
}
function isPdf(type?: string) {
  return type === 'application/pdf';
}
function isOffice(type?: string) {
  if (!type) return false;
  return (
    type === 'application/msword' ||
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    type === 'application/vnd.ms-excel' ||
    type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    type === 'application/vnd.ms-powerpoint' ||
    type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  );
}

export default function FullscreenViewer({ open, material, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLoading(true);
  }, [material?.fileUrl, material?.filePreview, open]);

  useEffect(() => {
    if (!open) return;
    function esc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open, onClose]);

  const fileUrl = material?.fileUrl || material?.filePreview || '';
  const fileType = material?.fileType || '';

  const previewType = useMemo(() => {
    if (isImage(fileType)) return 'image';
    if (isVideo(fileType)) return 'video';
    if (isAudio(fileType)) return 'audio';
    if (isPdf(fileType)) return 'pdf';
    if (isOffice(fileType)) return 'office';
    // unknown => try iframe/web preview
    return 'other';
  }, [fileType]);

  // Google docs viewer for office docs or other document types (works only for public URLs)
  const googleViewerUrl = useMemo(() => {
    if (!fileUrl) return '';
    // docs.google.com/gview requires a public accessible URL
    return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(fileUrl)}`;
  }, [fileUrl]);

  // Fullscreen toggle
  const toggleFullscreen = async () => {
    const el = containerRef.current;
    if (!el) return;
    // @ts-ignore
    if (!document.fullscreenElement) {
      try {
        await el.requestFullscreen?.();
      } catch (e) {
        // ignore
      }
    } else {
      try {
        await document.exitFullscreen?.();
      } catch (e) {}
    }
  };

  const onIframeLoad = () => {
    setLoading(false);
  };

  const onMediaLoaded = () => setLoading(false);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full max-w-6xl mx-auto bg-[var(--bg-primary)]/90 backdrop-blur-3xl rounded-3xl overflow-hidden shadow-2xl border border-[var(--border-color)]/30 max-h-[90vh] flex flex-col relative z-50">
        
        {/* Header Row */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]/20 bg-black/20 shrink-0">
          <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--accent)] truncate pr-4">
            {material?.title || "Material Document"}
          </h2>
          <div className="flex items-center gap-2">
             <button
               onClick={toggleFullscreen}
               title="Toggle Fullscreen"
               className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0 border border-white/5"
             >
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
             </button>
             <button
               aria-label="Close viewer"
               onClick={onClose}
               className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-[var(--text-primary)] hover:text-rose-400 transition-colors shrink-0"
             >
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
        </div>

        {/* Main grid: details (left) + media (right) */}
        <div ref={containerRef} className="flex-1 overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row bg-black/40">
          
          {/* LEFT: details pane */}
          <aside className="lg:w-[400px] shrink-0 bg-black/40 border-r border-[var(--border-color)]/10 p-6 lg:overflow-y-auto custom-scrollbar flex flex-col gap-6 relative z-10 backdrop-blur-md">
             <div className="space-y-4">
               <div>
                  <h3 className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold mb-1">Category</h3>
                  <div className="inline-flex items-center px-3 py-1 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 text-sm font-semibold">
                    {material?.category || "General"}
                  </div>
               </div>

               <div className="bg-[var(--bg-secondary)]/40 p-4 rounded-xl border border-[var(--border-color)]/10">
                 <h3 className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold mb-1">Uploaded</h3>
                 <div className="text-sm font-medium text-[var(--text-primary)]">
                    {material?.createdAt ? new Date(material.createdAt).toLocaleString('en-US', { hour12: false, year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Unknown'}
                 </div>
               </div>

               {material?.description && (
                 <div>
                   <h3 className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold mb-2">Description</h3>
                   <div className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap bg-[var(--bg-primary)]/30 p-4 rounded-xl border border-[var(--border-color)]/5">
                     {material.description}
                   </div>
                 </div>
               )}
             </div>

             <div className="mt-auto pt-6 space-y-3">
                {fileUrl && (
                  <a href={fileUrl} target="_blank" rel="noreferrer noopener" className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[var(--accent)] to-indigo-600 hover:from-indigo-500 hover:to-[var(--accent)] text-white font-medium shadow-lg shadow-[var(--accent)]/20 transition-all active:scale-[0.98]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    Open Original File
                  </a>
                )}
             </div>
          </aside>

          {/* RIGHT: media pane */}
          <div className="flex-1 min-h-[400px] lg:min-h-0 relative flex items-center justify-center p-2 sm:p-6 bg-[#030816]">
            {loading && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#030816]/50 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3 text-[var(--accent)]">
                   <div className="w-10 h-10 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
                   <span className="text-sm font-medium">Loading Document...</span>
                </div>
              </div>
            )}

            {/* IMAGE */}
            {previewType === 'image' && fileUrl && (
              <div className="w-full h-full p-2">
                <TransformWrapper initialScale={1} wheel={{ step: 50 }}>
                  <TransformComponent wrapperClass="!w-full !h-full flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fileUrl}
                      alt={material?.title || 'Image preview'}
                      onLoad={onMediaLoaded}
                      className="max-w-full max-h-[80vh] mx-auto block rounded-xl shadow-2xl ring-1 ring-white/10 object-contain"
                    />
                  </TransformComponent>
                </TransformWrapper>
              </div>
            )}

            {/* VIDEO */}
            {previewType === 'video' && fileUrl && (
              <video
                controls
                src={fileUrl}
                className="max-w-full max-h-[80vh] rounded-xl shadow-2xl ring-1 ring-white/10"
                onLoadedData={onMediaLoaded}
              />
            )}

            {/* AUDIO */}
            {previewType === 'audio' && fileUrl && (
              <div className="w-full max-w-md p-6 bg-[var(--card-bg)]/80 backdrop-blur-xl rounded-2xl border border-[var(--border-color)]/20 shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mb-6 mx-auto">
                   <svg className="w-8 h-8 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                </div>
                <audio controls src={fileUrl} onLoadedData={onMediaLoaded} className="w-full custom-audio-player" />
              </div>
            )}

            {/* PDF */}
            {previewType === 'pdf' && fileUrl && (
              <iframe
                src={fileUrl}
                onLoad={onIframeLoad}
                title={material?.title || 'PDF preview'}
                className="w-full h-full rounded-xl shadow-2xl ring-1 ring-white/10 bg-white"
              />
            )}

            {/* OFFICE DOCS */}
            {previewType === 'office' && fileUrl && (
              <iframe
                src={googleViewerUrl}
                onLoad={onIframeLoad}
                title={material?.title || 'Document preview'}
                className="w-full h-full rounded-xl shadow-2xl ring-1 ring-white/10 bg-white"
              />
            )}

            {/* OTHER / FALLBACK */}
            {previewType === 'other' && (
              <>
                {fileUrl ? (
                  <iframe src={googleViewerUrl} onLoad={onIframeLoad} title="Preview" className="w-full h-full rounded-xl shadow-2xl ring-1 ring-white/10 bg-white" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center max-w-sm p-8 bg-[var(--card-bg)]/40 backdrop-blur-xl rounded-2xl border border-[var(--border-color)]/20">
                    <div className="w-20 h-20 bg-[var(--bg-secondary)]/50 rounded-full flex items-center justify-center mb-4 ring-1 ring-white/5 shadow-inner">
                       <svg className="w-8 h-8 text-[var(--text-secondary)]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No Visual Preview</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-6">There is no preview available for this specific file type.</p>
                    {material?.filePreview && (
                      <a href={material.filePreview} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors ring-1 ring-white/10">
                        Download File
                      </a>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </Modal>
  );
}
