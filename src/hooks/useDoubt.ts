'use client'

import { useInfiniteQuery, useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import api from '../lib/api'
import { getSocket } from '../lib/socket'
import type { DoubtItem } from '../types/doubt.type'

type DoubtsResponse = {
  events: DoubtItem[]
  page: number
  limit: number
  total: number
}

type QueryParams = {
  q?: string
  status?: string
  branch?: string
  semester?: number
  limit?: number
}

async function fetchDoubts({
  pageParam = 1,
  queryKey,
}: any): Promise<DoubtsResponse> {
  const [_key, params] = queryKey

  const res = await api.get('/doubts', {
    params: { ...params, page: pageParam },
  })

  const data = res.data?.data || {}
  const events = data.doubts || data.events || []

  return {
    events,
    page: data.page || 1,
    limit: data.limit || events.length,
    total: data.total || events.length
  }
}

export function useDoubts(params: QueryParams = {}) {
  const qc = useQueryClient()

  const infinite = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ['doubts', params],
    queryFn: ({ pageParam }) =>
      fetchDoubts({ pageParam, queryKey: ['doubts', params] }),

    getNextPageParam: (last) => {
      if (!last) return undefined
      const { page, limit, total } = last
      return page * limit < total ? page + 1 : undefined
    },

    staleTime: 30 * 1000,
  })

  useEffect(() => {
    const socket = getSocket()
    const onUpdated = (doubt: DoubtItem) => {
      qc.setQueryData(['doubts', params], (old: any) => {
        if (!old) return old

        const pages = old.pages.map((p: DoubtsResponse) => ({
          ...p,
          events: p.events.map((d) =>
            d._id === doubt._id ? doubt : d
          ),
        }))

        return { ...old, pages }
      })
    }

  
    const onCreated = (doubt: DoubtItem) => {
      qc.setQueryData(['doubts', params], (old: any) => {
        if (!old) return old

        const pages = [...old.pages]
        pages[0] = {
          ...pages[0],
          events: [doubt, ...pages[0].events],
        }

        return { ...old, pages }
      })
    }

    socket.on('doubt:updated', onUpdated)
    socket.on('doubt:created', onCreated)

    return () => {
      socket.off('doubt:updated', onUpdated)
      socket.off('doubt:created', onCreated)
    }
  }, [qc, params])


  const createReply = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string
      formData: FormData
    }) => {
      const res = await api.post(
        `/doubts/${id}/reply`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      return res.data.data.doubt as DoubtItem
    },

    onSuccess: (updated) => {
      // update cache instantly
      qc.setQueryData(['doubts', params], (old: any) => {
        if (!old) return old

        const pages = old.pages.map((p: DoubtsResponse) => ({
          ...p,
          events: p.events.map((d) =>
            d._id === updated._id ? updated : d
          ),
        }))

        return { ...old, pages }
      })
    },
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/doubts/${id}`)
      return id
    },

    onSuccess: (id) => {
      qc.setQueryData(['doubts', params], (old: any) => {
        if (!old) return old

        const pages = old.pages.map((p: DoubtsResponse) => ({
          ...p,
          events: p.events.filter((d) => d._id !== id),
        }))

        return { ...old, pages }
      })
    },
  })

  const create = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post('/doubts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return (res.data?.data?.doubt || res.data?.data) as DoubtItem
    },
    onSuccess: (newDoubt) => {
      if (!newDoubt) return
      qc.setQueryData(['doubts', params], (old: any) => {
        if (!old || !old.pages || !old.pages[0]) return old

        const pages = [...old.pages]
        pages[0] = {
          ...pages[0],
          events: [newDoubt, ...pages[0].events.filter((d: any) => d._id !== newDoubt._id)],
        }

        return { ...old, pages }
      })
    },
  })

  const update = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const res = await api.put(`/doubts/${id}`, data)
      return res.data?.data?.doubt as DoubtItem
    },
    onSuccess: (updated) => {
      qc.setQueryData(['doubts', params], (old: any) => {
        if (!old) return old
        const pages = old.pages.map((p: DoubtsResponse) => ({
          ...p,
          events: p.events.map((d) => d._id === updated._id ? updated : d),
        }))
        return { ...old, pages }
      })
    }
  })

  return {
  query: infinite,
  create,
  update,
  createReply,
  remove
  }
}

export function useDoubtOverview() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['doubtOverview'],
    queryFn: async () => {
      const res = await api.get('/doubts/overview')
      return res.data?.data?.count || 0
    }
  })

  return {
    count: data || 0,
    loading: isLoading,
    error
  }
}
