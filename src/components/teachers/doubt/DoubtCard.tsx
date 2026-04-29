"use client"

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { DoubtItem } from '../../../types/doubt.type';
import { MessageCircle, Clock, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';

export default function DoubtCard({ d, onOpen }: { d: DoubtItem; onOpen: (d:DoubtItem) => void; }) {
  const isReplied = d.status === 'answered' || d.status === 'Replied';
  const isPending = d.status === 'open' || d.status === 'Pending';

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
  };

  return (
    <motion.article 
      variants={itemVariants}
      onClick={() => onOpen(d)}
      role="button" 
      aria-label={`Open doubt from ${d.studentId?.fullname}`}
      className="group bg-[var(--card-bg)]/60 backdrop-blur-xl p-5 rounded-2xl border border-[var(--border-color)]/30 shadow-lg hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-[var(--accent)]/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col relative overflow-hidden"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] border border-[var(--border-color)]/30 flex items-center justify-center font-bold text-[var(--text-primary)] shadow-inner flex-shrink-0 group-hover:from-[var(--accent)]/20 group-hover:to-indigo-500/20 group-hover:text-[var(--accent)] transition-all">
          {d.studentId?.fullname?.split(' ').map((s:string) => s[0]).slice(0,2).join('').toUpperCase() || '?'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-[var(--text-primary)] font-bold truncate group-hover:text-[var(--accent)] transition-colors">{d.subject || 'General Doubt'}</h4>
              <div className="text-xs font-semibold text-[var(--accent)] opacity-80 mt-0.5 flex flex-wrap gap-2">
                <span>From: {d.studentId?.fullname || 'Unknown Student'}</span>
                <span className="opacity-50">•</span>
                <span>{d.studentId?.branch || 'N/A'}</span>
                <span className="opacity-50">•</span>
                <span>Sem {d.studentId?.semester || 'N/A'}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Status Badge */}
              <span className={clsx(
                "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border whitespace-nowrap",
                isReplied 
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                  : isPending 
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    : "bg-gray-500/10 text-gray-400 border-gray-500/20"
              )}>
                {isReplied ? <CheckCircle2 className="w-3 h-3" /> : isPending ? <Clock className="w-3 h-3" /> : null}
                {d.status === 'open' ? 'Pending' : d.status === 'answered' ? 'Replied' : d.status}
              </span>
            </div>
          </div>

          <p className="text-sm text-[var(--text-secondary)] mt-3 line-clamp-2 leading-relaxed">
            {d.description}
          </p>

          <div className="flex items-center justify-between mt-4 border-t border-[var(--border-color)]/10 pt-3">
             <div className="text-xs font-medium text-[var(--text-secondary)] opacity-60">
               {d.date ? `${d.date} ${d.time || ''}` : formatDistanceToNow(new Date(d.createdAt || ''), { addSuffix: true })}
             </div>
             <div className="flex items-center gap-4">
               {d.attachments && d.attachments.length > 0 && (
                 <div className="text-xs font-medium text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded flex items-center gap-1 border border-[var(--accent)]/20">
                   {d.attachments.length} attachment{d.attachments.length > 1 ? 's' : ''}
                 </div>
               )}
               <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>{d.replies?.length || 0} Replies</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
