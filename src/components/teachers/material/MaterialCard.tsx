
import React from 'react';
import { motion } from 'framer-motion';
import { Material } from '../../../types/material';

export default function MaterialCard({
  m,
  onEdit,
  onDelete,
  onOpen
}: {
  m: Material;
  onEdit: () => void;
  onDelete: () => void;
  onOpen: () => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="relative bg-gradient-to-br from-[#071133] to-[#081b3a] rounded-2xl p-5 shadow-[0_10px_30px_rgba(7,16,42,0.6)] border border-transparent hover:border-[rgba(255,255,255,0.03)] transition"
    >
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-[rgba(255,255,255,0.02)] border">
          {m.fileType?.startsWith('image/') && m.fileUrl ? (
            // thumbnail
            // eslint-disable-next-line @next/next/no-img-element
            <img src={m.fileUrl} alt={m.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)]">
              <span className="text-xl">📄</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-[var(--accent)] truncate">{m.title}</h3>
          <p className="text-sm text-[var(--text-secondary)] mt-2 line-clamp-2">{m.description}</p>
          <div className="flex gap-2 mt-3 items-center">
            <span className="text-xs bg-[rgba(255,255,255,0.03)] px-2 py-1 rounded text-[var(--text-secondary)]">{m.category}</span>
            <span className="text-xs text-[var(--text-secondary)] ml-auto">{new Date(m.createdAt || '').toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={onOpen} className="px-3 py-1 rounded bg-[var(--accent)] text-white text-sm">Preview</button>
        <button onClick={onEdit} className="px-3 py-1 rounded border border-[rgba(255,255,255,0.06)] text-sm text-[var(--text-primary)]">Edit</button>
        <button onClick={onDelete} className="px-3 py-1 rounded bg-red-600 text-white text-sm ml-auto">Delete</button>
      </div>
    </motion.article>
  );
}
