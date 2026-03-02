
'use client'
import React from 'react'
import type { DoubtItem } from '../../../types/doubt.type'
import AttachmentPreview from './AttachmentFilePreview'
import { formatDistanceToNow } from 'date-fns'

export default function DoubtCard({ doubt, onOpenReply }: { doubt: DoubtItem, onOpenReply: (d:DoubtItem)=>void }) {
  return (
    <div className="bg-[var(--bg-secondary)] p-4 rounded-lg shadow">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[var(--accent)]">{doubt.subject}</h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{doubt.description}</p>
          <div className="mt-3 space-y-2">
            {doubt.attachments?.map(a => 
            <AttachmentPreview key={a.url} a={a} />
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full ${doubt.status === 'open' ? 'bg-yellow-100 text-yellow-800' : doubt.status === 'answered' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{doubt.status}</span>
          <small className="text-[var(--text-secondary)]">{formatDistanceToNow(new Date(doubt.createdAt || ''), { addSuffix: true })}</small>
          <button onClick={() => onOpenReply(doubt)} className="mt-2 px-3 py-1 rounded bg-[var(--accent)] text-[var(--bg-primary)]">Open</button>
        </div>
      </div>
    </div>
  )
}
