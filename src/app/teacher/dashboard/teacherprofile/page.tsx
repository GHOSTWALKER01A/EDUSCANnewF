"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from '@/src/components/layouts/NavbarTeacher';
import Footer from "@/src/components/layouts/Footer";
import QRModal from "../../../../components/teachers/QrModal";
import StudentInfo from "../../../../components/teachers/StudentInfo";
import { useTeacherClasses } from "../../../../hooks/useTeacherClasses";
import api from "../../../../lib/api";
import type { Profile, StudentListItem } from "../../../../types/class.types";
import { useAuth } from "../../../../context/AuthContext";

// Imported Profile Components
import ProfileHeader from "@/src/components/teachers/profile/ProfileHeader";
import StatsGrid from "@/src/components/teachers/profile/StatsGrid";
import ScheduleTable from "@/src/components/teachers/profile/ScheduleTable";
import AttendanceChart from "@/src/components/teachers/profile/AttendanceChart";
import RescheduleModal from "@/src/components/teachers/profile/RescheduleModal";
import EditProfileModal from "@/src/components/teachers/profile/EditProfileModal";
import DailyScheduleModal from "@/src/components/teachers/profile/DailyScheduleModal";
import AssignmentsModal from "@/src/components/students/AssignmentsModal";
import TeacherAttendanceModal from "@/src/components/teachers/profile/TeacherAttendanceModal";
import { useAssignments } from "@/src/hooks/useAssignments";
import { useDoubtOverview } from "@/src/hooks/useDoubt";
import { useTeacherAttendanceStats } from "@/src/hooks/useTeacherAttendanceStats";

export default function TeacherProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const { logout } = useAuth();
  
  // Custom Hook for class logic
  const { classes, loading, qrSession, startQr, endQr, fetchStudents, rescheduleClass, confirmClass } = useTeacherClasses();
  
  // Custom Hook for assignments
  const { assignments, loading: assignmentsLoading, deleteAssignment, saveAssignment } = useAssignments();
  
  // Custom Hook for doubt overview
  const { count: pendingDoubtsCount } = useDoubtOverview();

  // Custom Hook for teacher attendance stats
  const { stats: attendanceStats } = useTeacherAttendanceStats();

  // UI State
  const [qrOpen, setQrOpen] = useState(false);
  const [studentsOpen, setStudentsOpen] = useState(false);
  const [students, setStudents] = useState<StudentListItem[] | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isAssignmentsModalOpen, setIsAssignmentsModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);

  // Reschedule modal state
  const [rescheduleTarget, setRescheduleTarget] = useState<string | null>(null);
  const [rescheduleForm, setRescheduleForm] = useState({ newDate: "", newTime: "", newRoom: "" });
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/teacher/profile");
        const d = res.data.data || res.data;
        setProfile({
          fullname: d.fullname,
          id: d.registrationNo?.toString(),
          email: d.email,
          phoneNumber: d.phoneNumber,
          department: d.subject,
          joinDate: new Date(d.join_date).toISOString().split("T")[0],
          profilePhoto: d.profilephoto,
        });
      } catch (err: any) {
        console.error("Failed to load profile data", err);
        toast.error("Failed to load profile data");
      }
    };
    fetchProfile();
  }, []);

  // --- Handlers ---
  const onStartQr = async (classId: string) => {
    try {
      await startQr(classId);
      setQrOpen(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to start QR");
    }
  };

  const onOpenStudents = async (classId: string) => {
    try {
      const list = await fetchStudents(classId);
      setStudents(list);
      setStudentsOpen(true);
    } catch (err) {
      toast.error("Failed to load students");
    }
  };

  const onEndQr = async () => {
    try {
      await endQr();
      setQrOpen(false);
      toast.info("QR session ended successfully");
    } catch (err) {
      toast.error("Failed to end QR session");
    }
  };

  const onRescheduleSubmit = async () => {
    if (!rescheduleTarget) return;
    const { newDate, newTime, newRoom } = rescheduleForm;
    if (!newDate || !newTime || !newRoom) {
      toast.warn("Please fill in all reschedule fields.");
      return;
    }
    try {
      await rescheduleClass(rescheduleTarget, newDate, newTime, newRoom);
      toast.success("Class rescheduled!");
      setRescheduleTarget(null);
      setRescheduleForm({ newDate: "", newTime: "", newRoom: "" });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to reschedule class");
    }
  };

  const handleOpenReschedule = (classId: string) => {
    setRescheduleTarget(classId);
    setRescheduleForm({ newDate: "", newTime: "", newRoom: "" });
  };

  const blockVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] relative overflow-x-hidden">
      {/* Global Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none border-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <Navbar/>
      <ToastContainer position="bottom-right"
       autoClose={3000} theme="dark" 
       toastClassName="bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--shadow)]/10" />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 mt-20 md:mt-24 space-y-8 relative z-10 pb-24">
        <motion.div 
           initial="hidden" 
           animate="visible" 
           variants={{
             visible: { transition: { staggerChildren: 0.15 } }
           }}
           className="space-y-8"
        >
        
        {/* Profile Header */}
        <motion.div variants={blockVariants}>
          {profile ? (
            <ProfileHeader 
              profile={profile} 
              onEditClick={() => setIsEditModalOpen(true)} 
              onLogout={logout} 
              onQrClick={() => router.push('/teacher/dashboard/teacherattendance')}
            />
          ) : (
            <div className="h-72 bg-[var(--card-bg)]/40 animate-pulse rounded-3xl flex items-center justify-center text-[var(--text-secondary)] backdrop-blur-xl border border-[var(--shadow)]/10">Loading profile data...</div>
          )}
        </motion.div>

        {/* Quick Summary Cards */}
        <motion.div variants={blockVariants}>
          <StatsGrid 
            onClassesAttendedClick={() => setIsScheduleModalOpen(true)}
            onAssignmentsClick={() => setIsAssignmentsModalOpen(true)} 
            onPendingDoubtsClick={() => router.push('/teacher/dashboard/teacherdoubts')}
            onAttendanceRateClick={() => setIsAttendanceModalOpen(true)}
            pendingDoubtsCount={pendingDoubtsCount}
            classesAttended={attendanceStats?.classesAttended}
            totalClasses={attendanceStats?.totalClasses}
            attendanceRate={attendanceStats?.rate}
            activeAssignmentsCount={assignments?.length || 0}
          />
        </motion.div>

        {/* Today's Schedule Table */}
        <motion.div variants={blockVariants}>
          <ScheduleTable 
            classes={classes} 
            loading={loading} 
            onStartQr={onStartQr} 
            onOpenStudents={onOpenStudents} 
            onOpenReschedule={handleOpenReschedule} 
          />
        </motion.div>

        {/* Attendance Chart */}
        <motion.div variants={blockVariants}>
          <AttendanceChart />
        </motion.div>
        
        </motion.div>
      </main>

      {/* Modals rendered outside main layout flow */}
      {qrOpen && <QRModal open={qrOpen} session={qrSession} onEnd={onEndQr} onClose={() => setQrOpen(false)} />}
      {studentsOpen && <StudentInfo open={studentsOpen} students={students} onClose={() => setStudentsOpen(false)} />}
      
      <RescheduleModal 
        isOpen={!!rescheduleTarget}
        form={rescheduleForm}
        onFormChange={setRescheduleForm}
        onClose={() => setRescheduleTarget(null)}
        onSubmit={onRescheduleSubmit}
      />
      
      <EditProfileModal 
        open={isEditModalOpen} 
        profile={profile} 
        onClose={() => setIsEditModalOpen(false)} 
        onSaved={(updated) => setProfile(updated)} 
      />

      <DailyScheduleModal 
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        classes={classes}
        onOpenReschedule={handleOpenReschedule}
        onOpenStudents={onOpenStudents}
        onConfirmClass={confirmClass}
      />

      <AssignmentsModal
        open={isAssignmentsModalOpen}
        onClose={() => setIsAssignmentsModalOpen(false)}
        assignments={assignments}
        loading={assignmentsLoading}
        onDelete={deleteAssignment}
        onSave={saveAssignment}
      />

      <TeacherAttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        stats={attendanceStats}
      />

      <Footer />
    </div>
  );
}