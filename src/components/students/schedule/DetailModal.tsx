import React from 'react';
import { MapPin, User, Clock, Calendar, Info, X } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { SubjectData } from '@/src/types/schedule';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: (SubjectData & { time: string }) | null;
}

export function DetailModal({ isOpen, onClose, data }: ModalProps) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-3xl w-full max-w-lg shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden animate-[fade-in-up_0.3s_ease-out]">
        
        {/* Header Glow based on status */}
        <div className={`h-2 w-full ${
          data.status === 'ongoing' ? 'bg-[var(--status-ongoing)]' :
          data.status === 'cancelled' ? 'bg-[var(--status-cancelled)]' :
          data.status === 'rescheduled' ? 'bg-[var(--status-rescheduled)]' :
          'bg-[var(--accent)]'
        }`}></div>

        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <StatusBadge status={data.status} />
              <h2 className={`text-2xl md:text-3xl font-bold mt-3 ${data.status === 'cancelled' ? 'line-through text-[var(--text-secondary)]' : 'text-white'}`}>
                {data.subject}
              </h2>
            </div>
            <button onClick={onClose} className="p-2 bg-[var(--bg-secondary)] hover:bg-[var(--accent)]/20 text-[var(--text-secondary)] hover:text-white rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-5 bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)]">
            <ModalRow icon={<Clock />} label="Time Slot" value={data.time} />
            <ModalRow icon={<Calendar />} label="Day" value={data.day.charAt(0).toUpperCase() + data.day.slice(1)} />
            <ModalRow icon={<MapPin />} label="Venue" value={data.room} />
            <ModalRow icon={<User />} label="Instructor" value={data.teacher} />
            
            {data.note && (
              <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex items-start gap-3">
                <Info className="w-5 h-5 text-[var(--accent)] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-bold mb-1">Additional Note</p>
                  <p className="text-sm text-white bg-[var(--accent)]/10 p-3 rounded-xl border border-[var(--accent)]/20">
                    {data.note}
                  </p>
                </div>
              </div>
            )}
          </div>

          <button onClick={onClose} className="mt-8 w-full py-3.5 bg-gradient-to-r from-[var(--accent-dark)] to-[var(--accent)] text-[#0b0714] font-bold rounded-xl hover:shadow-[0_0_20px_var(--accent-glow)] transition-all">
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalRow({ icon, label, value }: { icon: React.ReactElement<any>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--accent)]">
        {React.cloneElement(icon, { className: "w-5 h-5" })}
      </div>
      <div>
        <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-bold">{label}</p>
        <p className="text-base font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}
