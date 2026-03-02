
'use client'
import React, { useState } from 'react';
import type { IUser } from '../../../types/index';
import StudentRow from './studentRow';

export default function StudentGroup({
  semester,
  branch,
  students,
  onToggle,
  onView
}: {
  semester: number;
  branch: string;
  students: IUser[];
  onToggle: (id: string, block: boolean) => void;
  onView: (id:string, s:IUser) => void;
}) {
  const [open, setOpen] = useState(true);
  const [version, setVersion] = useState(0);
  const refresh = () => setVersion(v => v+1);

  return (
    <div className="mb-6 border rounded bg-[var(--card-bg)]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-3 bg-[var(--bg-secondary)] flex justify-between items-center"
        aria-expanded={open}
      >
        <div>
          <strong className="text-[var(--accent)]">Semester {semester} • {branch}</strong>
          <div className="text-xs text-[var(--text-secondary)]">{students.length} students</div>
        </div>
        <div className="text-sm">{open ? '▾' : '▸'}</div>
      </button>

      {open && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="p-2">Reg. No</th>
                <th className="p-2">Name</th>
                <th className="p-2">Grade</th>
                <th className="p-2">% Attendance</th>
                <th className="p-2">Risk</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <StudentRow key={s._id} student={s} onToggle={onToggle} 
                onView={(id) => onView(id, s)}  onRefresh={refresh}/>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
