'use client'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

export type ScheduleSubjectInfo = {
  _id: string
  day: string
  subject: string
  type: string
  room: string
  classGroup: string
  teacherId: { fullname: string; profilephoto?: string }
  status: string
  note?: string
  rescheduledTo?: string
}

export type ScheduleTimeSlot = {
  time: string // e.g. "09:00"
  subjects: ScheduleSubjectInfo[]
}

export function useStudentUpcomingSchedule() {
  return useQuery<ScheduleTimeSlot[]>({
    queryKey: ['student-upcoming-schedule'],
    queryFn: async () => {
      const res = await api.get('/schedule/upcoming')
      return res.data.data as ScheduleTimeSlot[]
    },
    staleTime: 60 * 1000,
  })
}
