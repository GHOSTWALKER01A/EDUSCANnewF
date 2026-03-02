// client/src/components/doubt/AttachmentPreview.tsx
import React from 'react'
import { Attachment } from '../../../types/doubt.type'
import { Download } from 'lucide-react'

export default function AttachmentPreview({ a }: { a: Attachment }) {
  return (
    <div className="flex items-center gap-2 bg-[var(--bg-secondary)] rounded p-2">
      <div className="text-sm font-semibold">{a.fileName}</div>
      <a href={a.url} target="_blank" rel="noreferrer" className="ml-auto px-2 py-1 rounded bg-[var(--accent)] text-[var(--bg-primary)] inline-flex items-center gap-1">
        <Download size={16} /> Open
      </a>
    </div>
  )
}
