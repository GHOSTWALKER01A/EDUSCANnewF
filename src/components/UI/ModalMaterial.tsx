// components/teachers/material/MaterialModal.tsx
'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Material } from '../../types/material';
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
  const [category, setCategory] = useState(initial?.category ?? 'Academic Material');
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
    setCategory(initial?.category ?? 'Academic Material');
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
  }, [open, title, description, category, file, fileChanged]);

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
      fd.append('category', category ?? '');
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18 }}
        className="relative z-10 w-full max-w-3xl mx-4"
      >
        <div className="bg-[var(--card-bg)] rounded-lg p-6 shadow-lg border border-[rgba(255,255,255,0.02)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[var(--accent)]">
                {initial ? 'Edit Material' : 'Add New Material'}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {initial ? 'Update fields and Save to update the material.' : 'Fill details and Save.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                ref={closeRef}
                onClick={onClose}
                aria-label="Close modal"
                className="text-[var(--text-secondary)] hover:text-[var(--accent)] p-2 rounded"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4">
            <input
              id="material-title"
              className="w-full p-3 rounded border border-[var(--text-secondary)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
              placeholder="Title (required)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              rows={4}
              className="w-full p-3 rounded border border-[var(--text-secondary)] bg-[var(--bg-primary)] text-[var(--text-primary)] resize-y"
              placeholder="Short description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <select
              className="w-full p-3 rounded border border-[var(--text-secondary)] bg-[var(--bg-primary)]"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Academic Material</option>
              <option>Previous Material</option>
              <option>Other</option>
            </select>

            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">File (image, pdf, docs)</label>
              <input type="file" accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/zip" onChange={handleFileChange} />
              <div className="mt-3">
                {filePreview ? (
                  fileType?.startsWith('image/') || (file && file.type.startsWith('image/')) ? (
                    <div className="max-w-full max-h-[240px] border rounded overflow-hidden">
                      <TransformWrapper>
                        <TransformComponent>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={filePreview} alt="preview" className="w-full object-contain" />
                        </TransformComponent>
                      </TransformWrapper>
                    </div>
                  ) : fileType === 'application/pdf' || (file && file.type === 'application/pdf') ? (
                    <iframe src={filePreview} className="w-full h-[320px] border rounded" title="PDF preview" />
                  ) : (
                    <div className="p-3 bg-[var(--bg-secondary)] rounded">
                      <div className="text-[var(--text-primary)] font-medium">{initial?.fileUrl ? 'Existing file attached' : (file?.name ?? 'No preview available')}</div>
                      <div className="text-xs text-[var(--text-secondary)] mt-1">{file?.name || initial?.fileUrl}</div>
                    </div>
                  )
                ) : (
                  <div className="text-sm text-[var(--text-secondary)]">No preview available</div>
                )}
              </div>

              {(file || initial?.fileUrl) && (
                <div className="mt-2 flex gap-2">
                  <button type="button" onClick={handleRemoveFile} className="px-3 py-1 rounded bg-red-600 text-white text-sm">Remove file</button>
                  { (filePreview || initial?.fileUrl) && (
                    <a href={filePreview ?? initial?.fileUrl ?? '#'} target="_blank" rel="noreferrer" className="px-3 py-1 rounded bg-[var(--accent)] text-sm text-white">Open in new tab</a>
                  )}
                </div>
              )}
            </div>

            {error && <div className="text-red-400 text-sm">{error}</div>}
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded border border-[rgba(255,255,255,0.05)]">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded bg-[var(--accent)] text-white">
              {saving ? 'Saving...' : (initial ? 'Save changes' : 'Create material')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
