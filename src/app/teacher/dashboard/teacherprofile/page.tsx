"use client"



import React, { useState, useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";
import type { Profile, StudentListItem } from "../../../../types/class.types";
import { useTeacherClasses } from "../../../../hooks/useTeacherClasses";
import QRModal from "../../../../components/teachers/QrModal";
import StudentInfo from "../../../../components/teachers/StudentInfo";
import Button from "../../../../components/UI/Button";
import api from "../../../../lib/api";
import { toast,ToastContainer } from "react-toastify"; 
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import NavbarTeacher from '@/src/components/layouts/NavbarTeacher'
import Footer from '@/src/components/layouts/Footer'





export default function TeacherProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const { classes, loading, qrSession, startQr, endQr, fetchStudents, cancelClass, rescheduleClass } = useTeacherClasses();
  const [qrOpen, setQrOpen] = useState(false);
  const [studentsOpen, setStudentsOpen] = useState(false);
  const [students, setStudents] = useState<StudentListItem[] | null>(null);

  
  useEffect(() => {
    
    (async () => {
      try {
        const res = await api.get("/api/student/profile");
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
        console.error(err);
        toast.error("Failed to load profile");
      } 
    })();
  }, []);

  const onStartQr = async (classId: string) => {
    try {
      await startQr(classId);
      setQrOpen(true);
    } catch (err:any) {
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
      toast.info("QR session ended");
    } catch (err) {
      toast.error("Failed to end QR");
    }
  };
  return (
    <>
      <NavbarTeacher />

      <ToastContainer  position="top-right" autoClose={3000} />
    <div className="max-w-6xl mt-16 mx-auto p-6">
      <h1 className="text-3xl font-bold text-[var(--accent)]">Teacher Profile</h1>
     
     
       {profile ? (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--card-bg)] p-6 rounded-xl shadow-[0_8px_20px_var(--shadow)]">
        <div className="flex gap-6 items-center">
        <div className="w-36 h-36 rounded-full border-4 border-[var(--accent)] overflow-hidden">
          {profile.profilePhoto ? (
           
            <img src={profile.profilePhoto} alt="Profile" className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full bg-slate-700 flex items-center justify-center text-white text-xl">{profile.fullname?.[0]}</div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--accent)]">{profile.fullname}</h1>
          <div className="mt-2 text-[var(--text-secondary)] space-y-1">
            <div>Teacher ID: <strong className="text-white">{profile.id}</strong></div>
            <div>Email: <strong className="text-white">{profile.email}</strong></div>
            <div>Phone: <strong className="text-white">{profile.phoneNumber || '—'}</strong></div>
            <div>Department: <strong className="text-white">{profile.department}</strong></div>
            <div>Join Date: <strong className="text-white">{profile.joinDate}</strong></div>
          </div>

          <div className="mt-4 flex gap-3">
     
          </div>
        </div>
        </div>
      </motion.div>
      
      ) : <div>Loading profile...</div>}

  
      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-[var(--accent)]">Today's Classes</h2>
        <div className="mt-4 bg-[var(--card-bg)] p-4 rounded">
          {loading ? <div>Loading classes...</div> : 
          classes.length === 0 ? <div className="p-4">
            No classes today</div> : (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Subject</th>
                  <th>Branch</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Room</th>
                  <th>Present</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((c) => (
                  <tr key={c._id} className="border-t">
                    <td>{c.subject}</td>
                    <td>{c.branch}</td>
                    <td>{new Date(c.date).toLocaleDateString()}</td>
                    <td>{c.time}</td>
                    <td>{c.room}</td>
                    <td>{c.studentsPresent || 0}/{c.totalStudents || 0}</td>
                    <td className="flex gap-2">
                      <Button className="bg-[var(--accent)] text-[var(--bg-primary)]" onClick={() => onOpenStudents(c._id)}>Students</Button>
                      <Button className="bg-[var(--accent)] text-[var(--bg-primary)]" onClick={() => onStartQr(c._id)}>Generate QR</Button>
                      <Button className="border border-[var(--accent)]" onClick={() => cancelClass(c._id)}>Cancel</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
  
     <QRModal open={qrOpen} session={qrSession} onEnd={onEndQr} onClose={() => setQrOpen(false)} />
     <StudentInfo open={studentsOpen} students={students} onClose={() => setStudentsOpen(false)} />
        
    </div>
  


      <Footer/>
    </>
  );
}
