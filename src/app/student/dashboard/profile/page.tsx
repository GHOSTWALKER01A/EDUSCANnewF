
'use client'
import { useEffect, useState } from 'react'
import LoadingSkeleton from '../../../../components/UI/LoadingSkeleton'
import ProfileHeader from '../../../../components/students/ProfileHeader'
import StatsGrid from '../../../../components/students/StatsGrid'
import dynamic from 'next/dynamic'
const QRScannerModal = dynamic(() => import('@/src/components/students/attendance/QrScannerModal'), { ssr: false })
import EditProfileModal from '../../../../components/students/EditProfileModal'
import AssignmentsModal from '../../../../components/students/AssignmentsModal'
import GradesModal from '../../../../components/students/GradesModal'
import AttendanceModal from '../../../../components/students/AttendanceModal'
import EnrollMacModal from '../../../../components/students/EnrollMacModal'
import { useAssignments } from '../../../../hooks/useAssignments'
import api from '../../../../lib/api'
import { IUser, IAssignment } from '../../../../types'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/navigation'
import { motion, Variants } from 'framer-motion'
import { useAuth } from '../../../../context/AuthContext'
import { useMetrics } from '../../../../hooks/useMetrics'
import { useGrades } from '../../../../hooks/useGrades'
import StatsSection from '../../../../components/students/StatsSection'
import FeesSection from '../../../../components/students/FeesSection'
import StatusCard from '../../../../components/students/StatusCard'
import StatusDetail from '../../../../components/students/StatusDetail'
import { useAttendanceSummary } from '../../../../hooks/useAttendance'

import Footer from '@/src/components/layouts/Footerstu'
import NavBar from '@/src/components/layouts/Navbar'


export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<IUser | null>(null)
  const { assignments, loading: assignmentsLoading, deleteAssignment, saveAssignment } = useAssignments()

  const [upcomingCount, setUpcomingCount] = useState(0)
  const [avgGrade, setAvgGrade] = useState<number | string>('—')
  const [autoStatus, setAutoStatus] = useState({ present: 0, total: 15 })
  const [loading, setLoading] = useState(true)
  const [qrOpen, setQrOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [assignmentsOpen, setAssignmentsOpen] = useState(false)
  const [gradesOpen, setGradesOpen] = useState(false)
  const [attendanceOpen, setAttendanceOpen] = useState(false)
  const [enrollMacOpen, setEnrollMacOpen] = useState(false)
  const { token, user } = useAuth()
  const { grades, loading: gradesLoading } = useGrades()
  const { data: attendanceSummary } = useAttendanceSummary()
  

  // socket: react to presence-checks and attendance
  useEffect(() => {
    if (!token) return
    const socket = (window as any).io?.connect ? (window as any)
    .io.connect(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', { auth: { token } }) : null
    if (socket) {
      socket.on('presence-check', (d: any) => toast.info(d.message))
      socket.on('attendance-marked', () => {
        toast.success('Auto attendance marked!')
        fetchProfile()
      })
      return () => socket.disconnect()
    }
  }, [token])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const resp = await api.get('/student/profile')
      setProfile(resp.data.data || resp.data)
    } catch (err: any) {
      console.error(err)
      toast.error('Failed to fetch profile')
      // if unauthorized redirect to login
      if (err?.response?.status === 401) router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchMisc = async () => {
    try {
      const resp = await api.get('/schedule/upcoming')
      setUpcomingCount(resp.data.data?.length ?? 0)

      const gresp = await api.get('/grades/summary')
      setAvgGrade(gresp.data.data?.avg ?? '—')
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    Promise.all([fetchProfile(), fetchMisc()])
  }, [])


  const { metrics, loading: metricsLoading } = useMetrics()

   if (!metrics) {
  return <LoadingSkeleton />; 
}

  if (loading) return <LoadingSkeleton />

  if (!profile) return <div className="p-6">Profile not found</div>


  const blockVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)]
     relative overflow-x-hidden">
    
       {/* Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none border-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-3xl" />
      </div>
      <NavBar/>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      
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
            <ProfileHeader 
              profile={profile} 
              onScanClick={() => setQrOpen(true)} 
              onEditClick={() => setEditOpen(true)} 
              onEnrollMac={() => setEnrollMacOpen(true)} 
              
            />
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={blockVariants}>
            <StatsGrid 
              upcomingCount={upcomingCount} 
              assignmentsCount={assignments.length} 
              avgGrade={avgGrade} 
              attendanceRate={attendanceSummary?.attendanceRate || 0} 
              onAssignmentsClick={() => setAssignmentsOpen(true)} 
              onGradesClick={() => setGradesOpen(true)} 
              onAttendanceClick={() => setAttendanceOpen(true)}
            />
          </motion.div>

          {/* Main Status Card */}
          {metrics && (
             <motion.div variants={blockVariants}>
               <StatusCard metrics={metrics} />
             </motion.div>
          )}

          {/* Bottom Grid for Charts & Fees */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div variants={blockVariants} className="lg:col-span-2 space-y-8">
              <StatsSection attendanceSeries={metrics?.attendanceSeries || []} gradesSeries={metrics?.gradesSeries || []} />
              <StatusDetail metrics={metrics} />
            </motion.div>

            <motion.div variants={blockVariants} className="space-y-8">
              <div className="bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)]/30 rounded-3xl p-6 sm:p-8 shadow-xl shadow-black/5 mt-6 lg:mt-0 h-full flex flex-col">
                 <FeesSection due={metrics.dueFees} />
              </div>
            </motion.div>
          </div>

        </motion.div>
      </main>

     <QRScannerModal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        onSuccess={() => { 
          setQrOpen(false); 
          fetchProfile();
          fetchMisc();
        }}
      />
      <EditProfileModal open={editOpen} profile={profile} 
      onClose={() => setEditOpen(false)} onSaved={(u) => { setProfile(u); setEditOpen(false) }} />
      <AssignmentsModal 
        open={assignmentsOpen} 
        onClose={() => setAssignmentsOpen(false)} 
        assignments={assignments} 
        loading={assignmentsLoading}
        onDelete={deleteAssignment}
        onSave={saveAssignment}
      />
      <GradesModal open={gradesOpen} onClose={() => setGradesOpen(false)} grades={grades} loading={gradesLoading} />
      <AttendanceModal open={attendanceOpen} onClose={() => setAttendanceOpen(false)} />
      <EnrollMacModal open={enrollMacOpen} onClose={() => setEnrollMacOpen(false)} onEnrolled={fetchProfile} />
    
      <Footer/>
    </div>
    </>
  )
}
