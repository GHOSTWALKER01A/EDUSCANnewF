// src/components/teacher/DoubtList.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { DoubtItem } from '../../../types/doubt.type';
import DoubtCard from './DoubtCard';
import { MessageSquareOff } from 'lucide-react';

export default function DoubtList({ items, onOpen }:
  { items: DoubtItem[]; onOpen: (d:DoubtItem)=>void }) {
  
  if (!items?.length) {
    return (
      <div className="p-12 mt-8 text-center text-[var(--text-secondary)] bg-[var(--card-bg)]/40 backdrop-blur-xl rounded-3xl border border-[var(--border-color)]/30 flex flex-col items-center justify-center min-h-[300px] shadow-lg">
        <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mb-4 text-[var(--text-secondary)] opacity-50">
          <MessageSquareOff className="w-8 h-8" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-bold text-[var(--text-primary)]">No Doubts Found</h3>
        <p className="text-sm mt-1">There are currently no student doubts matching your search.</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-4"
    >
      {items.map(it => <DoubtCard d={it} key={it._id} onOpen={onOpen} />)}
    </motion.div>
  );
}
