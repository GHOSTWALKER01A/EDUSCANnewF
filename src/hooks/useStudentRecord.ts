'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { IUser } from '../types/index';

export type StudentsListResponse = {
  students: IUser[];
  page: number;
  perPage: number;
  total: number;
};

export function useStudents({
  page = 1,
  perPage = 20,
  q = '',
  semester,
  branch,
  sortKey,
  sortDir,
}: {
  page?: number;
  perPage?: number;
  q?: string;
  semester?: number | null;
  branch?: string | null;
  sortKey?: string | null;
  sortDir?: 'asc' | 'desc' | null;
}) {
  const queryClient = useQueryClient();

  const query = useQuery<StudentsListResponse>({
    queryKey: ['students', { page, perPage, q, semester, branch, sortKey, sortDir }],
    queryFn: async () => {
      const res = await api.get('/api/student-record', {
        params: { page, perPage, q, semester, branch, sortKey, sortDir },
      });
      return res.data.data as StudentsListResponse;
    },
    
    placeholderData: (previousData) => previousData, 
    staleTime: 30_000,
  });

  const toggleBlock = useMutation({
    mutationFn: async ({ id, blocked }: { id: string; blocked: boolean }) => {
      const res = await api.put(`/api/student-record/${id}/block`, { blocked });
      return res.data.data;
    },

    onMutate: async ({ id, blocked }) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });

      const previous = queryClient.getQueryData<StudentsListResponse>(['students']);

      queryClient.setQueryData<StudentsListResponse>(['students'], (old) => {
        if (!old?.students) return old;

        return {
          ...old,
          students: old.students.map((s) =>
            s._id === id ? { ...s, blocked: blocked } : s
          ),
        };
      });

      return { previous };
    },

    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['students'], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  return {
    query,
    toggleBlock,
  };
}