'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { motion, Variants } from 'framer-motion'
import { Filter } from 'lucide-react'
import Navbar from '@/src/components/layouts/Navbar'
import Footer from '@/src/components/layouts/Footerstu'
import AttendanceFilters from '@/src/components/students/attendance/AttendanceFilters'
import QRScannerModal from '@/src/components/students/attendance/QrScannerModal'
import { AttendancePageHeader } from '@/src/components/students/attendance/AttendancePageHeader'
import { LiveSessionCard }      from '@/src/components/students/attendance/LiveSessionCard'
import { OverviewMetricsCard }  from '@/src/components/students/attendance/OverviewMetricsCard'
import { AttendanceTrendCard }  from '@/src/components/students/attendance/AttendanceTrendCard'
import { AttendanceLogCard }    from '@/src/components/students/attendance/AttendanceLogCard'
import { useStudentUpcomingSchedule } from '@/src/hooks/useStudentUpcomingSchedule'
import { useAttendanceRows, useAttendanceSummary, useAttendanceSeries } from '@/src/hooks/useAttendance'
import { AttendanceRow } from '@/src/types/attendance'


const containerVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
}


export default function AttendancePage() {
  const todayIso = new Date().toISOString().slice(0, 10)

  
  const [subject, setSubject] = useState('')
  const [from, setFrom]       = useState<string>(
    new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().slice(0, 10)
  )
  const [to, setTo]           = useState(todayIso)
  const [openQR, setOpenQR]   = useState(false)


  const scheduleQuery = useStudentUpcomingSchedule()
  const rowsQuery     = useAttendanceRows({ subject, from, to, limit: 20 })
  const summaryQ      = useAttendanceSummary()
  const seriesQ       = useAttendanceSeries()

  const pages                      = rowsQuery.data?.pages ?? []
  const rows: AttendanceRow[]      = pages.flatMap((p: any) => p.events ?? [])
  const hasMore                    = rowsQuery.hasNextPage
  const loadMore                   = () => rowsQuery.fetchNextPage()


  const currentPeriod = useMemo(() => {
    if (!scheduleQuery.data) return null
    const now = new Date()
    for (const slot of scheduleQuery.data) {
      const [hourStr, minStr] = slot.time.split(':')
      const start = new Date(now)
      start.setHours(parseInt(hourStr, 10), parseInt(minStr, 10), 0, 0)
      const end = new Date(start)
      end.setMinutes(start.getMinutes() + 60)
      if (now >= start && now < end && slot.subjects.length > 0) {
        const sub = slot.subjects[0]
        return {
          id:          sub._id,
          subject:     sub.subject,
          type:        sub.type,
          time:        `${slot.time} - ${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`,
          room:        sub.room,
          teacherName: sub.teacherId?.fullname || 'Unknown Teacher',
          endTime:     end,
        }
      }
    }
    return null
  }, [scheduleQuery.data])

  
  const [attendanceStats, setAttendanceStats] = useState<Record<string, { checks: number; status: string }>>({})
  const [timeLeft, setTimeLeft]               = useState(0)
  const [nowTick, setNowTick]                 = useState(new Date())

  
  useEffect(() => {
    const interval = setInterval(() => {
      setNowTick(new Date())
      if (currentPeriod) {
        const curr = attendanceStats[currentPeriod.id] ?? { checks: 0, status: 'pending' }
        if (curr.status === 'pending' && curr.checks < 15) {
          setAttendanceStats(prev => ({
            ...prev,
            [currentPeriod.id]: { ...curr, checks: curr.checks + 1 },
          }))
        }
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [currentPeriod, attendanceStats])

  // Time-left countdown (driven by nowTick so it stays in sync)
  useEffect(() => {
    if (currentPeriod) {
      const diffMs = currentPeriod.endTime.getTime() - nowTick.getTime()
      setTimeLeft(Math.max(0, Math.floor(diffMs / 60000)))
    }
  }, [nowTick, currentPeriod])

  
  const currentStats     = currentPeriod
    ? (attendanceStats[currentPeriod.id] ?? { checks: 0, status: 'pending' })
    : { checks: 0, status: 'pending' }

  const isManuallyPresent = currentStats.status === 'present'
  const isAutoPresent     = currentStats.checks >= 12
  const isPresent         = isManuallyPresent || isAutoPresent
  const isClassEndingSoon = timeLeft <= 15
  const needsFailover     = currentStats.checks > 0 && currentStats.checks < 12 && isClassEndingSoon && !isManuallyPresent
  const canScan           = !!currentPeriod && !isPresent

  
  const handleQRSuccess = () => {
    if (currentPeriod) {
      setAttendanceStats(prev => ({
        ...prev,
        [currentPeriod.id]: { ...(prev[currentPeriod.id] ?? { checks: 0 }), status: 'present' },
      }))
    }
    rowsQuery.refetch()
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] relative overflow-x-hidden font-sans selection:bg-[var(--accent)] selection:text-black">

      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <Navbar />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 mt-20 md:mt-24 space-y-10 relative z-10 pb-24">

        {/* Header */}
        <AttendancePageHeader canScan={canScan} onScanClick={() => setOpenQR(true)} />

        {/* Top 2-column grid: Live Session + Filters */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 xl:grid-cols-2 gap-8"
        >
          <motion.div variants={itemVariants}>
            <LiveSessionCard
              currentPeriod={currentPeriod}
              timeLeft={timeLeft}
              checks={currentStats.checks}
              isPresent={isPresent}
              isAutoPresent={isAutoPresent}
              needsFailover={needsFailover}
              onOpenQR={() => setOpenQR(true)}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)]/30 p-6 sm:p-8 rounded-3xl shadow-xl shadow-black/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="flex items-center gap-3 mb-6 border-b border-[var(--border-color)]/20 pb-5 relative z-10">
              <Filter className="w-6 h-6 text-[var(--text-secondary)]" />
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Filter Records</h2>
            </div>
            <div className="relative z-10">
              <AttendanceFilters
                subject={subject} setSubject={setSubject}
                from={from}       setFrom={setFrom}
                to={to}           setTo={setTo}
                onApply={() => rowsQuery.refetch()}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Overview Metrics — full width */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <OverviewMetricsCard summary={summaryQ.data} />
        </motion.div>

        {/* Attendance Trend Chart — full width */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <AttendanceTrendCard series={seriesQ.data?.attendanceSeries} />
        </motion.div>

        {/* Attendance Log Table — full width */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <AttendanceLogCard
            rows={rows}
            hasMore={!!hasMore}
            onLoadMore={loadMore}
            onRowClick={(r) => alert(JSON.stringify(r, null, 2))}
          />
        </motion.div>

      </main>

      <QRScannerModal
        open={openQR}
        onClose={() => setOpenQR(false)}
        onSuccess={() => { setOpenQR(false); handleQRSuccess() }}
      />

      <Footer />
    </div>
  )
}
