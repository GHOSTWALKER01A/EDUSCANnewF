// src/components/teacher/DoubtList.tsx
import React from 'react';
import { DoubtItem } from '../../../types/doubt.type';
import DoubtCard from './DoubtCard';

export default function DoubtList({ items, onOpen }:
  { items: DoubtItem[]; onOpen: (d:DoubtItem)=>void }) {
  if (!items?.length) {
    return <div className="p-6 text-center text-[var(--text-secondary)]">No doubts found.</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map(it => <DoubtCard d={it} key={it._id} onOpen={onOpen} />)}
    </div>
  );
}
