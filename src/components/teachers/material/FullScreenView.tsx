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
    <Modal open={open} onClose={onClose} title={material?.title}>
      <div className="flex flex-col gap-3 ">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-[var(--text-secondary)]">
            {material?.category} • {material?.createdAt ? new Date(material.createdAt).toLocaleString() : ''}
          </div>

          <div className="flex items-center gap-2">
            {fileUrl && (
              <>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="px-3 py-1 rounded-md bg-[var(--bg-secondary)] hover:bg-[rgba(255,255,255,0.03)] text-sm"
                  aria-label="Open in new tab"
                >
                  Open
                </a>
                {/* <a
                  href={fileUrl}
                  download
                  className="px-3 py-1 rounded-md bg-[var(--accent)] text-white text-sm"
                  aria-label="Download file"
                >
                  Download
                </a> */}
              </>
            )}

            <button
              onClick={toggleFullscreen}
              className="px-3 py-1 rounded-md border border-[rgba(255,255,255,0.04)] text-sm"
              aria-label="Toggle fullscreen"
            >
              ⤢
            </button>

            <button onClick={onClose} aria-label="Close preview" className="px-3 py-1 rounded-md text-sm">
              ✕
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative bg-black/80 rounded-md w-full h-[75vh] flex items-center justify-center overflow-hidden"
        >
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div className="inline-block animate-spin rounded-full border-4 border-t-4 border-[rgba(255,255,255,0.1)] border-t-[var(--accent)] w-12 h-12" />
            </div>
          )}

          {/* IMAGE */}
          {previewType === 'image' && fileUrl && (
            <div className="w-full h-full p-6">
              <TransformWrapper initialScale={1} wheel={{ step: 50 }}>
                <TransformComponent>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fileUrl}
                    alt={material?.title || 'Image preview'}
                    onLoad={onMediaLoaded}
                    className="max-w-full max-h-full mx-auto block rounded-md object-contain"
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
              className="w-full h-full object-contain"
              onLoadedData={onMediaLoaded}
            />
          )}

          {/* AUDIO */}
          {previewType === 'audio' && fileUrl && (
            <div className="w-full px-6">
              <audio controls src={fileUrl} onLoadedData={onMediaLoaded} className="w-full" />
            </div>
          )}

          {/* PDF */}
          {previewType === 'pdf' && fileUrl && (
            // iframe is typical; object tag also possible
            <iframe
              src={fileUrl}
              onLoad={onIframeLoad}
              title={material?.title || 'PDF preview'}
              className="w-full h-full border-none"
            />
          )}

          {/* OFFICE DOCS (try Google viewer) */}
          {previewType === 'office' && fileUrl && (
            <iframe
              src={googleViewerUrl}
              onLoad={onIframeLoad}
              title={material?.title || 'Document preview'}
              className="w-full h-full border-none"
            />
          )}

          {/* OTHER: try Google viewer (if url) else offer open/download */}
          {previewType === 'other' && (
            <>
              {fileUrl ? (
                <iframe src={googleViewerUrl} onLoad={onIframeLoad} title="Preview" className="w-full h-full border-none" />
              ) : (
                <div className="p-6 text-center">
                  <p className="mb-3 text-[var(--text-secondary)]">No preview available for this file type.</p>
                  {material?.filePreview ? (
                    <a
                      href={material.filePreview}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="px-3 py-1 rounded-md bg-[var(--accent)] text-white inline-block"
                    >
                      Open Preview
                    </a>
                  ) : (
                    <p className="text-sm">Please download the file to view it.</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
