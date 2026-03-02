
import { useCallback, useEffect, useRef, useState } from "react";
import api from "../lib/api";
import type { ClassItem, StudentListItem } from "../types/class.types";

type QrSessionState = { sessionId: string; token: string; classId: string } | null;

export function useTeacherClasses() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [qrSession, setQrSession] = useState<QrSessionState>(null);
  const pollRef = useRef<number | null>(null);

  const fetchToday = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/classes/today");
      setClasses(res.data.data.classes || []);
    } finally {
      setLoading(false);
    }
  }, []);

  const startQr = useCallback(async (classId: string) => {
    if (pollRef.current) { window.clearInterval(pollRef.current); pollRef.current = null; }
    const res = await api.post(`/api/classes/qr/start/${classId}`);
    const data = res.data.data;
    const sessionId = data.sessionId;
    const token = data.token;
    setQrSession({ sessionId, token, classId });
    // start polling tokens
    pollRef.current = window.setInterval(async () => {
      try {
        const poll = await api.get(`/classes/qr/current/${sessionId}`);
        const newToken = poll.data.data.token;
        setQrSession(prev => prev ? { ...prev, token: newToken } : null);
      } catch (err) {
        // stop on error
        if (pollRef.current) { window.clearInterval(pollRef.current); pollRef.current = null; }
        setQrSession(null);
      }
    }, 15000);
    return { sessionId, token };
  }, []);

  const endQr = useCallback(async (classId?: string) => {
    try {
      if (qrSession?.classId || classId) {
        await api.post(`/api/classes/qr/end/${classId || qrSession!.classId}`);
      }
    } finally {
      if (pollRef.current) { window.clearInterval(pollRef.current); pollRef.current = null; }
      setQrSession(null);
    }
  }, [qrSession]);

  const fetchStudents = useCallback(async (classId: string): Promise<StudentListItem[]> => {
    const res = await api.get(`/api/classes/${classId}/students`);
    return res.data.data.students || [];
  }, []);

  const cancelClass = useCallback(async (classId: string) => {
    await api.put(`/api/classes/cancel/${classId}`);
    await fetchToday();
  }, [fetchToday]);

  const rescheduleClass = useCallback(async (classId: string, newDate: string, newTime: string, newRoom: string) => {
    await api.put(`/api/classes/reschedule/${classId}`, { newDate, newTime, newRoom });
    await fetchToday();
  }, [fetchToday]);

  useEffect(() => {
    fetchToday();
    return () => {
      if (pollRef.current) { window.clearInterval(pollRef.current); pollRef.current = null; }
    };
  }, [fetchToday]);

  return {
    classes,
    loading,
    qrSession,
    fetchToday,
    startQr,
    endQr,
    fetchStudents,
    cancelClass,
    rescheduleClass,
  };
}
