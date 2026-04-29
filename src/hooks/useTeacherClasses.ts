
import { useCallback, useEffect, useRef, useState } from "react";
import api from "../lib/api";
import type { ClassItem, StudentListItem } from "../types/class.types";

type QrSessionState = { sessionId: string; token: string; classId: string; totpSecret?: string } | null;

export function useTeacherClasses() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [qrSession, setQrSession] = useState<QrSessionState>(null);
  const pollRef = useRef<number | null>(null);

  const fetchToday = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/classes/today");
      setClasses(res.data.data.classes || []);
    } finally {
      setLoading(false);
    }
  }, []);

  const startQr = useCallback(async (classId: string) => {
    if (pollRef.current) { window.clearInterval(pollRef.current); pollRef.current = null; }
    const res = await api.post(`/classes/qr/start/${classId}`);
    const data = res.data.data;
    const sessionId = data.sessionId;
    const token = data.token;
    const totpSecret = data.totpSecret;

    setQrSession({ sessionId, token, classId, totpSecret });

    pollRef.current = window.setInterval(async () => {
      try {
        const poll = await api.get(`/classes/qr/current/${sessionId}`);
        const newToken = poll.data.data.token;
        const newTotpSecret = poll.data.data.totpSecret;
        setQrSession(prev => prev ? { ...prev, token: newToken, totpSecret: newTotpSecret || prev.totpSecret } : null);
      } catch (err) {
        if (pollRef.current) { window.clearInterval(pollRef.current); pollRef.current = null; }
        setQrSession(null);
      }
    }, 15000);
    return { sessionId, token, totpSecret };
  }, []);

  const endQr = useCallback(async (classId?: string) => {
    try {
      if (qrSession?.classId || classId) {
        await api.post(`/classes/qr/end/${classId || qrSession!.classId}`);
      }
    } finally {
      if (pollRef.current) { window.clearInterval(pollRef.current); pollRef.current = null; }
      setQrSession(null);
    }
  }, [qrSession]);

  const fetchStudents = useCallback(async (classId: string): Promise<StudentListItem[]> => {
    const res = await api.get(`/classes/${classId}/students`);
    return res.data.data.students || [];
  }, []);

  const cancelClass = useCallback(async (classId: string) => {
    await api.put(`/classes/cancel/${classId}`);
    await fetchToday();
  }, [fetchToday]);

  const rescheduleClass = useCallback(async (classId: string, newDate: string, newTime: string, newRoom: string) => {
    await api.put(`/classes/reschedule/${classId}`, { newDate, newTime, newRoom });
    await fetchToday();
  }, [fetchToday]);

  const confirmClass = useCallback(async (classId: string) => {
    await api.put(`/classes/confirm/${classId}`);
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
    confirmClass,
  };
}
