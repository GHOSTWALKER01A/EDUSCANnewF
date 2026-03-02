// src/components/ui/Modal.tsx
import React, { ReactNode, useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  title?: string;
};

export default function Modal({ open, onClose, children, className = "", title }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" role="dialog" aria-modal="true">
      <div className={`max-w-3xl w-full rounded-lg p-4 ${className} bg-[var(--card-bg)]`}>
        {title && <h3 className="text-lg font-semibold text-[var(--accent)] mb-3">{title}</h3>}
        <div>{children}</div>
        <div className="mt-4 text-right">
          <button className="px-3 py-2 rounded bg-[var(--accent)] text-[var(--bg-primary)]" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
