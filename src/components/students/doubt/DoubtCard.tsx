'use client'

import React from 'react';
import { motion, Variants } from 'framer-motion';
import type { DoubtItem } from '../../../types/doubt.type';
import { MessageCircle, Clock, CheckCircle2, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';

export default function DoubtCard({ 
  doubt, 
  onOpenReply, 
  onDelete, 
  onEdit 
}: { 
  doubt: DoubtItem, 
  onOpenReply: (d:DoubtItem)=>void,
  onDelete: (id: string) => void,
  onEdit: (d: DoubtItem) => void
}) {
  const [showMenu, setShowMenu] = React.useState(false);

  const isReplied = doubt.status === 'answered' || doubt.status === 'Replied';
  const isPending = doubt.status === 'open' || doubt.status === 'Pending';

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(doubt._id);
    setShowMenu(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(doubt);
    setShowMenu(false);
  };

  return (
    <motion.article 
      variants={itemVariants}
      onClick={() => onOpenReply(doubt)}
      role="button" 
      aria-label={`Open doubt about ${doubt.subject}`}
      className="group bg-[var(--card-bg)]/60 backdrop-blur-xl p-5 rounded-2xl border border-[var(--border-color)]/30 shadow-lg hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-[var(--accent)]/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col relative overflow-hidden"
    >
      <div className="flex items-start gap-4">
        {/* Subject Avatar/Initial */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] border border-[var(--border-color)]/30 flex items-center justify-center font-bold text-[var(--text-primary)] shadow-inner flex-shrink-0 group-hover:from-[var(--accent)]/20 group-hover:to-indigo-500/20 group-hover:text-[var(--accent)] transition-all">
          {doubt.subject.substring(0, 2).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 relative">
            <div>
              <h4 className="text-[var(--text-primary)] font-bold truncate group-hover:text-[var(--accent)] transition-colors">{doubt.subject}</h4>
              <div className="text-xs font-semibold text-[var(--accent)] opacity-80 mt-0.5">
                To: {doubt.teacherId?.fullname || 'Any Available Teacher'}
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
                {doubt.status === 'open' ? 'Pending' : doubt.status === 'answered' ? 'Replied' : doubt.status}
              </span>

              {/* Action Menu */}
              <button 
                onClick={handleMenuClick}
                className="p-1 rounded-full hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-white transition-colors focus:outline-none"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute right-0 top-8 w-32 bg-[var(--card-bg)] border border-[var(--border-color)]/30 shadow-xl rounded-xl overflow-hidden z-10 flex flex-col">
                  <button 
                    onClick={handleEdit}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-[var(--text-primary)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-colors"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-rose-500 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-[var(--text-secondary)] mt-3 line-clamp-2 leading-relaxed">
            {doubt.description}
          </p>

          <div className="flex items-center justify-between mt-4 border-t border-[var(--border-color)]/10 pt-3">
             <div className="text-xs font-medium text-[var(--text-secondary)] opacity-60">
               {doubt.date ? `${doubt.date} ${doubt.time || ''}` : formatDistanceToNow(new Date(doubt.createdAt || ''), { addSuffix: true })}
             </div>
             <div className="flex items-center gap-4">
               {doubt.attachments && doubt.attachments.length > 0 && (
                 <div className="text-xs font-medium text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded flex items-center gap-1 border border-[var(--accent)]/20">
                   {doubt.attachments.length} attachment{doubt.attachments.length > 1 ? 's' : ''}
                 </div>
               )}
               <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>{doubt.replies?.length || 0} Replies</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
