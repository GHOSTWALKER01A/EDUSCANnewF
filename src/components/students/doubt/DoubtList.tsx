
'use client'
import React, { useState } from 'react'
import { useDoubts } from '../../../hooks/useDoubt'
import DoubtCard from './DoubtCard'
import ReplyModal from './ReplyModal'
import EditDoubtModal from './EditDoubtModal'
import type { DoubtItem } from '../../../types/doubt.type'
import { toast } from 'react-toastify'

export default function DoubtList() {
  const { query: q, remove } = useDoubts()
  const [open, setOpen] = useState<DoubtItem|null>(null)
  const [editingDoubt, setEditingDoubt] = useState<DoubtItem|null>(null)
  
  if (q.isLoading) return <div className="text-[var(--text-secondary)] animate-pulse">Loading doubts...</div>
  
  const flattenedDoubts = q.data?.pages.flatMap(p => p.events) || []
  
  if (flattenedDoubts.length === 0) return <div className="text-[var(--text-secondary)] text-center py-10 font-medium">No doubts yet — ask one!</div>

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this doubt?")) {
      try {
        await remove.mutateAsync(id)
        toast.success("Doubt deleted")
      } catch (err: any) {
        toast.error("Failed to delete doubt")
      }
    }
  }

  return (
    <>
      <div className="grid gap-6">
        {flattenedDoubts.map((d: DoubtItem) => (
          <DoubtCard 
            key={d._id} 
            doubt={d} 
            onOpenReply={(d)=>setOpen(d)} 
            onDelete={handleDelete}
            onEdit={(d)=>setEditingDoubt(d)}
          />
        ))}
      </div>
      <ReplyModal open={!!open} doubt={open} onClose={() => setOpen(null)} />
      <EditDoubtModal open={!!editingDoubt} doubt={editingDoubt} onClose={() => setEditingDoubt(null)} />
    </>
  )
}
