// "use client"


// import React, { useMemo, useState } from "react";
// import type { Profile, ClassItem, StudentListItem } from "../../types/class.types";
// import { useTeacherClasses } from "../../hooks/useTeacherClasses";
// import QRModal from "./QrModal";
// import StudentInfo from "./StudentInfo";
// import Button from "../UI/Button";
// import api from "../../lib/api";
// import { toast } from "react-toastify"; 
// import { useRouter } from "next/navigation";

// export default function TeacherProfile() {
//   const router = useRouter();
//   const [profile, setProfile] = React.useState<Profile | null>(null);
//   const { classes, loading, qrSession, startQr, endQr, fetchStudents, cancelClass, rescheduleClass } = useTeacherClasses();
//   const [qrOpen, setQrOpen] = useState(false);
//   const [studentsOpen, setStudentsOpen] = useState(false);
//   const [students, setStudents] = useState<StudentListItem[] | null>(null);

//   React.useEffect(() => {
    
//     (async () => {
//       try {
//         const res = await api.get("/users/profile");
//         const d = res.data.data;
//         setProfile({
//           name: d.fullname,
//           id: d.registrationno?.toString(),
//           email: d.email,
//           phone: d.phonenumber,
//           department: d.subject,
//           joinDate: new Date(d.join_date).toISOString().split("T")[0],
//           profilePhoto: d.profilephoto,
//         });
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load profile");
//       }
//     })();
//   }, []);

//   const onStartQr = async (classId: string) => {
//     try {
//       await startQr(classId);
//       setQrOpen(true);
//     } catch (err:any) {
//       toast.error(err?.response?.data?.message || "Failed to start QR");
//     }
//   };

//   const onOpenStudents = async (classId: string) => {
//     try {
//       const list = await fetchStudents(classId);
//       setStudents(list);
//       setStudentsOpen(true);
//     } catch (err) {
//       toast.error("Failed to load students");
//     }
//   };

//   const onEndQr = async () => {
//     try {
//       await endQr();
//       setQrOpen(false);
//       toast.info("QR session ended");
//     } catch (err) {
//       toast.error("Failed to end QR");
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h1 className="text-3xl font-bold text-[var(--accent)]">Teacher Profile</h1>

//       {profile ? (
//         <div className="flex gap-6 mt-6 items-center">
//           <img src={profile.profilePhoto || "/default-avatar.png"} alt="profile" className="w-28 h-28 rounded-full border-4 border-[var(--accent)]" />
//           <div>
//             <div className="text-xl font-semibold">{profile.name}</div>
//             <div className="text-sm text-[var(--text-secondary)]">ID: {profile.id}</div>
//             <div className="text-sm text-[var(--text-secondary)]">{profile.email} • {profile.phone}</div>
//           </div>
//         </div>
//       ) : <div>Loading profile...</div>}

//       <section className="mt-8">
//         <h2 className="text-2xl font-semibold text-[var(--accent)]">Today's Classes</h2>
//         <div className="mt-4 bg-[var(--card-bg)] p-4 rounded">
//           {loading ? <div>Loading classes...</div> : classes.length === 0 ? <div className="p-4">No classes today</div> : (
//             <table className="w-full">
//               <thead>
//                 <tr>
//                   <th className="text-left">Subject</th>
//                   <th>Branch</th>
//                   <th>Date</th>
//                   <th>Time</th>
//                   <th>Room</th>
//                   <th>Present</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {classes.map((c) => (
//                   <tr key={c._id} className="border-t">
//                     <td>{c.subject}</td>
//                     <td>{c.branch}</td>
//                     <td>{new Date(c.date).toLocaleDateString()}</td>
//                     <td>{c.time}</td>
//                     <td>{c.room}</td>
//                     <td>{c.studentsPresent || 0}/{c.totalStudents || 0}</td>
//                     <td className="flex gap-2">
//                       <Button className="bg-[var(--accent)] text-[var(--bg-primary)]" onClick={() => onOpenStudents(c._id)}>Students</Button>
//                       <Button className="bg-[var(--accent)] text-[var(--bg-primary)]" onClick={() => onStartQr(c._id)}>Generate QR</Button>
//                       <Button className="border border-[var(--accent)]" onClick={() => cancelClass(c._id)}>Cancel</Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </section>

//       <QRModal open={qrOpen} session={qrSession} onEnd={onEndQr} onClose={() => setQrOpen(false)} />
//       <StudentInfo open={studentsOpen} students={students} onClose={() => setStudentsOpen(false)} />
//     </div>
//   );
// }
