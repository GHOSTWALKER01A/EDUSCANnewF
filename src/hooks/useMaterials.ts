// src/hooks/useMaterials.ts
'use client'
import { useEffect } from 'react'
import { useQueryClient, useInfiniteQuery, useQuery, useMutation, keepPreviousData, InfiniteData } from '@tanstack/react-query'
import { getSocket } from '../lib/socket'
import api from '../lib/api'
import { Resource } from '../types/resource.type'
import { Material } from '../types/material'

type Params = {
  type?: string;
  search?: string;
  limit?: number;
}

export type MaterialsResponse = {
  materials: Material[];
  total: number;
};

// --- API FETCHERS ---

export async function fetchResources(params?: Record<string, any>): Promise<Resource[]> {
  const res = await api.get('/resources', { params });
  const rawResources = res.data?.data?.resources || res.data?.data?.materials || [];
  return rawResources.map((r: any) => ({
    ...r,
    type: r.resourceType || r.category || r.type,
  }));
}

// Ensure same base path for GET/POST
export async function fetchMaterialsPaginated(page: number, perPage: number, q: string): Promise<MaterialsResponse> {
  const res = await api.get('/resources', { params: { page, perPage, q } });
  const payload = res.data?.data ?? res.data;
  
  const materials = payload?.materials ?? payload?.resources ?? (Array.isArray(payload) ? payload : []);
  const total = payload?.total ?? materials.length;
  
  return { materials, total };
}

// --- STUDENT HOOK: INFINITE SCROLL ---

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
    
    const onCreated = (rawResource: any) => {
      const resource = { ...rawResource, type: rawResource.resourceType || rawResource.category || rawResource.type };
      const matchesType = !params.type || resource.type === params.type;
      const matchesSearch = !params.search || resource.title?.toLowerCase().includes(params.search.toLowerCase());
      if (matchesType && matchesSearch) {
        queryClient.setQueryData(['materials', params], (old: any) => {
          if (!old) return old;
          const newPages = old.pages ? [...old.pages] : [];
          newPages[0] = [resource, ...(newPages[0] || [])];
          return { ...old, pages: newPages };
        });
        queryClient.invalidateQueries({ queryKey: ['materials_paginated'] });
      }
    };

    const onDeleted = ({ id }: { id: string }) => {
      queryClient.setQueryData(['materials', params], (old: any) => {
        if (!old || !old.pages) return old;
        const newPages = old.pages.map((page: Resource[]) => page.filter(r => r._id !== id));
        return { ...old, pages: newPages };
      });
      queryClient.invalidateQueries({ queryKey: ['materials_paginated'] });
    };

    const onUpdated = (rawResource: any) => {
      const resource = { ...rawResource, type: rawResource.resourceType || rawResource.category || rawResource.type };
      queryClient.setQueryData(['materials', params], (old: any) => {
        if (!old || !old.pages) return old;
        const newPages = old.pages.map((page: Resource[]) => page.map(r => r._id === resource._id ? { ...r, ...resource } : r));
        return { ...old, pages: newPages };
      });
      queryClient.invalidateQueries({ queryKey: ['materials_paginated'] });
    };

    socket.on('resource:created', onCreated);
    socket.on('resource:deleted', onDeleted);
    socket.on('resource:updated', onUpdated);
    
    return () => { 
      socket.off('resource:created', onCreated); 
      socket.off('resource:deleted', onDeleted);
      socket.off('resource:updated', onUpdated);
    };
  }, [params, queryClient]);

  return infiniteQuery;
}

// --- TEACHER HOOK: PAGINATED ---

export function useMaterialsPaginated(page = 1, perPage = 8, q = '') {
  const queryKey = ['materials_paginated', page, perPage, q];

  return useQuery<MaterialsResponse>({
    queryKey,
    queryFn: () => fetchMaterialsPaginated(page, perPage, q),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

// --- TEACHER HOOK: MUTATIONS ---

export function useMaterialMutations(page = 1, perPage = 8, q = '') {
  const qc = useQueryClient();
  const paginatedQueryKey = ['materials_paginated', page, perPage, q];

  const create = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post('/resources', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data?.data?.resource ?? res.data?.data ?? res.data?.resource ?? res.data;
    },
    onSuccess: (created: any) => {
      const newItem: Material = {
        _id: created._id ?? created.id ?? `temp_${Date.now()}`,
        title: created.title ?? created.name ?? 'Untitled',
        description: created.description ?? '',
        category: created.category ?? created.type ?? 'Academic Material',
        fileUrl: created.fileUrl ?? created.file?.url ?? created.filePreview ?? '',
        fileType: created.fileType ?? created.mime ?? created.file?.mime ?? '',
        createdAt: created.createdAt ?? new Date().toISOString(),
        ...created,
      };

      // Optimistic update for paginated key
      qc.setQueryData<MaterialsResponse | undefined>(paginatedQueryKey, (old) => {
        if (!old) return { materials: [newItem], total: 1 };
        const filtered = (old.materials || []).filter((m) => m._id !== newItem._id);
        return {
          ...old,
          materials: [newItem, ...filtered],
          total: (old.total ?? filtered.length) + 1,
        };
      });

      // Invalidate both query keys properly
      qc.invalidateQueries({ queryKey: ['materials'] });
      qc.invalidateQueries({ queryKey: ['materials_paginated'] });
    },
    onError: (err) => {
      console.error('create material error', err);
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/resources/${id}`);
      return id;
    },
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['materials'] });
      qc.invalidateQueries({ queryKey: ['materials_paginated'] });
      qc.setQueryData<MaterialsResponse | undefined>(paginatedQueryKey, (old) => {
        if (!old) return old;
        return { ...old, materials: (old.materials || []).filter((m) => m._id !== id), total: (old.total ?? 1) - 1 };
      });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const res = await api.put(`/resources/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data?.data?.resource ?? res.data?.data ?? res.data;
    },
    onMutate: async ({ id, formData }) => {
      await qc.cancelQueries({ queryKey: paginatedQueryKey });
      const previous = qc.getQueryData<any>(paginatedQueryKey);
      if (!previous) return { previous };

      const next = {
        ...previous,
        materials: (previous.materials || []).map((it: Material) =>
          it._id === id ? { ...it, title: formData.get('title') ?? it.title } : it
        )
      };
      qc.setQueryData(paginatedQueryKey, next);
      return { previous };
    },
    onError: (err, variables, context: any) => {
      if (context?.previous) qc.setQueryData(paginatedQueryKey, context.previous);
    },
    onSuccess: (updated: any) => {
      qc.setQueryData(paginatedQueryKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          materials: (old.materials || []).map((it: Material) =>
            it._id === updated._id || it._id === updated.id ? ({ ...it, ...updated, _id: updated._id ?? updated.id }) : it
          ),
        };
      });
      qc.invalidateQueries({ queryKey: ['materials'] });
      qc.invalidateQueries({ queryKey: ['materials_paginated'] });
    },
  });

  return { create, remove, update };
}

