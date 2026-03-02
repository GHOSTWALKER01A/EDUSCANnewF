
'use client'
import AttendanceChart from './AttendanceChart'
import GradesChart from './GradeChart'
import { SeriesPoint } from '../../types/metrics'

export default function StatsSection({ attendanceSeries, gradesSeries }:
   { attendanceSeries: SeriesPoint[], gradesSeries: SeriesPoint[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AttendanceChart data={attendanceSeries} />
      <GradesChart data={gradesSeries} />
    </div>
  )
}
