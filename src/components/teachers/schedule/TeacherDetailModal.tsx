import React, { useState } from 'react';
import { MapPin, Users, Clock, Calendar, Info, X, AlertTriangle, ArrowRight } from 'lucide-react';
import { StatusBadge } from '@/src/components/students/schedule/StatusBadge';
import { TeacherSubjectData } from '@/src/types/schedule';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: (TeacherSubjectData & { time: string }) | null;
  onCancel?: (day: string, time: string) => void;
  onReschedule?: (day: string, time: string, newDay: string, newTime: string, newVenue: string) => void;
}

export function TeacherDetailModal({ isOpen, onClose, data, onCancel, onReschedule }: ModalProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  
  // Reschedule Form State
  const [rescheduleData, setRescheduleData] = useState({
    newDay: 'monday',
    newTime: '',
    newVenue: ''
  });

  if (!isOpen || !data) return null;

  // Reset internal state when modal closes
  const handleClose = () => {
    setIsCancelling(false);
    setIsRescheduling(false);
    setRescheduleData({ newDay: 'monday', newTime: '', newVenue: '' });
    onClose();
  };

  const handleConfirmCancel = () => {
    if (onCancel) {
      onCancel(data.day, data.time);
    }
    handleClose();
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (onReschedule && rescheduleData.newTime && rescheduleData.newVenue) {
      onReschedule(data.day, data.time, rescheduleData.newDay, rescheduleData.newTime, rescheduleData.newVenue);
      handleClose();
    }
  };

  const canModify = data.status === 'scheduled' || data.status === 'rescheduled';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={handleClose}></div>
      
      {/* Modal Content */}
      <div className="relative bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-3xl w-full max-w-lg shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden animate-[fade-in-up_0.3s_ease-out]">
        
        {/* Header Glow based on status or active action */}
        <div className={`h-2 w-full ${
          isCancelling ? 'bg-red-500' :
          isRescheduling ? 'bg-amber-500' :
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
            <button onClick={handleClose} className="p-2 bg-[var(--bg-secondary)] hover:bg-[var(--accent)]/20 text-[var(--text-secondary)] hover:text-white rounded-full transition-colors flex-shrink-0">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
             {/* Default Information View */}
            {!isCancelling && !isRescheduling && (
              <div className="space-y-5 bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)] animate-fade-in">
                <ModalRow icon={<Clock />} label="Time Slot" value={data.time} />
                <ModalRow icon={<Calendar />} label="Day" value={data.day.charAt(0).toUpperCase() + data.day.slice(1)} />
                <ModalRow icon={<MapPin />} label="Venue" value={data.room} />
                <ModalRow icon={<Users />} label="Class / Section" value={data.classGroup} />
                
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
            )}

            {/* Cancelling Confirmation View */}
            {isCancelling && (
              <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/30 text-center animate-fade-in">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Cancel Period?</h3>
                <p className="text-[var(--text-secondary)] text-sm mb-6">Are you sure you want to cancel this period? This action will notify the enrolled students.</p>
                <div className="flex gap-3">
                  <button onClick={() => setIsCancelling(false)} className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/80 transition-colors">
                    Keep It
                  </button>
                  <button onClick={handleConfirmCancel} className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all">
                    Yes, Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Rescheduling Form View */}
            {isRescheduling && (
               <form onSubmit={handleConfirmReschedule} className="bg-amber-500/5 p-6 rounded-2xl border border-amber-500/30 animate-fade-in space-y-4">
                 <h3 className="text-xl font-bold text-amber-500 mb-4 flex items-center gap-2">
                   <Calendar className="w-5 h-5" /> Reschedule Period
                 </h3>
                 
                 <div className="space-y-3">
                   <div>
                     <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-bold mb-1 block">New Day</label>
                     <select 
                       required
                       className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                       value={rescheduleData.newDay}
                       onChange={e => setRescheduleData({...rescheduleData, newDay: e.target.value})}
                     >
                       <option value="monday">Monday</option>
                       <option value="tuesday">Tuesday</option>
                       <option value="wednesday">Wednesday</option>
                       <option value="thursday">Thursday</option>
                       <option value="friday">Friday</option>
                     </select>
                   </div>
                   
                   <div>
                     <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-bold mb-1 block">New Time</label>
                     <input 
                       type="text"
                       required
                       placeholder="e.g. 14:00 - 14:45"
                       className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                       value={rescheduleData.newTime}
                       onChange={e => setRescheduleData({...rescheduleData, newTime: e.target.value})}
                     />
                   </div>

                   <div>
                     <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-bold mb-1 block">New Venue</label>
                     <input 
                       type="text"
                       required
                       placeholder="e.g. Room 101"
                       className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                       value={rescheduleData.newVenue}
                       onChange={e => setRescheduleData({...rescheduleData, newVenue: e.target.value})}
                     />
                   </div>
                 </div>

                 <div className="flex gap-3 mt-6 pt-2">
                    <button type="button" onClick={() => setIsRescheduling(false)} className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/80 transition-colors">
                      Back
                    </button>
                    <button type="submit" className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2">
                       Confirm <ArrowRight className="w-4 h-4" />
                    </button>
                 </div>
               </form>
            )}
          </div>

          {/* Action Buttons (Only show if not currently modifying and if status allows) */}
          {!isCancelling && !isRescheduling && (
            <div className="mt-8 flex flex-col gap-3">
              {canModify && (
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setIsCancelling(true)}
                    className="w-full py-3 bg-[var(--bg-primary)] border border-red-500/30 text-red-500 hover:bg-red-500/10 font-bold rounded-xl transition-all"
                  >
                    Cancel Class
                  </button>
                  <button 
                    onClick={() => setIsRescheduling(true)}
                    className="w-full py-3 bg-[var(--bg-primary)] border border-amber-500/30 text-amber-500 hover:bg-amber-500/10 font-bold rounded-xl transition-all"
                  >
                    Reschedule
                  </button>
                </div>
              )}
              <button onClick={handleClose} className="w-full py-3.5 bg-gradient-to-r from-[var(--accent-dark)] to-[var(--accent)] text-[#0b0714] font-bold rounded-xl hover:shadow-[0_0_20px_var(--accent-glow)] transition-all">
                Close Details
              </button>
            </div>
          )}
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
