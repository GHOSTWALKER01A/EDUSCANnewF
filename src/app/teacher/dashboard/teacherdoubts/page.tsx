"use client"

import React, { useState, useMemo } from 'react'
import { toast } from 'react-toastify'
import { useDoubts } from '../../../../hooks/useDoubt'
import DoubtList from '../../../../components/teachers/doubt/Doubtlist'
import DoubtModal from '../../../../components/teachers/doubt/DoubtModal'
import FullScreenImage from '../../../../components/teachers/doubt/FullScreenView'
import type { DoubtItem } from '../../../../types/doubt.type'
import Navbar from "../../../../components/layouts/NavbarTeacher";
import Footer from "../../../../components/layouts/Footer";



export default function DoubtPage() {
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<DoubtItem | null>(null)
  const [imgOpen, setImgOpen] = useState(false)


  const {query, createReply, remove } = useDoubts({ q })

 
  const items = useMemo(() => {
    const pages = query.data?.pages || []
    const arr: DoubtItem[] = []
    for (const p of pages) {
      const list = p.events ?? []
      arr.push(...list)
    }
    return arr
  }, [query.data])

  const handleOpen = (d: DoubtItem) => setSelected(d)

  const handleReply = async (id: string, fd: FormData) => {
    try {
      await createReply.mutateAsync({ id, formData: fd })
      toast.success('Reply sent')
      setSelected(null)
    } catch (err:any) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Reply failed')
    }
  }

  

  return (

    <>
    <Navbar/>

    <div className="p-6 max-w-6xl mt-16 mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--accent)]">Doubts</h1>
        <div className="flex items-center gap-3">
          <input value={q} onChange={(e)=> setQ(e.target.value)} placeholder="Search..." className="px-3 py-2 rounded bg-[var(--bg-primary)]" />
        </div>
      </header>

      <main>
        <DoubtList items={items} onOpen={handleOpen} />
      </main>

      <div className="mt-6 flex justify-center">
        {query.isFetchingNextPage ? (
          <button className="px-4 py-2 rounded bg-[var(--accent)] text-white">Loading...</button>
        ) : query.hasNextPage ? (
          <button onClick={() => query.fetchNextPage()} className="px-4 py-2 rounded bg-[var(--accent)] text-white">Load more</button>
        ) : (
          <div className="text-[var(--text-secondary)]">No more items</div>
        )}
      </div>

      <footer className="mt-6 text-sm text-[var(--text-secondary)]">
        Showing {items.length} items
      </footer>

      <DoubtModal open={!!selected} doubt={selected}
       onClose={() => setSelected(null)} onReply={handleReply} />
      <FullScreenImage open={imgOpen} 
      src={selected?.attachments?.[0]?.url || ""} 
      onClose={() => setImgOpen(false)} />
    </div>


    <Footer/>
    </>
  )
}
