'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import type { IAssignment } from '../types'
import { toast } from 'react-toastify'

export function useAssignments() {
  const queryClient = useQueryClient()
  const QUERY_KEY = ['assignments']

  // 1. THE READER (Replaces useEffect, useState, and fetchAssignments)
  const { 
    data: assignments = [], 
    isLoading: loading, 
    error, 
    refetch: fetchAssignments 
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const resp = await api.get('/assignments')
      return resp.data.data as IAssignment[]
    },
    // Optional but recommended: keep data fresh but don't over-fetch
    staleTime: 5 * 60 * 1000, 
  })

  // 2. THE DELETER (Replaces manual state filtering)
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/assignments/${id}`)
      return id
    },
    onSuccess: (deletedId) => {
      // Pessimistic cache update: remove the item from the UI after server confirms
      queryClient.setQueryData<IAssignment[]>(QUERY_KEY, (old) => {
        if (!old) return old
        return old.filter((a) => a._id !== deletedId)
      })
      toast.success('Deleted successfully')
    },
    onError: (err: any) => {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Delete failed')
    }
  })

  // 3. THE SAVER (Replaces manual POST/PUT logic and state prepending/mapping)
  const saveMutation = useMutation({
    mutationFn: async ({ id, fd }: { id?: string; fd: FormData }) => {
      const isUpdate = !!id
      const resp = isUpdate
        ? await api.put(`/assignments/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        : await api.post('/assignments', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      
      return { saved: resp.data.data as IAssignment, isUpdate }
    },
    onSuccess: ({ saved, isUpdate }) => {
      // Instantly inject the new/updated assignment into the cache
      queryClient.setQueryData<IAssignment[]>(QUERY_KEY, (old) => {
        if (!old) return [saved]
        if (isUpdate) {
          return old.map((a) => (a._id === saved._id ? saved : a))
        }
        return [saved, ...old] // Prepend new assignment
      })
      
      toast.success(isUpdate ? 'Assignment updated' : 'Assignment created')
      
      // Optional safety net: trigger a background refetch to ensure perfect sync
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: (err: any) => {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Save failed')
    }
  })

  // 4. ADAPTER FUNCTIONS 
  // These wrap the mutations so your UI components don't need to change how they call them.
  const deleteAssignment = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id)
      return true
    } catch {
      return false
    }
  }

  const saveAssignment = async (id: string | undefined, fd: FormData) => {
    // mutateAsync will throw if the mutation fails, which matches your original throw err behavior
    const { saved } = await saveMutation.mutateAsync({ id, fd })
    return saved
  }

  // NOTE: setAssignments is removed because you should not manually mutate React Query cache outside of the hook.
  // If a component absolutely needs to override data, use queryClient.setQueryData(['assignments'], ...) there.
  return {
    assignments,
    loading,
    error: error ? (error as any)?.response?.data?.message || 'Failed to load assignments' : null,
    fetchAssignments,
    deleteAssignment,
    saveAssignment,
  }
}