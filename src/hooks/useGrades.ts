import { useState, useEffect, useCallback } from 'react'
import api from '../lib/api'
import { IGradesSemester } from '../types'
import { toast } from 'react-toastify'

export function useGrades() {
  const [grades, setGrades] = useState<IGradesSemester[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGrades = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const resp = await api.get('/grades')
      // Assuming the API returns a structure `{ data: IGradesSemester[] }` or `IGradesSemester[]`
      setGrades(resp.data.data || resp.data || [])
    } catch (err: any) {
      console.error(err)
      setError(err?.response?.data?.message || 'Failed to load grades')
      toast.error('Failed to load grades')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGrades()
  }, [fetchGrades])

  return {
    grades,
    loading,
    error,
    fetchGrades,
    setGrades
  }
}
