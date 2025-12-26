// src/components/student/FullScreenViewer.tsx
'use client'
import { useEffect } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { motion } from 'framer-motion'
import clsx from 'clsx'

type ViewerItem = {
  filePreview?: string
  fileType?: string
  subject?: string
  description?: string
  fileName?: string
  fileUrl?: string // optional final file url on server
}

export default function FullScreenViewer({
  open,
  item,
  onClose,
}: {
  open: boolean
  item: ViewerItem | null
  onClose: () => void
}) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !item) return null

  const { filePreview, fileType, subject, description, fileName, fileUrl } = item

  const isImage = fileType?.startsWith('image/')
  const isPdf = fileType === 'application/pdf'

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 p-6">
      <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full h-full max-w-[1200px] max-h-[90vh] rounded-lg bg-[var(--bg-primary)] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-semibold text-[var(--fancy-accent,white)]">{subject || fileName || 'Preview'}</h3>
            {description && <p className="text-sm text-[var(--text-secondary)]">{description}</p>}
          </div>

          <div className="flex items-center gap-2">
            {filePreview && (
              <a
                href={fileUrl ?? filePreview}
                download={fileName ?? undefined}
                className="text-sm bg-[var(--card-bg)] px-3 py-1 rounded hover:bg-white/10"
                aria-label="Download file"
              >
                Download
              </a>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700"
              aria-label="Close viewer"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="w-full h-[calc(100%-72px)] bg-black flex items-center justify-center">
          <div className="w-full h-full flex items-center justify-center p-4">
            {isImage && filePreview && (
              <TransformWrapper initialScale={1} wheel={{ step: 0.1 }}>
                <TransformComponent>
                  <img src={filePreview} alt={fileName || subject} className="mx-auto max-w-full max-h-[80vh] object-contain rounded" />
                </TransformComponent>
              </TransformWrapper>
            )}

            {isPdf && filePreview && (
              <iframe
                src={filePreview}
                title={fileName || subject}
                className="w-full h-full border-none"
                aria-label="PDF preview"
              />
            )}

            {!filePreview && (
              <div className="text-center text-white/80">
                <p>No preview available</p>
                {fileUrl && <a href={fileUrl} className="underline">Open file</a>}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
