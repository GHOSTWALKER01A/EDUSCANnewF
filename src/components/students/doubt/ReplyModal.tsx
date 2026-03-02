// client/src/components/doubt/ReplyModal.tsx
'use client'
import React, { useState } from 'react'
import type { DoubtItem } from '../../../types/doubt.type'
import { useDoubts } from '../../../hooks/useDoubt'
import {useDropzone} from 'react-dropzone'
import AttachmentPreview from './AttachmentFilePreview'
import { toast } from 'react-toastify'

export default function ReplyModal({ open, doubt, onClose }: { open: boolean; doubt?: DoubtItem|null; onClose: ()=>void }) {
  const [message, setMessage] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const { createReply: reply } = useDoubts()

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (accepted:File[])=> setFiles(prev=>[...prev,...accepted]),
    accept: { 'image/*': [], 'application/pdf': [] },
    maxSize: 30*1024*1024
  })

  if (!open || !doubt) return null

  const submit = async () => {
    if (!message.trim() && files.length === 0) { toast.error('Enter message or attach file'); return }
    const fd = new FormData()
    fd.append('message', message)
    files.forEach(f => fd.append('attachments', f))
    try {
      await reply.mutateAsync({ id: doubt._id, formData: fd })
      toast.success('Reply sent')
      setMessage(''); setFiles([])
      onClose()
    } catch (err:any) {
      toast.error(err.response?.data?.message || 'Failed')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-[var(--card-bg)] w-full max-w-2xl rounded p-4 max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-bold text-[var(--accent)]">Doubt — {doubt.subject}</h3>
          <button onClick={onClose} className="px-3 py-1 rounded bg-[var(--accent)] text-[var(--bg-primary)]">Close</button>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold">Student message</h4>
          <p className="text-[var(--text-secondary)]">{doubt.description}</p>
          <div className="mt-2 space-y-2">
            {doubt.attachments?.map(a => <AttachmentPreview key={a.url} a={a} />)}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold">Thread</h4>
          <div className="space-y-3">
            {doubt.replies?.map(r => (
              <div key={r._id} className="p-3 bg-[var(--bg-secondary)] rounded">
                <div className="flex justify-between"><div className="font-semibold">{r.by.name}</div><small className="text-[var(--text-secondary)]">{new Date(r.createdAt||'').toLocaleString()}</small></div>
                <p className="mt-2">{r.message}</p>
                <div className="mt-2">{r.attachments?.map(a => <AttachmentPreview key={a.url} a={a} />)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* reply area (teacher only) - we render it for any authenticated user but backend will enforce role */}
        <div className="mb-4">
          <textarea value={message} onChange={e=>setMessage(e.target.value)} rows={4} placeholder="Write your reply..." className="w-full p-2 rounded border"></textarea>
          <div {...getRootProps()} className="mt-2 p-3 border-dashed text-center cursor-pointer">
            <input {...getInputProps()} />
            <p>Drag files here or click to attach (pdf/image)</p>
          </div>
          <div className="mt-2 flex gap-2 flex-wrap">
            {files.map((f,i)=>(<div key={i} className="p-2 bg-[var(--bg-secondary)] rounded">{f.name} <button className="ml-1 text-red-500" onClick={()=>setFiles(prev=>prev.filter((_,j)=>j!==i))}>x</button></div>))}
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={submit} className="px-4 py-2 rounded bg-[var(--accent)] text-[var(--bg-primary)]">Send Reply</button>
          </div>
        </div>
      </div>
    </div>
  )
}
