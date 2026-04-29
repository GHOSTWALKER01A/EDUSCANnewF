'use client'

import React, { useMemo, useState, useEffect } from 'react';
import { useStudents } from '../../../../hooks/useStudentRecord';
import { useTeachers, ITeacher } from '../../../../hooks/useTeacherRecord';
import { IUser } from '../../../../types/index';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSVLink } from 'react-csv';
import Navbar from '@/src/components/layouts/NavbarTeacher';
import { 
  Download, Filter, GraduationCap, ChevronLeft, ChevronRight, Loader2, 
  Search, Users, BookOpen, Mail, Phone, ShieldAlert, CheckCircle, 
  Briefcase, MoreVertical, Award
} from 'lucide-react';
import clsx from 'clsx';

export default function StudentRecordPage() {
  const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('students');

  // Student States
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [q, setQ] = useState('');
  const [semester, setSemester] = useState<number | null>(null);
  const [branch, setBranch] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>(null);
  
  const { query, toggleBlock } = useStudents({ 
    page, perPage, q,
    semester: semester ?? undefined, branch: branch ?? undefined, sortKey, sortDir 
  });

  const data = query.data ?? { students: [], page: 1, perPage, total: 0 };

  // Teacher States
  const [teacherQ, setTeacherQ] = useState('');
  const [teacherDept, setTeacherDept] = useState<string>('');
  const [teacherStatus, setTeacherStatus] = useState<string>('');
  const [openTeacherMenu, setOpenTeacherMenu] = useState<string | null>(null);

  const { query: teacherQuery, updateStatus: teacherUpdateStatus } = useTeachers({
    search: teacherQ,
    department: teacherDept,
    status: teacherStatus
  });

  useEffect(() => {
    const handleClick = () => setOpenTeacherMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Filter Logic for Teachers
  const filteredTeachers = teacherQuery.data?.data || [];

  const handleStudentBlock = async (id: string, blocked: boolean) => {
    try {
      await toggleBlock.mutateAsync({ id, blocked });
      toast.success(blocked ? 'Student marked as blocked' : 'Student unblocked successfully');
    } catch (err:any) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to update student status');
    }
  };

  const setTeacherNewStatus = async (id: string, newStatus: 'Active' | 'On Leave' | 'Suspended') => {
    try {
      await teacherUpdateStatus.mutateAsync({ id, status: newStatus });
      toast.success(`Teacher status successfully updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update teacher status');
    }
    setOpenTeacherMenu(null);
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 85) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (percentage >= 75) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  const getTeacherStatusColor = (status: string) => {
    if (status === 'Active') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 ring-emerald-500/30';
    if (status === 'On Leave') return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20 ring-yellow-500/30';
    return 'text-red-400 bg-red-500/10 border-red-500/20 ring-red-500/30';
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

  const selectClasses = "appearance-none bg-[#020617]/50 border border-[var(--border-color)]/30 text-[var(--text-primary)] text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all cursor-pointer hover:bg-[var(--bg-secondary)] w-full";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] relative overflow-hidden font-sans text-[var(--text-primary)] selection:bg-[var(--accent)]/20 selection:text-[var(--accent)]">
       {/* Abstract Backgrounds */}
       <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
       <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-[var(--accent)]/10 rounded-full blur-[100px] pointer-events-none" />

       <Navbar />

       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
         <ToastContainer position="top-right" autoClose={3000} theme="dark" pauseOnHover />
         
         <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 fade-in">
            {/* Header & Toggle Section */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[var(--card-bg)]/40 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-[var(--border-color)]/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <div className="flex items-center gap-5">
                <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-indigo-600 items-center justify-center text-white shadow-lg shadow-[var(--accent)]/20 rotate-3">
                   <BookOpen className="w-7 h-7" />
                </div>
                <div>
                   <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--accent)] tracking-tight mb-1">Record Directory</h1>
                   <p className="text-[var(--text-secondary)] font-medium text-sm">Manage, filter, and track all institutional members.</p>
                </div>
              </div>

              {/* Robust Toggle */}
              <div className="flex bg-[#020617]/50 p-1.5 rounded-2xl border border-[var(--border-color)]/30 shadow-inner relative z-0 overflow-hidden w-full sm:w-auto">
                  {/* Sliding Background */}
                  <div 
                    className="absolute inset-y-1.5 w-[calc(50%-6px)] bg-gradient-to-br from-[var(--accent)] to-indigo-600 rounded-xl transition-transform duration-300 ease-out shadow-[var(--glow)] z-0"
                    style={{ transform: activeTab === 'students' ? 'translateX(0)' : 'translateX(calc(100% + 12px))' }}
                  />
                  
                  <button 
                    onClick={() => setActiveTab('students')}
                    className={`relative z-10 flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-colors duration-300 w-full sm:w-40 ${activeTab === 'students' ? 'text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                  >
                    <GraduationCap className="w-4 h-4" /> Students
                  </button>
                  <button 
                    onClick={() => setActiveTab('teachers')}
                    className={`relative z-10 flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-colors duration-300 w-full sm:w-40 ${activeTab === 'teachers' ? 'text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                  >
                    <Users className="w-4 h-4" /> Teachers
                  </button>
              </div>
            </header>

            {/* Advanced Filtering Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[var(--card-bg)]/40 backdrop-blur-xl p-5 rounded-3xl border border-[var(--border-color)]/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all">
              <div className="w-full lg:w-1/3 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[var(--accent)] transition-colors" size={18} />
                <input 
                  type="text" 
                  value={activeTab === 'students' ? q : teacherQ}
                  onChange={(e) => activeTab === 'students' ? (setQ(e.target.value), setPage(1)) : setTeacherQ(e.target.value)}
                  placeholder={`Search ${activeTab === 'students' ? 'students by name or Reg No' : 'teachers by name or ID'}...`}
                  className="w-full pl-11 pr-5 py-3 bg-[#020617]/50 border border-[var(--border-color)]/30 rounded-xl text-sm placeholder-[var(--text-secondary)] text-[var(--text-primary)] focus:bg-[var(--bg-secondary)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none transition-all shadow-inner"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {activeTab === 'students' ? (
                   <>
                    <div className="relative flex-grow sm:flex-grow-0 min-w-[150px]">
                      <select value={semester ?? ''} onChange={(e) => setSemester(e.target.value ? Number(e.target.value) : null)} className={selectClasses}>
                        <option value="">All Semesters</option>
                        {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                      </select>
                      <Filter className="w-4 h-4 text-[var(--text-secondary)] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                    </div>
                    <div className="relative flex-grow sm:flex-grow-0 min-w-[150px]">
                      <select value={branch ?? ''} onChange={(e) => setBranch(e.target.value || null)} className={selectClasses}>
                        <option value="">All Branches</option>
                        {['CSE','IT','ECE','EE','MECH','CIVIL'].map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                      <Filter className="w-4 h-4 text-[var(--text-secondary)] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                    </div>
                    <CSVLink data={csvData} filename={`students_export_p${page}.csv`} className="flex-grow sm:flex-grow-0 flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 whitespace-nowrap">
                       <Download className="w-4 h-4" /> Export CSV
                    </CSVLink>
                   </>
                ) : (
                  <>
                    <div className="relative flex-grow sm:flex-grow-0 min-w-[150px]">
                      <select value={teacherDept} onChange={(e) => setTeacherDept(e.target.value)} className={selectClasses}>
                        <option value="">All Departments</option>
                        {['CSE','IT','ECE','EE','MECH','CIVIL'].map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                      <Filter className="w-4 h-4 text-[var(--text-secondary)] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                    </div>
                    <div className="relative flex-grow sm:flex-grow-0 min-w-[150px]">
                      <select value={teacherStatus} onChange={(e) => setTeacherStatus(e.target.value)} className={selectClasses}>
                        <option value="">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                      <Filter className="w-4 h-4 text-[var(--text-secondary)] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Data Presentation Area */}
            <div className="min-h-[400px] animate-in fade-in duration-500 slide-in-from-bottom-2">
              {activeTab === 'students' ? (
                // STUDENTS VIEW (Using real backend data Hook)
                query.isLoading ? (
                  <div className="flex flex-col items-center justify-center p-12 h-64 text-[var(--text-secondary)] bg-[var(--card-bg)]/40 backdrop-blur-md rounded-3xl border border-[var(--border-color)]/20 shadow-inner">
                    <Loader2 className="w-10 h-10 animate-spin text-[var(--accent)] mb-4" />
                    <span className="font-semibold text-lg">Fetching Records...</span>
                  </div>
                ) : (data.students || []).length === 0 ? (
                   <div className="flex flex-col items-center justify-center p-12 h-64 text-[var(--text-secondary)] bg-[var(--card-bg)]/40 backdrop-blur-md rounded-3xl border border-[var(--border-color)]/20 shadow-inner">
                     <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mb-4">
                       <Search className="w-8 h-8 opacity-50" />
                     </div>
                     <h3 className="text-xl font-bold text-[var(--text-primary)]">No Students Found</h3>
                     <p className="text-sm mt-1">Try adjusting your search query or filters.</p>
                   </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {(data.students || []).map((student: IUser) => (
                       <div key={student._id} className={`bg-[var(--card-bg)]/40 backdrop-blur-xl rounded-3xl border ${student.blocked ? 'border-red-500/30 shadow-[0_4px_20px_rgba(239,68,68,0.1)]' : 'border-[var(--border-color)]/30 hover:shadow-[var(--shadow)]'} p-5 transition-all duration-300 hover:-translate-y-1 flex flex-col relative overflow-hidden group`}>
                          
                          {student.blocked && (
                            <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                              <div className="bg-red-500/80 text-white text-[10px] font-bold uppercase tracking-wider py-1 w-24 text-center absolute top-4 -right-6 rotate-45 shadow-sm">Blocked</div>
                            </div>
                          )}

                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full border-2 border-[var(--border-color)]/50 p-0.5 bg-[var(--bg-secondary)] shadow-inner">
                              <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.fullname || 'STU'}`} alt={student.fullname} className="w-full h-full rounded-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-bold text-[var(--text-primary)] leading-tight truncate">{student.fullname}</h3>
                              <p className="text-xs text-[var(--text-secondary)] font-medium mt-1 tracking-wide">{student.registrationNo}</p>
                            </div>
                          </div>

                          <div className="space-y-2 mb-5">
                            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                              <span className="p-1 rounded-md bg-[var(--bg-secondary)]"><BookOpen className="w-3.5 h-3.5" /></span>
                              Sem {student.semester || 'N/A'} • {student.branch || 'N/A'}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                              <span className="p-1 rounded-md bg-[var(--bg-secondary)]"><Mail className="w-3.5 h-3.5" /></span>
                              <span className="truncate">{student.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                              <span className="p-1 rounded-md bg-[var(--bg-secondary)]"><Phone className="w-3.5 h-3.5" /></span>
                              {student.phoneNumber || 'N/A'}
                            </div>
                          </div>

                          <div className="mt-auto pt-4 border-t border-[var(--border-color)]/20 flex items-center justify-between">
                            <div className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${getAttendanceColor(student.attendancePercentage ?? 100)}`}>
                              {student.attendancePercentage ?? 100}% Attnd.
                            </div>
                            
                            <button 
                              onClick={() => student._id && handleStudentBlock(student._id, !student.blocked)}
                              disabled={toggleBlock.isPending}
                              className={`p-2 rounded-lg border text-sm transition-colors ${student.blocked ? 'bg-[#020617]/50 border-red-500/30 text-red-500 hover:bg-red-500/10' : 'bg-[#020617]/50 border-[var(--border-color)]/30 text-[var(--text-secondary)] hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10'}`}
                              title={student.blocked ? 'Unblock Student' : 'Block Student'}
                            >
                              {student.blocked ? <CheckCircle className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                            </button>
                          </div>
                       </div>
                    ))}
                  </div>
                )
              ) : (
                // TEACHERS VIEW (Using Real Data)
                teacherQuery.isLoading ? (
                  <div className="flex flex-col items-center justify-center p-12 h-64 text-[var(--text-secondary)] bg-[var(--card-bg)]/40 backdrop-blur-md rounded-3xl border border-[var(--border-color)]/20 shadow-inner">
                    <Loader2 className="w-10 h-10 animate-spin text-[var(--accent)] mb-4" />
                    <span className="font-semibold text-lg">Fetching Teachers...</span>
                  </div>
                ) : (
                <div className="space-y-4">
                  {filteredTeachers.length === 0 ? (
                     <div className="flex flex-col items-center justify-center p-12 h-64 text-[var(--text-secondary)] bg-[var(--card-bg)]/40 backdrop-blur-md rounded-3xl border border-[var(--border-color)]/20 shadow-inner">
                       <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mb-4">
                         <Briefcase className="w-8 h-8 opacity-50" />
                       </div>
                       <h3 className="text-lg font-bold text-[var(--text-primary)]">No Teachers Found</h3>
                       <p className="text-sm mt-1">Try adjusting your search criteria or filters.</p>
                     </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredTeachers.map(teacher => (
                         <div key={teacher.id} className="bg-[var(--card-bg)]/40 backdrop-blur-xl rounded-3xl border border-[var(--border-color)]/30 p-5 lg:p-6 transition-all duration-300 hover:shadow-[var(--shadow)] hover:-translate-y-1 relative group overflow-hidden">
                            
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 rounded-bl-full pointer-events-none group-hover:bg-[var(--accent)]/10 transition-colors"></div>

                            <div className="flex justify-between items-start mb-5 relative z-10">
                              <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-2xl border-2 p-0.5 bg-[var(--bg-secondary)] shadow-inner ${teacher.status === 'Active' ? 'border-emerald-500/30' : teacher.status === 'On Leave' ? 'border-yellow-500/30' : 'border-red-500/30'}`}>
                                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${teacher.fullname}&backgroundColor=312e81,4f46e5`} alt={teacher.fullname} className="w-full h-full rounded-xl" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-[var(--text-primary)] leading-tight">{teacher.fullname}</h3>
                                  <p className="text-xs text-[var(--accent)] font-semibold mt-1 uppercase tracking-wider">{teacher.employeeId}</p>
                                </div>
                              </div>
                              <div className="relative">
                                <button 
                                   onClick={(e) => { e.stopPropagation(); setOpenTeacherMenu(openTeacherMenu === teacher.id ? null : teacher.id); }} 
                                   className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
                                >
                                  <MoreVertical className="w-5 h-5" />
                                </button>
                                {openTeacherMenu === teacher.id && (
                                  <div className="absolute right-0 top-full mt-1 w-36 bg-[#020617] border border-[var(--border-color)]/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-20 overflow-hidden animate-in zoom-in-95 duration-200">
                                     <button onClick={(e) => { e.stopPropagation(); setTeacherNewStatus(teacher.id, 'Active'); }} className="w-full text-left px-4 py-2.5 text-xs font-semibold text-emerald-400 hover:bg-[var(--bg-secondary)] transition-colors border-b border-[var(--border-color)]/10">Set Active</button>
                                     <button onClick={(e) => { e.stopPropagation(); setTeacherNewStatus(teacher.id, 'On Leave'); }} className="w-full text-left px-4 py-2.5 text-xs font-semibold text-yellow-400 hover:bg-[var(--bg-secondary)] transition-colors border-b border-[var(--border-color)]/10">Set On Leave</button>
                                     <button onClick={(e) => { e.stopPropagation(); setTeacherNewStatus(teacher.id, 'Suspended'); }} className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-[var(--bg-secondary)] transition-colors">Set Suspended</button>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="space-y-3 mb-6 relative z-10">
                              <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                                <Award className="w-4 h-4 text-[var(--accent)] opacity-70" />
                                <span className="font-medium text-[var(--text-primary)]">{teacher.role}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--border-color)] mx-1"></span>
                                <span>{teacher.department} Dept</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                                <Mail className="w-4 h-4 text-[var(--accent)] opacity-70" />
                                <span className="truncate">{teacher.email}</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                                <Phone className="w-4 h-4 text-[var(--accent)] opacity-70" />
                                <span>{teacher.phone}</span>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-[var(--border-color)]/20 flex items-center justify-between relative z-10">
                              <span className={`px-3 py-1 text-xs font-bold rounded-lg border ring-1 ring-inset shadow-sm ${getTeacherStatusColor(teacher.status)}`}>
                                {teacher.status}
                              </span>
                              
                              <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] bg-[var(--bg-secondary)]/50 px-3 py-1.5 rounded-lg border border-[var(--border-color)]/20 cursor-help" title="Subjects Assigned">
                                <Briefcase className="w-3.5 h-3.5" />
                                {teacher.subjectsCount} Subject{teacher.subjectsCount !== 1 ? 's' : ''}
                              </div>
                            </div>

                         </div>
                      ))}
                    </div>
                  )}
                </div>
                )
              )}
            </div>

            {/* Pagination / Footer */}
            {activeTab === 'students' && !query.isLoading && data.total > 0 && (
               <footer className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[var(--card-bg)]/60 backdrop-blur-xl p-4 px-6 rounded-2xl border border-[var(--border-color)]/30 shadow-lg relative z-20">
                 <div className="text-sm font-medium text-[var(--text-secondary)]">
                   Showing <span className="text-[var(--text-primary)] font-bold">{data.students.length}</span> out of <span className="text-[var(--text-primary)] font-bold">{data.total}</span> records
                 </div>
                 <div className="flex items-center gap-2 bg-[#020617]/50 p-1.5 rounded-xl border border-[var(--border-color)]/20 shadow-inner">
                   <button 
                     onClick={() => setPage(p => Math.max(1, p - 1))} 
                     disabled={page === 1 || query.isFetching}
                     className="p-2 rounded-lg hover:bg-[var(--card-bg)] text-[var(--text-primary)] disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                   >
                     <ChevronLeft className="w-5 h-5" />
                   </button>
                   <div className="px-5 py-1.5 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] font-bold text-sm border border-[var(--accent)]/20 shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                      Page {data.page}
                   </div>
                   <button 
                     onClick={() => setPage(p => p + 1)}
                     disabled={data.students.length < perPage || query.isFetching}
                     className="p-2 rounded-lg hover:bg-[var(--card-bg)] text-[var(--text-primary)] disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                   >
                     <ChevronRight className="w-5 h-5" />
                   </button>
                 </div>
               </footer>
            )}

            {activeTab === 'teachers' && (
              <footer className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[var(--card-bg)]/60 backdrop-blur-xl p-4 px-6 rounded-2xl border border-[var(--border-color)]/30 shadow-lg animate-in fade-in duration-700 relative z-20">
                <div className="text-sm font-medium text-[var(--text-secondary)]">
                  Showing <span className="text-[var(--text-primary)] font-bold">{filteredTeachers.length}</span> out of <span className="text-[var(--text-primary)] font-bold">{teacherQuery.data?.count || filteredTeachers.length}</span> teachers
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
                  <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Live Server Sync</span>
                </div>
              </footer>
            )}
            
         </div>
       </div>
    </div>
  );
}
