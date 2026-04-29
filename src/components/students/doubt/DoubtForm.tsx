// client/src/components/doubt/DoubtForm.tsx
'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { useDoubts } from '../../../hooks/useDoubt'
import {useDropzone} from 'react-dropzone'
import { toast } from 'react-toastify'
import api from '../../../lib/api'

export default function DoubtForm() {
  const [subject, setSubject] = useState('')
  const [teacherId, setTeacherId] = useState('') 
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const { create } = useDoubts()

  useEffect(() => {
    // Fetch teachers dynamically
    const fetchTeachers = async () => {
      try {
        const response = await api.get('/admin/records/teachers')
        if (response.data && response.data.data) {
          setTeachers(response.data.data)
        }
      } catch (err) {
        console.error('Failed to fetch teachers', err)
      }
    }
    fetchTeachers()
  }, [])

  const onDrop = useCallback((accepted: File[]) => {
    setFiles(prev => [...prev, ...accepted])
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'application/pdf': [], 'video/*': [] },
    maxSize: 30 * 1024 * 1024
  })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !description.trim()) { toast.error('Fill subject and description'); return }
    const fd = new FormData()
    if (subject) fd.append('subject', subject)
    if (teacherId) fd.append('teacherId', teacherId)
    fd.append('description', description)
    files.forEach(f => fd.append('attachments', f))
    try {
      await create.mutateAsync(fd)
      toast.success('Doubt submitted')
      setSubject(''); setTeacherId(''); setDescription(''); setFiles([])
    } catch (err:any) {
      toast.error(err.response?.data?.message || 'Failed')
    }
  }

  return (
    <form onSubmit={submit} className="bg-[var(--card-bg)] p-6 rounded-lg shadow space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <select value={subject} onChange={e=>setSubject(e.target.value)}
          className="col-span-2 p-2 rounded border" >
          <option value="">Select Subject Id</option>
          <option value="Maths101">Maths101</option>
          <option value="Physics101">Physics101</option>
          <option value="Chemistry101">Chemistry101</option>
          </select>
        <select value={teacherId} onChange={e=>setTeacherId(e.target.value)}
         className="p-2 rounded border">
          <option value="">Select Teacher (optional)</option>
          {teachers.map(teacher => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.fullname} {teacher.department ? `(${teacher.department})` : ''}
            </option>
          ))}
        </select>
      </div>

      <textarea value={description} onChange={e=>setDescription(e.target.value)} 
      rows={6}
       placeholder="Describe your doubt" className="w-full p-3 rounded border resize-y"></textarea>

      <div>
        <div {...getRootProps()}
         className={`p-4 border-dashed rounded cursor-pointer text-center
          ${isDragActive ? 'border-2 border-[var(--accent)]' : 'border'}`}>
          <input {...getInputProps()} />
          { isDragActive ? <p>Drop files here ...</p> : <p>Attach files (pdf, image, video) — max 30MB</p> }
        </div>
        <div className="mt-3 flex gap-2 flex-wrap">
          {files.map((f, i) => <div key={i} 
          className="p-2 bg-[var(--bg-secondary)] rounded">
            {f.name} <button type="button" 
            onClick={() =>
             setFiles(prev => prev.filter((_,j)=>j!==i))} 
             className="ml-2 text-red-500">
                x
                </button>
                </div>
            )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button type="submit" 
        className="cursor-pointer px-4 py-2 rounded bg-[var(--accent)] text-[var(--bg-primary)]">
            Submit Doubt
            </button>
      </div>
    </form>
  )
}
