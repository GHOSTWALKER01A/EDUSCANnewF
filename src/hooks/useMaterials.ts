// src/hooks/useMaterials.ts
'use client'
import { useEffect } from 'react'
import { useQueryClient, useInfiniteQuery, InfiniteData,useMutation } from '@tanstack/react-query'
import { getSocket } from '../lib/socket'
import api from '../lib/api'
import { Resource } from '../types/resource.type'

type Params = {
  type?: string;
  search?: string;
  limit?: number;
}


export async function fetchResources(params?: Record<string, any>): Promise<Resource[]> {
  const res = await api.get('/api/resources', { params });
  return res.data?.data?.resources || [];
}


export function useMaterials(params: Params = {}) {
  const queryClient = useQueryClient();

  const infiniteQuery = useInfiniteQuery<Resource[], Error, InfiniteData<Resource[]>, [string, Params], number>({
    queryKey: ['materials', params],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchResources({ ...params, page: pageParam, limit: params.limit ?? 12 }),
     getNextPageParam: (lastPage, allPages) => {
   
      if (!lastPage || lastPage.length < (params.limit ?? 12)) return undefined;
      return allPages.length + 1;
    },
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
  });

  useEffect(() => {
    const socket = getSocket();
    const onCreated = (resource: Resource) => {
      
      const matchesType = !params.type || resource.type === params.type;
      const matchesSearch = !params.search || resource.title.toLowerCase().includes(params.search.toLowerCase());
      if (matchesType && matchesSearch) {
        queryClient.setQueryData(['materials', params], (old: any) => {
          if (!old) return old;
       
          const newPages = old.pages ? [...old.pages] : [];
          newPages[0] = [resource, ...(newPages[0] || [])];
          return { ...old, pages: newPages };
        })
      }
    };
    socket.on('resource:created', onCreated);
    return () => { socket.off('resource:created', onCreated); };
  }, [params, queryClient]);

  return infiniteQuery;
}
