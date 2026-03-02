"use client "

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function InlineNewCard({
  onCancel,
  onSave,
  saving
}: {
  onCancel: () => void;
  onSave: (fd: FormData) => Promise<void>;
  saving?: boolean;
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Academic Material');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const r = new FileReader();
    r.onload = () => setPreview(String(r.result));
    r.readAsDataURL(file);
  }, [file]);

  async function submit() {
    if (!title.trim()) return alert('Please enter title');
    const fd = new FormData();
    fd.append('title', title);
    fd.append('category', category);
    if (file) fd.append('file', file);
    await onSave(fd);
    setTitle(''); setCategory('Academic Material'); setFile(null); setPreview(null);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-[#07152b] to-[#0b2a4b] p-4 rounded-2xl shadow-lg border border-[rgba(255,255,255,0.02)]"
    >
      <h4 className="text-lg font-semibold text-[var(--accent)]">Add New Material</h4>
      <div className="mt-3 space-y-3">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full p-2 rounded bg-[var(--bg-primary)] border" placeholder="Title" />
        <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full p-2 rounded bg-[var(--bg-primary)] border">
          <option>Academic Material</option>
          <option>Previous Material</option>
        </select>

        <input type="file" accept="image/*,application/pdf" onChange={(e)=> setFile(e.target.files?.[0]||null)} />
        {preview && <img src={preview} alt="preview" className="w-full h-36 object-contain rounded" />}

        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-3 py-1 rounded border">Cancel</button>
          <button onClick={submit} className="px-3 py-1 rounded bg-[var(--accent)] text-white" disabled={saving}>
            {saving ? 'Uploading...' : 'Save'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
