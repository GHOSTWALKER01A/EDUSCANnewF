"use client"

import React, { useState, useMemo } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDoubts } from '../../../../hooks/useDoubt'
import DoubtList from '../../../../components/teachers/doubt/Doubtlist'
import DoubtModal from '../../../../components/teachers/doubt/DoubtModal'
import FullScreenImage from '../../../../components/teachers/doubt/FullScreenView'
import type { DoubtItem } from '../../../../types/doubt.type'
import Navbar from '@/src/components/layouts/NavbarTeacher';
import Footer from "../../../../components/layouts/Footer";
import { MessageSquare, Search, Loader2, Filter } from 'lucide-react'
import clsx from 'clsx'

export default function DoubtPage() {
  const [q, setQ] = useState('')
  const [semester, setSemester] = useState<number | null>(null)
  const [branch, setBranch] = useState<string | null>(null)
  const [selected, setSelected] = useState<DoubtItem | null>(null)
  const [imgOpen, setImgOpen] = useState(false)

  // Assuming useDoubts hook supports these params
  const {query, createReply, remove } = useDoubts({ 
    q, 
    semester: semester ?? undefined, 
    branch: branch ?? undefined 
  })

  const selectClasses = "appearance-none bg-[var(--bg-secondary)]/50 border border-[var(--border-color)]/30 text-[var(--text-primary)] text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all cursor-pointer hover:bg-[var(--bg-secondary)] w-full";

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
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] relative overflow-hidden flex flex-col">
       {/* Abstract Backgrounds */}
       <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
       <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-[var(--accent)]/10 rounded-full blur-[100px] pointer-events-none" />

       <Navbar/>

       <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex-1 flex flex-col">
         <ToastContainer position="top-right" autoClose={2500} theme="dark" pauseOnHover />
         
         <header className="mb-8 space-y-6">
           {/* Title Section */}
           <div className="flex items-center gap-4 bg-[var(--card-bg)]/40 backdrop-blur-xl p-6 rounded-3xl border border-[var(--border-color)]/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-[var(--accent)]/20 rotate-3 shrink-0">
                 <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                 <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--accent)] tracking-tight">Student Doubts</h1>
                 <p className="text-sm text-[var(--text-secondary)] font-medium mt-1">Review and respond to questions from your students.</p>
              </div>
           </div>

           {/* Controls Section */}
           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[var(--card-bg)]/40 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-[var(--border-color)]/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
             <div className="w-full lg:w-96 relative group shrink-0">
                <Search className="w-5 h-5 text-[var(--text-secondary)] absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--accent)] transition-colors" />
                <input 
                  value={q} 
                  onChange={(e)=> setQ(e.target.value)} 
                  placeholder="Search student or keyword..." 
                  className="w-full pl-11 pr-4 py-3 bg-[var(--bg-primary)]/50 border border-[var(--border-color)]/30 text-[var(--text-primary)] text-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)] transition-all"
                />
             </div>
             
             <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
               <div className="relative w-full sm:w-auto sm:min-w-[160px]">
                 <select value={semester ?? ''} onChange={(e) => setSemester(e.target.value ? Number(e.target.value) : null)} className={selectClasses}>
                   <option value="">Semester (All)</option>
                   {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                 </select>
                 <Filter className="w-4 h-4 text-[var(--text-secondary)] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
               </div>

               <div className="relative w-full sm:w-auto sm:min-w-[160px]">
                 <select value={branch ?? ''} onChange={(e) => setBranch(e.target.value || null)} className={selectClasses}>
                   <option value="">Branch (All)</option>
                   {['CSE','IT','ECE','EE','MECH','CIVIL'].map(b => <option key={b} value={b}>{b}</option>)}
                 </select>
                 <Filter className="w-4 h-4 text-[var(--text-secondary)] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
               </div>
             </div>
           </div>
         </header>

         <main className="flex-1">
           {query.isLoading ? (
             <div className="flex flex-col items-center justify-center h-[300px] text-[var(--text-secondary)] gap-3 bg-[var(--card-bg)]/40 backdrop-blur-md rounded-3xl border border-[var(--border-color)]/20">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
                <span className="font-medium">Loading recent doubts...</span>
             </div>
           ) : (
             <DoubtList items={items} onOpen={handleOpen} />
           )}
         </main>

         {!query.isLoading && (
           <footer className="mt-8 flex flex-col items-center gap-4">
             {query.isFetchingNextPage ? (
               <button disabled className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)]/30 text-[var(--text-secondary)] font-medium opacity-70 cursor-not-allowed transition-all">
                 <Loader2 className="w-4 h-4 animate-spin" /> Loading more...
               </button>
             ) : query.hasNextPage ? (
               <button 
                 onClick={() => query.fetchNextPage()} 
                 className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--accent)] to-indigo-600 hover:from-indigo-500 hover:to-[var(--accent)] text-white font-medium shadow-lg shadow-[var(--accent)]/20 hover:shadow-[var(--accent)]/40 transition-all hover:-translate-y-0.5"
               >
                 Load More Doubts
               </button>
             ) : items.length > 0 ? (
               <div className="text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg-secondary)]/50 px-4 py-2 rounded-full border border-[var(--border-color)]/20">
                  End of results • Showing all {items.length} doubts
               </div>
             ) : null}
           </footer>
         )}

         <DoubtModal open={!!selected} doubt={selected} onClose={() => setSelected(null)} onReply={handleReply} />
         <FullScreenImage open={imgOpen} src={selected?.attachments?.[0]?.url || ""} onClose={() => setImgOpen(false)} />
       </div>
    </div>
  )
}
