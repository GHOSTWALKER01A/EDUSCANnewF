// components/teachers/material/MaterialModal.tsx
'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Material } from '../../../types/material';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { motion } from 'framer-motion';

type Props = {
  open: boolean;
  initial?: Material | null; // if present, this is "Edit", otherwise "Create"
  onClose: () => void;
  onSave: (fd: FormData) => Promise<any>;
  saving?: boolean;
};

export default function MaterialModal({ open, initial = null, onClose, onSave, saving = false }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [resourceType, setResourceType] = useState(initial?.resourceType ?? initial?.category ?? 'Academic Material');
  const [filePreview, setFilePreview] = useState<string | null>(initial?.filePreview ?? initial?.fileUrl ?? null);
  const [fileType, setFileType] = useState<string | undefined>(initial?.fileType ?? undefined);
  const [file, setFile] = useState<File | null>(null);
  const [fileChanged, setFileChanged] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  // initialize when modal opens / initial changes
  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title ?? '');
    setDescription(initial?.description ?? '');
    setResourceType(initial?.resourceType ?? initial?.category ?? 'Academic Material');
    setFilePreview(initial?.filePreview ?? initial?.fileUrl ?? null);
    setFileType(initial?.fileType ?? undefined);
    setFile(null);
    setFileChanged(false);
    setError(null);
    // focus on title input for better UX
    setTimeout(() => {
      const t = document.querySelector<HTMLInputElement>('#material-title');
      t?.focus();
    }, 50);
  }, [open, initial]);

  // keyboard ESC
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSave(); // ctrl/cmd + Enter
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, title, description, resourceType, file, fileChanged]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    // limit size to 50MB for safety
    if (f.size > 50 * 1024 * 1024) {
      setError('File too large (max 50MB)');
      return;
    }
    setError(null);
    setFile(f);
    setFileType(f.type);
    setFileChanged(true);

    // create a preview for images / pdf (data URL)
    const reader = new FileReader();
    reader.onload = () => {
      setFilePreview(String(reader.result));
    };
    // if image or pdf read as DataURL, else do not attempt preview but keep filename
    if (f.type.startsWith('image/') || f.type === 'application/pdf') {
      reader.readAsDataURL(f);
    } else {
      // no binary preview for other docs; show a small card with name instead
      setFilePreview(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(initial?.filePreview ?? initial?.fileUrl ?? null);
    setFileChanged(true); // user explicitly removed -> update backend to remove file if needed
    setFileType(undefined);
  };

  const validate = () => {
    if (!title.trim()) {
      setError('Title is required');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    setError(null);
    if (!validate()) return;
    try {
      const fd = new FormData();
      fd.append('title', title.trim());
      fd.append('description', description ?? '');
      fd.append('resourceType', resourceType ?? '');
      // Only append file if user selected new one or removed one:
      if (fileChanged) {
        if (file) fd.append('file', file);
        else fd.append('fileRemoved', '1'); // signal backend to remove file if desired
      }
      await onSave(fd);
      // do not clear here — the parent should close modal on success
    } catch (err: any) {
      console.error('Save failed', err);
      setError(err?.message || 'Failed to save material');
    }
  };

  const inputBaseClasses = "w-full p-3 bg-[var(--bg-primary)]/50 border border-[var(--border-color)]/30 text-[var(--text-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)] transition-all placeholder:text-[var(--text-secondary)]/70";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative w-full max-w-2xl bg-[var(--card-bg)]/80 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-[var(--border-color)]/30 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border-color)]/20 flex items-center justify-between bg-black/20 shrink-0">
           <div>
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--accent)]">
                {initial ? 'Edit Material' : 'Add New Material'}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {initial ? 'Update and manage resource details.' : 'Upload a new resource for students.'}
              </p>
           </div>
           
           <button
             ref={closeRef}
             onClick={onClose}
             aria-label="Close modal"
             className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-[var(--text-primary)] hover:text-rose-400 transition-colors shrink-0"
           >
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
            <div>
              <label htmlFor="material-title" className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold mb-1.5 ml-1">Title</label>
              <input
                id="material-title"
                className={inputBaseClasses}
                placeholder="Name of the material..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold mb-1.5 ml-1">Description (Optional)</label>
              <textarea
                rows={3}
                className={`${inputBaseClasses} resize-y min-h-[80px]`}
                placeholder="Provide details about this resource..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold mb-1.5 ml-1">Type</label>
              <select
                className={`${inputBaseClasses} appearance-none`}
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
              >
                <option value="Academic Material">Academic Material</option>
                <option value="Previous year paper">Previous year paper</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold mb-1.5 ml-1">Attachment</label>
              
              <div className="flex items-center gap-3">
                 <label className="flex-1 max-w-[200px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-color)]/30 bg-[var(--bg-secondary)]/50 hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors group">
                    <svg className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    <span className="text-sm font-medium text-[var(--text-primary)]">Choose File</span>
                    <input type="file" accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/zip" onChange={handleFileChange} className="hidden" />
                 </label>
                 
                 {(file || initial?.fileUrl) && (
                    <button type="button" onClick={handleRemoveFile} className="px-4 py-2.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/50 transition-colors text-sm font-medium">
                      Remove
                    </button>
                 )}
              </div>

              <div className="mt-3">
                {filePreview ? (
                  fileType?.startsWith('image/') || (file && file.type.startsWith('image/')) ? (
                    <div className="w-full max-h-[160px] border border-[var(--border-color)]/20 shadow-inner rounded-xl overflow-hidden bg-[var(--bg-secondary)]/30">
                      <TransformWrapper>
                        <TransformComponent>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={filePreview} alt="preview" className="w-full h-full object-contain" />
                        </TransformComponent>
                      </TransformWrapper>
                    </div>
                  ) : fileType === 'application/pdf' || (file && file.type === 'application/pdf') ? (
                    <div className="w-full h-[240px] border border-[var(--border-color)]/20 shadow-inner rounded-xl overflow-hidden bg-[var(--bg-secondary)]/30">
                       <iframe src={filePreview} className="w-full h-full" title="PDF preview" />
                    </div>
                  ) : (
                    <div className="p-4 bg-[var(--bg-secondary)]/40 border border-[var(--border-color)]/20 rounded-xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                         <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[var(--text-primary)] font-medium text-sm truncate">{initial?.fileUrl && !file ? 'Existing file attached' : file?.name}</div>
                        <div className="text-xs text-[var(--text-secondary)] truncate">Document Ready</div>
                      </div>
                      {(filePreview || initial?.fileUrl) && (
                        <a href={filePreview ?? initial?.fileUrl ?? '#'} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors shrink-0">
                          Open
                        </a>
                      )}
                    </div>
                  )
                ) : (
                  <div className="p-4 bg-[var(--bg-secondary)]/20 border border-[var(--border-color)]/10 border-dashed rounded-xl flex items-center gap-3">
                     <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)]/50 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-[var(--text-secondary)]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                     </div>
                     <div className="text-sm text-[var(--text-secondary)]">No preview available</div>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-start gap-2">
                 <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                 <span>{error}</span>
              </div>
            )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--border-color)]/20 bg-black/20 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[var(--border-color)]/40 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-all font-medium text-sm">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--accent)] to-indigo-600 hover:from-indigo-500 hover:to-[var(--accent)] text-white font-medium shadow-lg shadow-[var(--accent)]/20 hover:shadow-[var(--accent)]/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px] text-sm">
            {saving ? (
               <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (initial ? 'Save Changes' : 'Create Material')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
