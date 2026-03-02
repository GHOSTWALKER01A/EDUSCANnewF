

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused'

export type AttendanceRow = {
  _id: string
  date: string        // ISO date
  subject: string
  time?: string
  room?: string
  status: AttendanceStatus
  notes?: string
  createdAt?: string
}

export type AttendanceSummary = {
  classesAttended: string // like "48/50"
  attendanceRate: number  // 0..100
  lateArrivals: number
  absences: number
  totalClasses: number
}
