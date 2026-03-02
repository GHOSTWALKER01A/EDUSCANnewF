"use client"

import React, { ReactNode, useEffect } from 'react';

export default function ModalBase({ open, title, onClose, children }:
  { open: boolean; title?: string; onClose: () => void; children: ReactNode; }) {

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div aria-modal="true" role="dialog" className="fixed inset-0 z-50 flex items-center justify-center" >
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl mx-4">
        <div className="bg-[var(--card-bg)] rounded-lg shadow-lg overflow-hidden">
          {title && <div className="px-6 py-4 border-b"><h3 className="text-lg font-semibold text-[var(--accent)]">{title}</h3></div>}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}