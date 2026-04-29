"use client";

import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from '@/src/components/layouts/NavbarTeacher';
import Footer from "@/src/components/layouts/Footer";

import DashboardView from '@/src/components/teachers/attendance/DashboardView';
import ActiveSessionView from '@/src/components/teachers/attendance/ActiveSessionView';
import StudentListModal from '@/src/components/teachers/attendance/StudentListModal';
import { useTeacherClasses } from '@/src/hooks/useTeacherClasses';

export default function TeacherAttendancePage() {
  const { classes: realClasses, loading, qrSession, startQr, endQr, fetchStudents } = useTeacherClasses();

  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeClassData, setActiveClassData] = useState<any>(null);
  const [modalStudents, setModalStudents] = useState<any[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  // Auto-restore session from hook if returning to page
  React.useEffect(() => {
    if (qrSession && !activeClassData && realClasses.length > 0) {
      const cls = realClasses.find((c: any) => (c._id || c.id) === qrSession.classId);
      if (cls) setActiveClassData(cls);
    }
  }, [qrSession, realClasses, activeClassData]);

  const openStudentList = async (cls: any) => {
    setSelectedClass(cls);
    setIsModalOpen(true);
    setModalLoading(true);
    setModalStudents([]);
    try {
      const classId = cls._id || cls.id;
      if (classId) {
        const students = await fetchStudents(classId);
        setModalStudents(students || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleStartSession = async (cls: any) => {
    try {
      const classId = cls._id || cls.id;
      await startQr(classId);
      setActiveClassData(cls);
    } catch (err: any) {
      console.error('Failed to start QR session', err);
    }
  };

  const handleEndSession = async (completedClass: any, finalPresentCount: number) => {
    if (confirm('Are you sure you want to end this attendance session? The Golden Key will be deactivated immediately.')) {
      try {
        const classId = completedClass._id || completedClass.id;
        await endQr(classId);
        setActiveClassData(null);
      } catch (err: any) {
        console.error('Failed to end QR session', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] relative overflow-hidden flex flex-col text-white font-sans selection:bg-[var(--accent)] selection:text-black">
      {/* Abstract Backgrounds */}
      <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-[var(--accent)]/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <Navbar/>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex-1 flex flex-col">
        <ToastContainer position="top-right" autoClose={2500} theme="dark" pauseOnHover />

        <main className="flex-1 space-y-8 relative z-10 pb-24">
          {qrSession && activeClassData ? (
            <ActiveSessionView session={{ ...activeClassData, id: activeClassData._id || activeClassData.id, ...qrSession }} onEndSession={handleEndSession} />
          ) : (
            <DashboardView 
              classes={realClasses.map((c: any) => {
                const classId = c._id || c.id;
                if (qrSession && classId === qrSession.classId) return { ...c, id: classId, status: 'ongoing' };
                return { ...c, id: classId };
              })} 
              onOpenList={openStudentList} 
              onStartSession={handleStartSession} 
              loading={loading}
            />
          )}

          {/* Centered Student Roster Modal */}
          <StudentListModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            classData={selectedClass} 
            students={modalStudents}
            isLoading={modalLoading}
          />
        </main>
      </div>

      <Footer />
    </div>
  );
}