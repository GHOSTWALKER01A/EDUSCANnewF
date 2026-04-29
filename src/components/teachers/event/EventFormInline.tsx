
"use client"
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";

export default function EventFormInline({
  initial,
  onCancel,
  onSave,
  saving
}: {
  initial?: Partial<{
     title:string; 
     description:string;
     category:string;
     startDate: Date|null;
     endDate: Date|null;
     startTime: Date|null;
     endTime: Date|null; 
     location:string; 
     mediaType:string;
     mediaUrl:string;
     }>;
  onCancel: () => void;
  onSave: (fd: FormData) => Promise<void>;
  saving?: boolean;
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [category, setCategory] = useState(initial?.category || "");
  const [startDate, setStartDate] = useState<Date | null>(initial?.startDate || null);
  const [endDate, setEndDate] = useState<Date | null>(initial?.endDate || null);
  const [startTime, setStartTime] = useState<Date | null>(initial?.startTime || null);
  const [endTime, setEndTime] = useState<Date | null>(initial?.endTime || null);
  const [location, setLocation] = useState(initial?.location || "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);


  useEffect(() => {
    setTitle(initial?.title || "");
    setDescription(initial?.description || "");
    setCategory(initial?.category || "");
    setStartDate(initial?.startDate || null);
    setEndDate(initial?.endDate || null);
    setStartTime(initial?.startTime || null);
    setEndTime(initial?.endTime || null);
    setLocation(initial?.location || "");
  }, [initial]);


  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }

   useEffect(() => {
    if (!file) { setPreview(null); return; }
    const r = new FileReader();
    r.onload = () => setPreview(String(r.result));
    r.readAsDataURL(file);
  }, [file]);


  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    fd.append("category", category);
    if (startDate) fd.append("startDate", (startDate as Date).toISOString());
    if (endDate) fd.append("endDate", (endDate as Date).toISOString());
    if (startTime) fd.append("startTime", (startTime as Date).toISOString());
    if (endTime) fd.append("endTime", (endTime as Date).toISOString());
    fd.append("location", location);
    if (file) fd.append("file", file);
    await onSave(fd);
  }

  console.log("Created Event", handleSubmit)

  console.log('Dtails are given', title, description, category,typeof startDate, typeof endDate, typeof startTime, typeof endTime, location, file)

  const inputBaseClasses = "w-full px-4 py-3 bg-[var(--bg-primary)]/50 border border-[var(--border-color)]/30 text-[var(--text-primary)] text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)] transition-all placeholder:text-[var(--text-secondary)]/70";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -10 }}
      className="bg-[var(--card-bg)]/60 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[var(--border-color)]/30 space-y-4"
    >
      <div className="flex items-center justify-between mb-2">
         <h3 className="text-lg font-bold text-[var(--text-primary)]">{initial?.title ? 'Edit Event' : 'Create New Event'}</h3>
      </div>
      
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        
        <div>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event Title" className={inputBaseClasses} />
        </div>
        
        <div>
          <textarea value={description} onChange={(e)=> setDescription(e.target.value)} placeholder="Provide a detailed description..." className={inputBaseClasses} rows={3} />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input value={category} onChange={(e)=> setCategory(e.target.value)} placeholder="Category (e.g., Workshop)" className={inputBaseClasses} />
          <input value={location} onChange={(e)=> setLocation(e.target.value)} placeholder="Location" className={inputBaseClasses} />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <div className="relative w-full">
            <DatePicker selected={startDate} onChange={(date:any)=> setStartDate(date)} placeholderText="Start Date" className={inputBaseClasses} wrapperClassName="w-full" />
           </div>
           <div className="relative w-full">
            <DatePicker selected={endDate} onChange={(date:any)=> setEndDate(date)} placeholderText="End Date" className={inputBaseClasses} wrapperClassName="w-full" />
           </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <div className="relative w-full">
            <DatePicker selected={startTime} onChange={(d:any)=> setStartTime(d)} showTimeSelect showTimeSelectOnly timeIntervals={15} dateFormat="h:mm aa" placeholderText="Start Time" className={inputBaseClasses} wrapperClassName="w-full" />
           </div>
           <div className="relative w-full">
            <DatePicker selected={endTime} onChange={(d:any)=> setEndTime(d)} showTimeSelect showTimeSelectOnly timeIntervals={15} dateFormat="h:mm aa" placeholderText="End Time" className={inputBaseClasses} wrapperClassName="w-full" />
           </div>
        </div>

        <div className="relative">
           <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[var(--border-color)]/30 border-dashed rounded-2xl cursor-pointer bg-[var(--bg-primary)]/30 hover:bg-[var(--bg-primary)]/50 transition-colors">
                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-3 text-[var(--text-secondary)]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                       <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-[var(--text-secondary)]"><span className="font-semibold">Click to upload image/video</span> or drag and drop</p>
                 </div>
                 <input type="file" accept="image/*,video/*" className="hidden" onChange={onFile} />
              </label>
           </div>
           {preview && (
              <div className="mt-4 relative rounded-xl overflow-hidden border border-[var(--border-color)]/20 shadow-inner">
                 <img src={preview} alt="preview" className="w-full h-40 object-cover" />
                 <button type="button" onClick={() => { setFile(null); setPreview(null); }} className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg hover:bg-rose-500/80 transition-colors backdrop-blur-sm">
                   <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>
           )}
        </div>

        <div className="pt-4 flex gap-3 justify-end items-center border-t border-[var(--border-color)]/20">
          <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-[var(--border-color)]/40 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-all font-medium">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--accent)] to-indigo-600 hover:from-indigo-500 hover:to-[var(--accent)] text-white font-medium shadow-lg shadow-[var(--accent)]/20 hover:shadow-[var(--accent)]/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]">
            {saving ? (
               <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : "Save Event"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
