"use client"

import React from 'react';
import { DoubtItem } from '../../../types/doubt.type';

export default function DoubtCard({ d, onOpen }: { d: DoubtItem; onOpen: (d:DoubtItem) => void; }) {
  return (
    <article className="bg-[var(--bg-secondary)] p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer" onClick={() => onOpen(d)} role="button" aria-label={`Open doubt from ${d.studentId?.fullname}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.03)] flex items-center justify-center text-[var(--text-secondary)]">
          {d.studentId?.fullname.split(' ').map((s:string) => s[0]).slice(0,2).join('').toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-[var(--accent)] font-semibold truncate">{d.studentId?.fullname}</h4>
            <span className={`text-xs px-2 py-0.5 rounded ${d.status === 'Pending' ? 'bg-yellow-600' : d.status === 'Replied' ? 'bg-green-600' : 'bg-gray-600'} text-white`}>{d.status}</span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-1 truncate">{d.description}</p>
          <div className="text-xs text-[var(--text-secondary)] mt-2">{d.branch} • {d.date} {d.time || ''}</div>
        </div>
      </div>
    </article>
  );
}
