"use client"


import React, { useState } from 'react';
import { useMaterialsTeacher } from '../../../../hooks/useMaterialTeacher';
import MaterialCard from '../../../../components/teachers/material/MaterialCard';
import MaterialModal from '../../../../components/teachers/material/MaterialModal';
import InlineNewCard from '../../../../components/teachers/material/InlineCard';
import FullscreenViewer from '../../../../components/teachers/material/FullScreenView';
import { Material } from '../../../../types/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '@/src/components/layouts/Footer';
import Navbar from '@/src/components/layouts/NavbarTeacher';

export default function TeacherMaterialsPage() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<Material | null>(null);
  const [showInline, setShowInline] = useState(false);
  const [viewer, setViewer] = useState<Material | null>(null);

  const { query, create, remove, update } = useMaterialsTeacher(page, 9, q);
  const materials = query.data?.materials || [];
  const total = query.data?.total || 0;

  const handleCreate = async (fd: FormData) => {
  try {
    await create.mutateAsync(fd);
    setShowInline(false);
    toast.success('Material uploaded');
    
  } catch (err:any) {
    console.log(err?.response?.data?.message); 
    toast.error(err?.response?.data?.message || 'Upload failed');
  }
};
  async function handleDelete(id: string) {
    if (!confirm('Delete this material?')) return;
    try {
      await remove.mutateAsync(id);
      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    }
  }

  async function handleUpdate(id: string, fd: FormData) {
  try {
    await update.mutateAsync({ id, formData: fd });
    toast.success('Updated');
    setEditing(null);
  } catch (err: any) {
    console.error('update failed', err);
    toast.error(err?.response?.data?.message || 'Update failed');
  }
}
console.log("Update the issue",update.mutateAsync);
console.log("Update the issue",update.isPending);

  return (
      
    <>
    <Navbar/>

    <div className="min-h-screen mt-16 p-8 bg-gradient-to-b from-[#031022] to-[#07102a] text-[var(--text-primary)]">
      <ToastContainer />
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-[var(--accent)]">Teacher Materials</h1>
        <div className="flex gap-3 items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title or category..."
            className="px-3 py-2 rounded-md bg-[var(--bg-primary)] border border-transparent focus:border-[var(--accent)] outline-none w-64 text-[var(--text-primary)]"
          />
          <button
            onClick={() => setShowInline(true)}
            className="px-4 py-2 rounded-md bg-gradient-to-r from-[var(--accent)] to-[#4c1d95] shadow-lg hover:scale-105 transform transition"
          >
            Add New
          </button>
        </div>
      </header>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {showInline && (
            <InlineNewCard
              onCancel={() => setShowInline(false)}
              onSave={handleCreate}
              saving={create.isPending}
            />
          )}

          {materials.map((m: Material) => (
          <MaterialCard
              key={m._id}
              m={m}
              onEdit={() => setEditing(m)}
              onDelete={() => handleDelete(m._id)}
              onOpen={() => setViewer(m)}
            />
          ))}
        </div>

        <div className="flex justify-between items-center mt-8">
          <div className="text-sm text-[var(--text-secondary)]">
            {materials.length} of {total} materials
          </div>
          <div>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded bg-[var(--bg-secondary)] mr-2"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 rounded bg-[var(--bg-secondary)]"
            >
              Next
            </button>
          </div>
        </div>
      </section>

  {editing && (
  <MaterialModal
    open={!!editing}
    initial={editing}
    onClose={() => setEditing(null)}
    onSave={(fd) => handleUpdate(editing._id, fd)}
    saving={update.isPending}
  />
)}

      <FullscreenViewer open={!!viewer} material={viewer} onClose={() => setViewer(null)} />
    </div>
    
 <Footer/>

   </>
  );
}
