// client/src/hooks/useMaterialTeacher.ts
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import api from '../lib/api'; // your axios instance
import type { Material } from '../types/material';

type MaterialsResponse = {
  materials: Material[];
  total: number;
};

export function useMaterialsTeacher(page = 1, perPage = 8, q = '') {
  const qc = useQueryClient();

  const queryKey = ['materials', page, perPage, q];

  const query = useQuery<MaterialsResponse>({
    queryKey,
    queryFn: async () => {
      // ensure same base path for GET/POST
      const res = await api.get('/api/resources',
         { params: { page, perPage, q } });
      // expected server shape: { data: { materials: [...], total: N } } or { data: { resources: [...], total } }
      const payload = res.data?.data ?? res.data;
      // normalize server keys:
      const materials =
        payload?.materials ??
        payload?.resources ??
        (Array.isArray(payload) ? payload : []);
      const total = payload?.total ?? materials.length;
      return { materials, total };
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  // create mutation: POST -> /api/resources (same prefix)
  const create = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post('/api/resources', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // server might return created resource at different paths:
      const created =
        res.data?.data?.resource ?? res.data?.data ?? res.data?.resource ?? res.data;
      return created;
    },

    // we have access to `page`, `perPage`, `q` in the closure to update the correct key
    onSuccess: (created: any) => {
      // Normalize created item
      const newItem: Material = {
        _id: created._id ?? created.id ?? `temp_${Date.now()}`,
        title: created.title ?? created.name ?? 'Untitled',
        description: created.description ?? '',
        category: created.category ?? created.type ?? 'Academic Material',
        fileUrl: created.fileUrl ?? created.file?.url ?? created.filePreview ?? '',
        fileType: created.fileType ?? created.mime ?? created.file?.mime ?? '',
        createdAt: created.createdAt ?? new Date().toISOString(),
        // copy any other props
        ...created,
      };

      // Try to optimistically prepend into the exact current queryKey (current page)
      qc.setQueryData<MaterialsResponse | undefined>(queryKey, (old) => {
        if (!old) return { materials: [newItem], total: 1 };
        // ensure no duplicate by id
        const filtered = (old.materials || []).filter((m) => m._id !== newItem._id);
        return {
          ...old,
          materials: [newItem, ...filtered],
          total: (old.total ?? filtered.length) + 1,
        };
      });

      // Also invalidate overall materials queries to ensure canonical server state eventually
      qc.invalidateQueries({ queryKey: ['materials'] });
    },

    onError: (err) => {
      // optionally display more structured errors here
      console.error('create material error', err);
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/resources/${id}`);
      return id;
    },
    onSuccess: (_, id) => {
      // remove from all cached pages; simplest: invalidate
      qc.invalidateQueries({ queryKey: ['materials'] });
      // Also optimistically remove from this page:
      qc.setQueryData<MaterialsResponse | undefined>(queryKey, (old) => {
        if (!old) return old;
        return { ...old, materials: (old.materials || []).filter((m) => m._id !== id), total: (old.total ?? 1) - 1 };
      });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const res = await api.put(`/api/resources/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // normalize backend response:
      return res.data?.data?.resource ?? res.data?.data ?? res.data;
    },
    onMutate: async ({ id, formData }) => {
      // optimistic update: apply a temporary change while waiting for server
      await qc.cancelQueries({ queryKey });
      const previous = qc.getQueryData<any>(queryKey);
      if (!previous) return { previous };

      // create a shallow copy and replace the item by id with a temporary placeholder
      const next = {
        ...previous,
        materials: (previous.materials || []).map((it: Material) =>
          it._id === id ? { ...it, title: formData.get('title') ?? it.title } : it
        )
      };
      qc.setQueryData(queryKey, next);
      return { previous };
    },
    onError: (err, variables, context: any) => {
      // rollback
      if (context?.previous) qc.setQueryData(queryKey, context.previous);
    },
    onSuccess: (updated: any) => {
      // replace item in cache with server-canonical returned object
      qc.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          materials: (old.materials || []).map((it: Material) =>
            it._id === updated._id || it._id === updated.id ? ({ ...it, ...updated, _id: updated._id ?? updated.id }) : it
          ),
        };
      });
      // also refresh list from server to be safe
      qc.invalidateQueries({ queryKey: ['materials'] });
    },
  });

  return { query, create, remove, update };
}

export default useMaterialsTeacher;
