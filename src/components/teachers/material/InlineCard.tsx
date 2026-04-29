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
  const [resourceType, setResourceType] = useState('Academic Material');
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
    fd.append('resourceType', resourceType);
    if (file) fd.append('file', file);
    await onSave(fd);
    setTitle(''); setResourceType('Academic Material'); setFile(null); setPreview(null);
  }

  const inputBaseClasses = "w-full px-4 py-3 bg-[var(--bg-primary)]/50 border border-[var(--border-color)]/30 text-[var(--text-primary)] text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)] transition-all placeholder:text-[var(--text-secondary)]/70";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -10 }}
      className="bg-[var(--card-bg)]/60 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[var(--border-color)]/30 space-y-5 h-full flex flex-col"
    >
      <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2">Add New Material</h4>
      
      <div className="flex-1 space-y-4 flex flex-col">
        <div>
          <input value={title} onChange={(e)=>setTitle(e.target.value)} className={inputBaseClasses} placeholder="Material Title" />
        </div>
        
        <div>
          <select value={resourceType} onChange={(e)=>setResourceType(e.target.value)} className={`${inputBaseClasses} appearance-none`}>
            <option value="Academic Material">Academic Material</option>
            <option value="Previous year paper">Previous year paper</option>
            <option value="General">General</option>
          </select>
        </div>

        <div className="relative flex-1 flex flex-col">
           {!preview ? (
             <label className="flex flex-col items-center justify-center w-full h-full min-h-[140px] border-2 border-[var(--border-color)]/50 border-dashed rounded-2xl cursor-pointer bg-[var(--bg-primary)]/30 hover:bg-[var(--bg-primary)]/60 transition-colors group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                   <svg className="w-8 h-8 mb-3 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                   </svg>
                   <p className="mb-1 text-sm text-[var(--text-secondary)]"><span className="font-semibold text-[var(--text-primary)]">Click to upload</span> or drag and drop</p>
                   <p className="text-xs text-[var(--text-secondary)]/70">Images and PDF documents</p>
                </div>
                <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e)=> setFile(e.target.files?.[0]||null)} />
             </label>
           ) : (
             <div className="relative rounded-2xl overflow-hidden border border-[var(--border-color)]/20 shadow-inner h-full min-h-[140px] bg-[var(--bg-secondary)]/30 flex items-center justify-center">
                {file?.type.startsWith('image/') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="preview" className="w-full h-full object-cover absolute inset-0 opacity-50 blur-sm" />
                ) : null}
                
                {file?.type.startsWith('image/') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="preview" className="max-w-full max-h-full object-contain relative z-10 p-2" />
                ) : (
                  <div className="flex flex-col items-center justify-center relative z-10">
                     <svg className="w-10 h-10 text-[var(--accent)] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                     <span className="text-sm font-medium text-[var(--text-primary)] px-4 text-center truncate max-w-full">{file?.name}</span>
                  </div>
                )}

                <button type="button" onClick={() => { setFile(null); setPreview(null); }} className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-xl hover:bg-rose-500/90 transition-colors backdrop-blur-md z-20 shadow-lg">
                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
             </div>
           )}
        </div>

        <div className="pt-2 flex gap-3 justify-end items-center mt-auto">
          <button onClick={onCancel} className="px-4 py-2.5 rounded-xl border border-[var(--border-color)]/40 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-all font-medium text-sm">
            Cancel
          </button>
          <button onClick={submit} disabled={saving} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--accent)] to-indigo-600 hover:from-indigo-500 hover:to-[var(--accent)] text-white font-medium shadow-lg shadow-[var(--accent)]/20 hover:shadow-[var(--accent)]/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[90px] text-sm">
            {saving ? (
               <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : "Save"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
