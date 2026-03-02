// client/src/components/doubt/DoubtList.tsx
'use client'
import React, { useState } from 'react'
import { useDoubts } from '../../../hooks/useDoubt'
import DoubtCard from './DoubtCard'
import ReplyModal from './ReplyModal'
import type { DoubtItem } from '../../../types/doubt.type'

export default function DoubtList() {
  const { query: q } = useDoubts()
  const [open, setOpen] = useState<DoubtItem|null>(null)
  if (q.isLoading) return <div>Loading...</div>
  
  const flattenedDoubts = q.data?.pages.flatMap(p => p.events) || []
  
  if (flattenedDoubts.length === 0) return <div>No doubts yet — ask one!</div>

  return (
    <>
      <div className="grid gap-4">
        {flattenedDoubts.map((d: DoubtItem) => <DoubtCard key={d._id} doubt={d} onOpenReply={(d)=>setOpen(d)} />)}
      </div>
      <ReplyModal open={!!open} doubt={open} onClose={() => setOpen(null)} />
    </>
  )
}
