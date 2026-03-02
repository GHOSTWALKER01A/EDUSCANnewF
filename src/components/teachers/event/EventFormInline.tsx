
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-[#07152b] to-[#0b2a4b] p-4 rounded-2xl shadow-lg border border-[rgba(255,255,255,0.02)]"
    >
    <form onSubmit={handleSubmit} encType="multipart/form-data"
    className="bg-[var(--card-bg)] p-4 rounded-lg shadow space-y-3"
    >
      <input required value={title} 
      onChange={(e) => setTitle(e.target.value)} 
      placeholder="Title" className="w-full p-2 rounded bg-[var(--bg-primary)]" />
      <textarea value={description} 
      onChange={(e)=> setDescription(e.target.value)} 
      placeholder="Description" className="w-full p-2 rounded bg-[var(--bg-primary)]" rows={3} />
      <div className="grid grid-cols-2 gap-2">
        <input value={category} 
        onChange={(e)=> setCategory(e.target.value)}
         placeholder="Category" className="p-2 rounded bg-[var(--bg-primary)]" />
        <input value={location} 
        onChange={(e)=> setLocation(e.target.value)} 
        placeholder="Location" 
        className="p-2 rounded bg-[var(--bg-primary)]" />
      </div>
      <div className="flex gap-2">
        <DatePicker selected={startDate} 
        onChange={(date:any)=> setStartDate(date)} 
        placeholderText="Start date" 
        className="p-2 rounded bg-[var(--bg-primary)] w-[100%]" />
        <DatePicker selected={endDate} 
        onChange={(date:any)=> setEndDate(date)} 
        placeholderText="End date" 
        className="p-2 rounded bg-[var(--bg-primary)] w-[100%]" />
      </div>
      <div className="flex gap-2">
        <DatePicker selected={startTime} 
        onChange={(d:any)=> setStartTime(d)} 
        showTimeSelect showTimeSelectOnly timeIntervals={15} 
        dateFormat="h:mm aa" placeholderText="Start time"
         className="p-2 rounded bg-[var(--bg-primary)] w-[100%]" />
        <DatePicker selected={endTime}
         onChange={(d:any)=> setEndTime(d)}
          showTimeSelect showTimeSelectOnly timeIntervals={15}
           dateFormat="h:mm aa" placeholderText="End time" 
           className="p-2 rounded bg-[var(--bg-primary)] w-[100%]" />
      </div>

      <div>
        <input type="file" accept="image/*,video/*" onChange={onFile} />
        {preview && <img src={preview} alt="preview" className="w-full h-36 object-contain rounded" />}
      </div>

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded border">Cancel</button>
        <button type="submit" disabled={saving} 
        className="px-4 py-2 rounded bg-[var(--accent)] text-white">
          {saving ? "Saving..." : "Save"}
          </button>
      </div>
    </form>
    </motion.div>
  );
}
