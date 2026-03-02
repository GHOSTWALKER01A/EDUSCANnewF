
'use client'
import { useEffect, useState } from 'react'
import api from '../lib/api'
import { StudentMetrics } from '../types/metrics'

const MOCK: StudentMetrics = {
  attendancePercent: 62,
  academicScore: 68,
  feeStatusPercent: 85,
  points: 420,
  tips: [
    { id: 't1', text: 'Attend next 8 classes to reach 75%.' },
    { id: 't2', text: 'Submit pending assignment for Data Structures.' },
    { id: 't3', text: 'Pay pending fees before 10th Jan to avoid penalties.' }
  ],
  risk: 'medium',
  riskExplanation: 'Your risk is medium because: Attendance is 62%.',
  contribution: { attendance: 50, backlogs: 30, fees: 20 },
  checklist: [
    { id: 'c1', text: 'Attend 8 classes', done: false },
    { id: 'c2', text: 'Pay fees of ₹2,500', done: false },
    { id: 'c3', text: 'Submit CS project', done: true }
  ],
  dueFees: [
    { id: 'f1', amount: 2500, dueDate: '2026-01-10', description: 'Semester fee' },
    { id: 'f2', amount: 500, dueDate: '2025-12-31', description: 'Library fine' }
  ],
  attendanceSeries: [
    { date: '2025-08-01', value: 58 },
    { date: '2025-09-01', value: 60 },
    { date: '2025-10-01', value: 61 },
    { date: '2025-11-01', value: 62 }
  ],
  gradesSeries: [
    { date: 'Sem 1', value: 65 },
    { date: 'Sem 2', value: 68 },
    { date: 'Sem 3', value: 72 },
    { date: 'Sem 4', value: 70 }
  ]
}

export function useMetrics() {
  const [metrics, setMetrics] = useState<StudentMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const resp = await api.get('/api/student/metrics') // implement this on backend
        if (!mounted) return
        setMetrics(resp.data.data)
      } catch (err) {
        
        setMetrics(MOCK)
      } finally {
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])
  return { metrics, loading, setMetrics }
}
