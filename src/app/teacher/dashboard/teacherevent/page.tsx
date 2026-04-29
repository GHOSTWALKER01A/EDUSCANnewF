
"use client"

import React, { useState } from "react";
import { useEvents } from "../../../../hooks/useEvents";
import EventCard from "../../../../components/teachers/event/EventCard";
import EventFormInline from "../../../../components/teachers/event/EventFormInline";
import FullscreenViewer from "../../../../components/teachers/event/FullScreenView";
import { TeacherEvent } from "../../../../types/events.types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from '@/src/components/layouts/NavbarTeacher';
import Footer from "../../../../components/layouts/Footer";
import { CalendarRange, Search, Loader2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function TeacherEventsPage() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [showInline, setShowInline] = useState(false);
  const [editing, setEditing] = useState<TeacherEvent | null>(null);
  const [viewer, setViewer] = useState<TeacherEvent | null>(null);

  const { query, create, update, remove } = useEvents(page, 6, q);
  const events = query.data?.events || [];
  const total = query.data?.total || 0;

  async function handleCreate(fd: FormData) {
    try {
      await create.mutateAsync(fd);
      setShowInline(false);
      toast.success("Event created successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to create event");
    }
  }

  async function handleUpdate(id: string, fd: FormData) {
    try {
      await update.mutateAsync({ id, fd });
      setEditing(null);
      toast.success("Event updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update event");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await remove.mutateAsync(id);
      toast.success("Event deleted");
      if (events.length === 1 && page > 1) {
         setPage(page - 1);
      }
    } catch {
      toast.error("Failed to delete event");
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
                 <CalendarRange className="w-6 h-6" />
              </div>
              <div>
                 <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--accent)] tracking-tight">Manage Events</h1>
                 <p className="text-sm text-[var(--text-secondary)] font-medium mt-1">Create, update, and oversee upcoming school events.</p>
              </div>
           </div>

           {/* Controls Section */}
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--card-bg)]/40 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-[var(--border-color)]/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
             <div className="w-full sm:max-w-md relative group">
                <Search className="w-5 h-5 text-[var(--text-secondary)] absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--accent)] transition-colors" />
                <input 
                  value={q} 
                  onChange={(e)=> { setQ(e.target.value); setPage(1); }} 
                  placeholder="Search events..." 
                  className="w-full pl-11 pr-4 py-3 bg-[var(--bg-primary)]/50 border border-[var(--border-color)]/30 text-[var(--text-primary)] text-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)] transition-all"
                />
             </div>
             
             <button 
                onClick={() => { setShowInline(true); setEditing(null); }} 
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[var(--accent)] to-indigo-600 hover:from-indigo-500 hover:to-[var(--accent)] text-white font-medium shadow-lg shadow-[var(--accent)]/20 hover:shadow-[var(--accent)]/40 transition-all active:scale-95"
             >
                <Plus className="w-4 h-4" />
                Add New Event
             </button>
           </div>
         </header>

         <main className="flex-1">
           {query.isLoading ? (
             <div className="flex flex-col items-center justify-center h-[300px] text-[var(--text-secondary)] gap-3 bg-[var(--card-bg)]/40 backdrop-blur-md rounded-3xl border border-[var(--border-color)]/20">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
                <span className="font-medium">Loading events...</span>
             </div>
           ) : (
             <div className="space-y-6">
                <AnimatePresence>
                  {(showInline || editing) && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                       <EventFormInline
                         initial={editing ? {
                           title: editing.title,
                           description: editing.description,
                           category: editing.category,
                           startDate: editing.startDate ? new Date(editing.startDate) : null,
                           endDate: editing.endDate ? new Date(editing.endDate) : null,
                           startTime: editing.startTime ? new Date(editing.startTime) : null,
                           endTime: editing.endTime ? new Date(editing.endTime) : null,
                           location: editing.location,
                         } : undefined}
                         onCancel={() => { setShowInline(false); setEditing(null); }}
                         onSave={editing ? async (fd) => handleUpdate(editing._id, fd) : handleCreate}
                         saving={create.isPending || update.isPending}
                       />
                    </motion.div>
                  )}
                </AnimatePresence>

                {events.length > 0 ? (
                   <motion.div 
                     variants={containerVariants} 
                     initial="hidden" 
                     animate="visible"
                     className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                   >
                     {events.map((ev:any) => (
                       <EventCard key={ev._id} event={ev} onEdit={(e)=> { setEditing(e); setShowInline(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} onDelete={(id)=> handleDelete(id)} onOpenFull={(e)=> setViewer(e)} />
                     ))}
                   </motion.div>
                ) : (
                   <div className="flex flex-col items-center justify-center py-16 px-4 bg-[var(--card-bg)]/40 backdrop-blur-xl rounded-3xl border border-[var(--border-color)]/30">
                      <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mb-4 border border-[var(--border-color)]/20 shadow-inner">
                         <CalendarRange className="w-8 h-8 text-[var(--text-secondary)]/50" />
                      </div>
                      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No events found</h3>
                      <p className="text-[var(--text-secondary)] text-center max-w-md">Get started by creating a new event, or try adjusting your search terms.</p>
                   </div>
                )}
             </div>
           )}
         </main>

         {!query.isLoading && total > 0 && (
           <footer className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[var(--card-bg)]/40 backdrop-blur-xl p-4 sm:px-6 rounded-3xl border border-[var(--border-color)]/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
             <div className="text-sm font-medium text-[var(--text-secondary)]">
               Showing <span className="text-[var(--text-primary)]">{events.length}</span> of <span className="text-[var(--text-primary)]">{total}</span> events
             </div>
             <div className="flex items-center gap-3">
               <button 
                 onClick={() => setPage((p) => Math.max(1, p - 1))} 
                 disabled={page === 1}
                 className="px-4 py-2 rounded-xl bg-[var(--bg-secondary)]/80 hover:bg-[var(--bg-secondary)] border border-[var(--border-color)]/30 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 Previous
               </button>
               <span className="text-sm font-bold text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1.5 rounded-lg border border-[var(--accent)]/20">
                 Page {page}
               </span>
               <button 
                 onClick={() => setPage(p => p + 1)} 
                 disabled={events.length < 6 || page * 6 >= total}
                 className="px-4 py-2 rounded-xl bg-[var(--bg-secondary)]/80 hover:bg-[var(--bg-secondary)] border border-[var(--border-color)]/30 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 Next
               </button>
             </div>
           </footer>
         )}

         <FullscreenViewer open={!!viewer} event={viewer} onClose={() => setViewer(null)} />
       </div>
    </div>
  );
}
