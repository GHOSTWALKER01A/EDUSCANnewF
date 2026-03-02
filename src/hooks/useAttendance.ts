
'use client'
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { getSocket } from '../lib/socket'
import { useEffect } from 'react'
import type { AttendanceRow, AttendanceSummary } from '../types/attendance'

type QueryParams = { subject?: string; from?: string; to?: string; limit?: number }

async function fetchRows({ pageParam = 1, queryKey }: any) {
  const [_key, params] = queryKey
  const res = await api.get('/api/attendance', { params: { ...params, page: pageParam } })
  return res.data.data // expects { events, page, limit, total }
}

export function useAttendanceRows(params: QueryParams = {}) {
  const qc = useQueryClient()
  const infinite = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ['attendance-rows', params],
    queryFn: ({ pageParam = 1 }) => fetchRows({ pageParam, queryKey: ['attendance-rows', params] }),
    getNextPageParam: (last) => {
      // last: { events, page, limit, total }
      if (!last) return undefined
      const { page = 1, limit = 20, total = 0 } = last.meta || last
      return page * limit < total ? page + 1 : undefined
    },
    staleTime: 30 * 1000,
  })

  useEffect(() => {
    const socket = getSocket()

    const onUpdated = (row: AttendanceRow) => {
      // update in cache: replace if _id matches, else prepend
      qc.setQueryData(['attendance-rows', params], (old: any) => {
        if (!old) return old
        const pages = old.pages.map((p: any) => {
          return { ...p, events: p.events.map((e: AttendanceRow) => e._id === row._id ? row : e) }
        })
        return { ...old, pages }
      })
    }

    const onCreated = (row: AttendanceRow) => {
      qc.setQueryData(['attendance-rows', params], (old: any) => {
        if (!old) return old
        const newPages = [...old.pages]
        newPages[0] = { ...newPages[0], events: [row, ...newPages[0].events] }
        return { ...old, pages: newPages }
      })
    }

    socket.on('attendance:updated', onUpdated)
    socket.on('attendance:created', onCreated)

    return () => {
      socket.off('attendance:updated', onUpdated)
      socket.off('attendance:created', onCreated)
    }
  }, [qc, params])

  return infinite
}

export function useAttendanceSummary() {
  return useQuery<AttendanceSummary>({
    queryKey: ['attendance-summary'],
    queryFn: async () => {
      const res = await api.get('/api/attendance/summary')
      return res.data.data as AttendanceSummary
    },
    staleTime: 15 * 1000,
  })
}

export function useAttendanceSeries() {
  return useQuery({
    queryKey: ['attendance-series'],
    queryFn: async () => {
      const res = await api.get('/api/attendance/series')
      return res.data.data 
    },
    staleTime: 60 * 1000,
  })
}
