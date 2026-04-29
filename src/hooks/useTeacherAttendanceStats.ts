'use client'

import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export type MonthWiseStat = {
  month: string;
  total: number;
  attended: number;
  rate: number;
};

export type TeacherAttendanceStats = {
  totalClasses: number;
  classesAttended: number;
  rate: number;
  monthWise: MonthWiseStat[];
};

export function useTeacherAttendanceStats() {
  const { data, isLoading, error, refetch } = useQuery<TeacherAttendanceStats>({
    queryKey: ['teacherAttendanceStats'],
    queryFn: async () => {
      const res = await api.get('/teacher/attendance-stats');
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    stats: data,
    loading: isLoading,
    error,
    refetch,
  };
}
