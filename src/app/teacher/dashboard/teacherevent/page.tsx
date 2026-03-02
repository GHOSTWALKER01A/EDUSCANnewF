
"use client"

import React, { useState } from "react";
import { useEvents } from "../../../../hooks/useEvents";
import EventCard from "../../../../components/teachers/event/EventCard";
import EventFormInline from "../../../../components/teachers/event/EventFormInline";
import FullscreenViewer from "../../../../components/teachers/event/FullScreenView";
import { TeacherEvent } from "../../../../types/events.types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../../../components/layouts/NavbarTeacher";
import Footer from "../../../../components/layouts/Footer";



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
      toast.success("Event created");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Create failed");
    }
  }

  async function handleUpdate(id: string, fd: FormData) {
    try {
      await update.mutateAsync({ id, fd });
      setEditing(null);
      toast.success("Updated");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    try {
      await remove.mutateAsync(id);
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  }

  return (
    <>
       <Navbar/>

    <div className="min-h-screen mt-16 p-8 bg-gradient-to-b from-[#031022] to-[#07102a]">
      <ToastContainer position="top-right" />
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-[var(--accent)]">Teacher Events</h1>
        <div className="flex items-center gap-3">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="px-3 py-2 rounded bg-[var(--bg-primary)]" />
          <button onClick={() => setShowInline(true)} className="px-4 py-2 rounded bg-[var(--accent)] text-white">Add New</button>
        </div>
      </header>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {showInline && (
            <EventFormInline
              onCancel={() => setShowInline(false)}
              onSave={handleCreate}
              saving={create.isPending}
            />
          )}

          {events.map((ev:any) => (
            <EventCard key={ev._id} event={ev} onEdit={(e)=> setEditing(e)} onDelete={(id)=> handleDelete(id)} onOpenFull={(e)=> setViewer(e)} />
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-[var(--text-secondary)]">
            {events.length} of {total} events
          </div>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 rounded bg-[var(--bg-secondary)]">Prev</button>
            <button onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded bg-[var(--bg-secondary)]">Next</button>
          </div>
        </div>
      </section>

      {/* edit modal */}
      {editing && (
        <div>
          <EventFormInline
            initial={{
              title: editing.title,
              description: editing.description,
              category: editing.category,
              startDate: editing.startDate ? new Date(editing.startDate) : null,
              endDate: editing.endDate ? new Date(editing.endDate) : null,
              startTime: editing.startTime ? new Date(editing.startTime) : null,
              endTime: editing.endTime ? new Date(editing.endTime) : null,
              location: editing.location,
            }}
            onCancel={() => setEditing(null)}
            onSave={async (fd: FormData) => {
              await handleUpdate(editing._id, fd);
            }}
            saving={update.isPending}
          />
        </div>
      )}

      <FullscreenViewer open={!!viewer} event={viewer} onClose={() => setViewer(null)} />
    </div>

    <Footer/>
    </>
  );
}
