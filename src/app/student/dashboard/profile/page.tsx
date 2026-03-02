
'use client'
import { useEffect, useState } from 'react'
// import AnimatedBackground from '../../../../components/students/AnimatedBackground'
import LoadingSkeleton from '../../../../components/UI/LoadingSkeleton'
import ProfileHeader from '../../../../components/students/ProfileHeader'
import StatsGrid from '../../../../components/students/StatsGrid'
import QRScannerModal from '../../../../components/students/QrScannerModal'
import EditProfileModal from '../../../../components/students/EditProfileModal'
import api from '../../../../lib/api'
import { IUser, IAssignment } from '../../../../types'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useMetrics } from '../../../../hooks/useMetrics'
import StatsSection from '../../../../components/students/StatsSection'
import FeesSection from '../../../../components/students/FeesSection'
import StatusCard from '../../../../components/students/StatusCard'
import StatusDetail from '../../../../components/students/StatusDetail'

import Footer from '@/src/components/layouts/Footerstu'
import Navbar from '@/src/components/layouts/Navbar'



export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<IUser | null>(null)
  const [assignments, setAssignments] = useState<IAssignment[]>([])
  const [upcomingCount, setUpcomingCount] = useState(0)
  const [avgGrade, setAvgGrade] = useState<number | string>('—')
  const [autoStatus, setAutoStatus] = useState({ checks: 0, total: 15 })
  const [loading, setLoading] = useState(true)
  const [qrOpen, setQrOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  

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
      const resp = await api.get('/api/student/profile')
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

  const fetchAssignments = async () => {
    try {
      const resp = await api.get('/api/assignments')
      setAssignments(resp.data.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const fetchMisc = async () => {
    try {
      const resp = await api.get('/api/schedule/upcoming')
      setUpcomingCount(resp.data.data?.length ?? 0)

      const gresp = await api.get('/api/grades/summary')
      setAvgGrade(gresp.data.data?.avg ?? '—')
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    Promise.all([fetchProfile(), fetchAssignments(), fetchMisc()])
  }, [])

  // handle QR result (scanned string)
  async function onQrResult(data: string) {
    setQrOpen(false)
    try {
      // assume scannedData contains teacherId or vcard -> API call to mark attendance
      // get geolocation then post
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 })
      })
      const { latitude, longitude } = pos.coords
      const resp = await api.post('/api/attendance/scan', { scannedData: data, latitude, longitude })
      toast.success('Attendance marked via QR!')
    } catch (err: any) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Failed to mark attendance')
    }
  }
  const { metrics, loading: metricsLoading } = useMetrics()

   if (!metrics) {
  return <LoadingSkeleton />; 
}

  if (loading) return <LoadingSkeleton />

  if (!profile) return <div className="p-6">Profile not found</div>


  return (
    <>
    <Navbar/>
      <ToastContainer position="top-right" autoClose={3000} />
      {/* <AnimatedBackground /> */}
      <main className="p-8 max-w-[1100px] mx-auto mt-16">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <ProfileHeader profile={profile} onScanClick={() => setQrOpen(true)} onEditClick={() => setEditOpen(true)} onEnrollMac={async () => {
            const mac = prompt('Enter MAC (format XX:XX:XX:XX:XX:XX)')
            if (!mac) return
            try {
              await api.post('/api/attendance/enroll-mac', { macAddress: mac })
              toast.success('MAC enrolled')
              fetchProfile()
            } catch (err) {
              toast.error('MAC enroll failed')
            }
          }} />
          <div className="mt-6">
            <StatsGrid upcomingCount={upcomingCount} assignmentsCount={assignments.length} avgGrade={avgGrade} autoStatus={autoStatus} onAssignmentsClick={() => { /* open modal */ }} onGradesClick={() => { /* open grades */ }} />
          </div>
        </motion.div>
      </main>

      <QRScannerModal open={qrOpen} onClose={() => setQrOpen(false)}
       onResult={onQrResult} onError={(e) => toast.error('Scanner error')} />
      <EditProfileModal open={editOpen} profile={profile} 
      onClose={() => setEditOpen(false)} onSaved={(u) => { setProfile(u); setEditOpen(false) }} />
    
      {metrics && <StatusCard metrics={metrics} />}

    <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <StatsSection attendanceSeries={metrics?.attendanceSeries || []} gradesSeries={metrics?.gradesSeries || []} />
        <div className="mt-6"><StatusDetail metrics={metrics} /></div>
      </div>

      <div className="space-y-6">
        <FeesSection due={metrics.dueFees} />
        
      </div>
    </div>
    <Footer/>
    </>
  )
}
