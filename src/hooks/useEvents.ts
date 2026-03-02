
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import api from "../lib/api";
import { TeacherEvent } from "../types/events.types";

type ListResponse = { events: TeacherEvent[]; total: number };




export function useEvents(page = 1, perPage = 6, q = "") {
  const qc = useQueryClient();
  const query = useQuery<ListResponse>({
    queryKey: ["events", page, perPage, q],
    queryFn: async () => {
      const res = await api.get("/api/events", { params: { page, perPage, q }});
      return res.data.data as ListResponse;
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000
  });

  const create = useMutation({
    mutationFn: async (fd: FormData) => {
      const res = await api.post("/api/events", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return res.data.data.event as TeacherEvent;
    },
    onSuccess: (created) => {
      qc.setQueryData(["events", 1, perPage, ""], (old: any) => {
        if (!old) return { events: [created], total: 1 };
        return { ...old, events: [created, ...old.events], total: (old.total || 0) + 1 };
      });
      qc.invalidateQueries({ queryKey: ["events"] });
    }
  });

  const update = useMutation({
    mutationFn: async ({ id, fd }: { id: string; fd: FormData }) => {
      const res = await api.put(`/api/events/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return res.data.data.event as TeacherEvent;
    },
    onSuccess: (updated) => qc.invalidateQueries({ queryKey: ["events"] })
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/events/${id}`);
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] })
  });

  return { query, create, update, remove };
}
