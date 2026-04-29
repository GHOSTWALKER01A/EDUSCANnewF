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
      const res = await api.get('/student-record', {
        params: { page, perPage, q, semester, branch, sortKey, sortDir },
      });
      return res.data.data as StudentsListResponse;
    },
    
    placeholderData: (previousData) => previousData, 
    staleTime: 30_000,
  });

  const toggleBlock = useMutation({
    mutationFn: async ({ id, blocked }: { id: string; blocked: boolean }) => {
      const res = await api.put(`/student-record/${id}/block`, { blocked });
      return res.data.data;
    },

    onMutate: async ({ id, blocked }) => {
      // 1. Cancel any outgoing fetches for all student queries
      await queryClient.cancelQueries({ queryKey: ['students'] });

      // 2. Snapshot the state of ALL cached pages/filters for rollback
      const previousQueries = queryClient.getQueriesData<StudentsListResponse>({ 
        queryKey: ['students'] 
      });

      // 3. Optimistically update ALL matching queries
      queryClient.setQueriesData<StudentsListResponse>(
        { queryKey: ['students'] }, // This acts as a partial match now
        (old) => {
          // If this specific cache page doesn't have data, leave it alone
          if (!old?.students) return old;

          return {
            ...old,
            students: old.students.map((s) =>
              s._id === id ? { ...s, blocked: blocked } : s
            ),
          };
        }
      );

      // Return the snapshot of all queries for the onError handler
      return { previousQueries };
    },

    onError: (err, variables, context) => {
      // 4. Rollback: Loop through our snapshot and restore every cache key
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, previousData]) => {
          queryClient.setQueryData(queryKey, previousData);
        });
      }
    },

    onSettled: () => {
      // 5. Always force a background sync with the server to ensure truth
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  return {
    query,
    toggleBlock,
  };
}