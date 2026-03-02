'use client'
import React, { useMemo, useState } from 'react';
import { useStudents } from '../../../../hooks/useStudentRecord';
import StudentGroup from '../../../../components/teachers/studentRecord/studentGroup';
import { IUser } from '../../../../types/index';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../../lib/api';
import { CSVLink } from 'react-csv';
import SearchBar  from '../../../../components/teachers/studentRecord/SearchBar';
import Navbar from '@/src/components/layouts/NavbarTeacher';

export default function StudentRecordPage() {
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [q, setQ] = useState('');
  const [semester, setSemester] = useState<number | null>(null);
  const [branch, setBranch] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>(null);
  const { query, toggleBlock } = useStudents({ page, perPage, q,
     semester: semester ?? undefined, branch: branch ?? undefined, sortKey, sortDir });

  const data = query.data ?? { students: [], page: 1, perPage, total: 0 };

 
  const grouped = useMemo(() => {
    const groups = new Map<number, Map<string, IUser[]>>();
    (data.students || []).forEach((s) => {
      const sem = Number(s.semester ?? 0);
      const br = s.branch ?? 'Unknown';
      if (!groups.has(sem)) groups.set(sem, new Map());
      const m = groups.get(sem)!;
      if (!m.has(br)) m.set(br, []);
      m.get(br)!.push(s);
    });
    return groups;
  }, [data.students]);

  const handleBlock = async (id: string, blocked: boolean) => {
    try {
      await toggleBlock.mutateAsync({ id, blocked });
      toast.success(blocked ? 'Student blocked' : 'Student unblocked');
    } catch (err:any) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed');
    }
  };

  const handleView = (id: string, s: IUser) => {
  
    window.alert(`Open student ${s.fullname} (${s.registrationNo}) — implement detail modal`);
  };

  
  const csvData = (data.students || []).map(s => ({
    regNo: s.registrationNo,
    name: s.fullname,
    semester: s.semester,
    branch: s.branch,
    attendance: s.attendancePercentage ?? 0,
    risk: (() => {
      const a = s.attendancePercentage ?? 0;
      if (a >= 90) return 'Low';
      if (a >= 80) return 'Low-Medium';
      if (a >= 70) return 'Medium';
      if (a >= 60) return 'High';
      return 'Very High';
    })(),
  }));

  return (
    <>
    <Navbar/>
    <div className="p-6 max-w-6xl mt-16 mx-auto">
      <ToastContainer position="top-right" autoClose={2500} />
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--accent)]">Student Records</h1>

        <div className="flex gap-3">
          <SearchBar
              value={q}
              onChange={(val) => setQ(val)}        
              onSearch={(val) => { setQ(val); setPage(1); }} 
              placeholder="Search by regNo or name..."
           />
          <select value={semester ?? ''} onChange={(e) => setSemester(e.target.value ? Number(e.target.value) : null)} className="px-2 py-2 rounded bg-[var(--bg-primary)]">
            <option value="">All Semesters</option>
            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={branch ?? ''} onChange={(e) => setBranch(e.target.value || null)} className="px-2 py-2 rounded bg-[var(--bg-primary)]">
            <option value="">All Branches</option>
            {['CSE','IT','ECE','EE','MECH','CIVIL'].map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          <CSVLink data={csvData} filename={`students_page${page}.csv`} className="px-3 py-2 rounded bg-[var(--accent)] text-white">Export CSV</CSVLink>
        </div>
      </header>

      <main>
        {Array.from(grouped.entries()).length === 0 ? (
          <div className="text-[var(--text-secondary)] p-4">No students found.</div>
        ) : (
          Array.from(grouped.entries()).sort((a,b)=> a[0]-b[0]).map(([sem, map]) => (
            <div key={sem} className="mb-8">
              <h2 className="text-xl font-semibold text-[var(--accent)] mb-3">Semester {sem}</h2>
              {Array.from(map.entries()).sort().map(([br, list]) => (
                <StudentGroup key={`${sem}-${br}`} semester={sem} branch={br} 
                students={list} onToggle={handleBlock} onView={handleView} />
              ))}
            </div>
          ))
        )}
      </main>

      <footer className="mt-6 flex items-center justify-between">
        <div className="text-sm text-[var(--text-secondary)]">Showing {data.students.length} of {data.total} students</div>
        <div className="flex gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} 
          className="px-3 py-1 rounded bg-[var(--bg-secondary)]">Prev</button>
          <span className="px-2 py-1 text-sm">Page {data.page}</span>
          <button onClick={() => setPage(p => p + 1)} 
          className="px-3 py-1 rounded bg-[var(--bg-secondary)]">Next</button>
        </div>
      </footer>
    </div>
    </>
  );
}
