
"use client"
import React, { ReactNode, useEffect } from "react";

export default function ModalEvent({ open, onClose, title, children }: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
      <div className="bg-[var(--card-bg)] rounded-lg w-full max-w-3xl p-6 shadow-lg">
        {title && <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-[var(--accent)]">{title}</h3>
          <button aria-label="Close" onClick={onClose} className="text-lg px-2 py-1 rounded hover:bg-white/5">✕</button>
        </div>}
        <div>{children}</div>
      </div>
    </div>
  );
}
