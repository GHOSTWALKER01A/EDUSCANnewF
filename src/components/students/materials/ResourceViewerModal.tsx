'use client'

if (typeof window === 'undefined') {
  (global as any).Promise.withResolvers = function () {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
  if (!(global as any).DOMMatrix) {
    (global as any).DOMMatrix = class {};
  }
}

import React, { useEffect, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Resource } from '../../../types/resource.type'


if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
}
export default function ResourceViewerModal({
  open,
  resource,
  onClose,
}: {
  open: boolean;
  resource: Resource | null;
  onClose: () => void;
}) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (open) closeBtnRef.current?.focus();
  }, [open]);

  if (!open || !resource) return null;

  const mime = resource.fileType || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-[var(--card-bg)] rounded-lg w-full max-w-5xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-[var(--accent)]">{resource.title}</h3>
          <div className="flex items-center gap-2">
            <a href={resource.fileUrl} target="_blank" rel="noreferrer" className="px-3 py-1 rounded bg-[var(--bg-secondary)]">Open in new tab</a>
            <button ref={closeBtnRef} onClick={onClose} className="px-3 py-1 rounded bg-[var(--accent)] text-[var(--bg-primary)]">Close</button>
          </div>
        </div>

        <div className="p-4 flex flex-col items-center gap-4">
          {mime.includes('pdf') && resource.fileUrl && (
            <div className="w-full">
              <Document file={resource.fileUrl}>
                <Page pageNumber={1} width={900} />
              </Document>
            </div>
          )}

          {mime.startsWith('image/') && resource.fileUrl && (
            <img src={resource.fileUrl} alt={resource.title} className="max-w-full h-auto rounded" />
          )}

          {mime.startsWith('video/') && resource.fileUrl && (
            <video controls src={resource.fileUrl} className="w-full max-h-[70vh]" />
          )}

          {!mime && resource.fileUrl && (
            <a href={resource.fileUrl} className="underline">Open resource</a>
          )}
        </div>
      </div>
    </div>
  )
}
