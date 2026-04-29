'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export type ITeacher = {
  id: string;
  employeeId: string;
  fullname: string;
  department: string;
  role: string;
  status: 'Active' | 'On Leave' | 'Suspended';
  email: string;
  phone: string;
  subjectsCount: number;
};

export type TeachersListResponse = {
  success: boolean;
  count: number;
  data: ITeacher[];
};

export function useTeachers({
  search = '',
  department = '',
  status = '',
}: {
  search?: string;
  department?: string;
  status?: string;
}) {
  const queryClient = useQueryClient();

  const query = useQuery<TeachersListResponse>({
    queryKey: ['teachers', { search, department, status }],
    queryFn: async () => {
      const params: any = {};
      if (search) params.search = search;
      if (department) params.department = department;
      if (status) params.status = status;
      
      const res = await api.get('/admin/records/teachers', { params });
      return res.data as TeachersListResponse;
    },
    placeholderData: (previousData) => previousData, 
    staleTime: 30_000,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'Active' | 'On Leave' | 'Suspended' }) => {
      const res = await api.patch(`/admin/records/teachers/${id}/status`, { status });
      return res.data.data;
    },

    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['teachers'] });

      const previousQueries = queryClient.getQueriesData<TeachersListResponse>({ 
        queryKey: ['teachers'] 
      });

      queryClient.setQueriesData<TeachersListResponse>(
        { queryKey: ['teachers'] },
        (old) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: old.data.map((t) =>
              t.id === id ? { ...t, status: status } : t
            ),
          };
        }
      );

      return { previousQueries };
    },

    onError: (err, variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, previousData]) => {
          queryClient.setQueryData(queryKey, previousData);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });

  return {
    query,
    updateStatus,
  };
}
