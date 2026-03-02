'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { IUser } from '@/src/types/index'


export default function StudentDetailModal({
  open,
  studentId,
  onClose,
  onUpdated
}: {
  open: boolean
  studentId: string | null
  onClose: () => void
  onUpdated?: (s: IUser) => void
}) {
  const [loading, setLoading] = useState(false)
  const [student, setStudent] = useState<IUser | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) {
      setStudent(null)
      return
    }
    if (!studentId) return
    const cancelToken = axios.CancelToken.source()
    const load = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('accessToken')
        const res = await axios.get(`/api/students/${studentId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          cancelToken: cancelToken.token,
        })
        setStudent(res.data?.data ?? res.data)
      } catch (err: any) {
        if (!axios.isCancel(err)) {
          console.error('Failed to load student', err)
          toast.error(err?.response?.data?.message || 'Failed to load student')
          onClose()
        }
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => cancelToken.cancel()
  }, [open, studentId, onClose])

  if (!open) return null

  const handleToggleBlock = async () => {
    if (!student) return
    const block = !student.blocked
    setSaving(true)
    try {
      const token = localStorage.getItem('accessToken')
      const res = await axios.put(
        `/api/students/${student._id}/block`,
        { block },
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      )
      const updated: IUser = res.data?.data ?? res.data
      setStudent(updated)
      toast.success(block ? 'Student blocked' : 'Student unblocked')
      onUpdated?.(updated)
    } catch (err: any) {
      console.error('Block/unblock failed', err)
      toast.error(err?.response?.data?.message || 'Failed to change block status')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="max-w-3xl w-full bg-[var(--card-bg)] rounded-lg shadow-lg p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--accent)]">
              {loading ? 'Loading...' : student?.fullname ?? 'Student Detail'}
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Reg. No: {student?.registrationNo}</p>
            <p className="text-sm text-[var(--text-secondary)]">
              Joined: {student?.joinDate ? new Date(student.joinDate).toLocaleDateString() : '—'}</p>
          </div>

          <div className="flex gap-2 items-center">
            <button
              onClick={onClose}
              aria-label="Close student detail"
              className="px-3 py-1 rounded bg-gray-700 text-white hover:opacity-90"
            >
              Close
            </button>
            <button
              onClick={handleToggleBlock}
              disabled={saving || loading}
              className={`px-3 py-1 rounded ${student?.blocked ? 'bg-green-600' : 'bg-red-600'} text-white`}
              aria-pressed={student?.blocked}
            >
              {saving ? 'Saving...' : student?.blocked ? 'Unblock' : 'Block'}
            </button>
          </div>
        </div>

        <hr className="my-4 border-[var(--text-secondary)]/20" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-[var(--text-secondary)]">Reg. No</div>
            <div className="font-medium">{student?.registrationNo ?? '—'}</div>

            <div className="text-xs text-[var(--text-secondary)] mt-3">Email</div>
            <div className="font-medium">{student?.email ?? '—'}</div>

            <div className="text-xs text-[var(--text-secondary)] mt-3">Phone</div>
            <div className="font-medium">{student?.phoneNumber ?? '—'}</div>

            <div className="text-xs text-[var(--text-secondary)] mt-3">Branch</div>
            <div className="font-medium">{student?.branch ?? '—'}</div>
          </div>

          <div>
            <div className="text-xs text-[var(--text-secondary)]">Semester</div>
            <div className="font-medium">{student?.semester ?? '—'}</div>

            <div className="text-xs text-[var(--text-secondary)] mt-3">Attendance</div>
            <div className="font-medium">{student?.attendancePercentage ?? 0}%</div>

            <div className="text-xs text-[var(--text-secondary)] mt-3">Grade</div>
            <div className="font-medium">{student?.grade ?? '—'}</div>

            <div className="text-xs text-[var(--text-secondary)] mt-3">Risk of Failure</div>
            <div className="font-medium">
              {/* Example risk computation: high if attendance < 65 or grade poor */}
              {student ? (
                (() => {
                  const att = Number(student.attendancePercentage ?? 0)
                  const risk = att < 65 || (student.grade && ['D', 'F', 'E'].includes(student.grade)) ? 'High' : att < 75 ? 'Medium' : 'Low'
                  return <span className={risk === 'High' ? 'text-red-500' : risk === 'Medium' ? 'text-yellow-400' : 'text-green-500'}>{risk}</span>
                })()
              ) : '—'}
            </div>
          </div>
        </div>

        {/* optional admin actions */}
        <div className="mt-6 text-sm text-[var(--text-secondary)]">
          You can block a student to prevent them from signing in. Use with caution.
        </div>
      </div>
    </div>
  )
}
