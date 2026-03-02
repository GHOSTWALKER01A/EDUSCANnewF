
'use client'
import React, { useState, useMemo } from 'react'
import Navbar from '@/src/components/layouts/Navbar'
import Footer from '@/src/components/layouts/Footerstu'
import AttendanceFilters from '@/src/components/students/attendance/AttendanceFilters'
import AttendanceSummary from '@/src/components/students/attendance/AttendanceSummary'
import AttendanceTable from '@/src/components/students/attendance/AttendanceTable'
import ExportButtons from '@/src/components/students/attendance/ExportButtons'
import QRScannerModal from '@/src/components/students/attendance/QrScannerModal'
import AttendanceCharts from '@/src/components/students/attendance/AttendanceCharts'
import { useAttendanceRows, useAttendanceSummary, useAttendanceSeries } from '@/src/hooks/useAttendance'
import { AttendanceRow } from '@/src/types/attendance'

export default function AttendancePage() {
  const todayIso = new Date().toISOString().slice(0,10)
  const [subject, setSubject] = useState('')
  const [from, setFrom] = useState<string>(new Date(new Date().setDate(new Date().getDate()-30)).toISOString().slice(0,10))
  const [to, setTo] = useState(todayIso)
  const [openQR, setOpenQR] = useState(false)

  const rowsQuery = useAttendanceRows({ subject, from, to, limit: 20 })
  const summaryQ = useAttendanceSummary()
  const seriesQ = useAttendanceSeries()

  const pages = rowsQuery.data?.pages ?? []
  const rows: AttendanceRow[] = pages.flatMap((p:any)=> p.events ?? [])

  const hasMore = rowsQuery.hasNextPage
  const loadMore = () => rowsQuery.fetchNextPage()

  // memoized filtered view
  const filteredRows = useMemo(() => rows, [rows])

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto p-6 mt-16 space-y-6">
        <h1 className="text-3xl font-bold text-[var(--accent)]">My Attendance</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <div className="bg-[var(--card-bg)] p-4 rounded">
              <AttendanceFilters
                subject={subject} setSubject={setSubject}
                from={from} setFrom={setFrom}
                to={to} setTo={setTo}
                onApply={() => rowsQuery.refetch()}
              />
            </div>

            <AttendanceTable rows={filteredRows} onRowClick={(r)=> alert(JSON.stringify(r,null,2))} onLoadMore={loadMore} hasMore={hasMore} />

            <div className="flex justify-between items-center mt-3">
              <ExportButtons rows={filteredRows} />
              <div>
                <button onClick={() => setOpenQR(true)} className="px-4 py-2 rounded bg-[var(--accent)] text-[var(--bg-primary)]">Scan QR</button>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <AttendanceSummary summary={summaryQ.data} />
            <div className="bg-[var(--card-bg)] p-4 rounded">
              <h3 className="text-lg font-semibold text-[var(--accent)] mb-3">Attendance Trend</h3>
              {seriesQ.data ? <AttendanceCharts series={seriesQ.data.attendanceSeries} /> : <p>Loading chart...</p>}
            </div>
          </aside>
        </div>
      </main>

     <QRScannerModal 
     open={openQR} 
     onClose={() => setOpenQR(false)}
     onSuccess={() => rowsQuery.refetch()} />
     
      <Footer/>
    </>
  )
}
