import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Material } from '../../../types/material';
import { FileText, Eye, Edit, Trash2, Image as ImageIcon } from 'lucide-react';

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

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
  const isImage = m.fileType?.startsWith('image/') && m.fileUrl;

  return (
    <motion.article
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative bg-[var(--card-bg)]/60 backdrop-blur-xl rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[var(--border-color)]/30 hover:border-[var(--accent)]/50 transition-all group flex flex-col h-full overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      
      <div className="flex gap-4 mb-4 relative z-10">
        <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-[var(--bg-secondary)]/50 border border-[var(--border-color)]/20 shadow-inner flex items-center justify-center relative group-hover:border-[var(--accent)]/30 transition-colors">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={m.fileUrl} alt={m.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] flex items-center justify-center">
               <FileText className="w-8 h-8 text-[var(--text-secondary)]/60 group-hover:text-[var(--accent)] transition-colors" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--accent)] truncate group-hover:to-indigo-400 transition-all">{m.title}</h3>
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 shadow-[0_0_10px_rgba(var(--accent-rgb),0.1)]">
              {m.category || "General"}
            </span>
            <span className="text-xs font-medium text-[var(--text-secondary)] whitespace-nowrap bg-[var(--bg-secondary)]/40 px-2.5 py-1 rounded-lg border border-[var(--border-color)]/10">
              {new Date(m.createdAt || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
      
      {m.description && (
         <p className="text-sm text-[var(--text-secondary)] mt-2 mb-4 line-clamp-2 leading-relaxed relative z-10 flex-1">
           {m.description}
         </p>
      )}

      {/* Action Bar */}
      <div className="mt-auto pt-4 flex items-center gap-2 border-t border-[var(--border-color)]/20 relative z-10 w-full justify-between">
         <button 
           onClick={onOpen} 
           title="Preview Material"
           className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-secondary)]/80 hover:bg-[var(--accent)] hover:text-white text-[var(--text-secondary)] text-sm font-medium transition-colors border border-[var(--border-color)]/20 hover:border-[var(--accent)]/50 shadow-sm"
         >
           <Eye className="w-4 h-4" />
           <span className="hidden sm:inline">Preview</span>
         </button>
         
         <div className="flex items-center gap-2">
           <button 
             onClick={onEdit} 
             title="Edit Material"
             className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border border-white/5"
           >
             <Edit className="w-4 h-4" />
           </button>
           <button 
             onClick={onDelete} 
             title="Delete Material"
             className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-all border border-rose-500/20 shadow-sm hover:shadow-rose-500/25 group/del"
           >
             <Trash2 className="w-4 h-4 group-hover/del:scale-110 transition-transform" />
           </button>
         </div>
      </div>
    </motion.article>
  );
}
