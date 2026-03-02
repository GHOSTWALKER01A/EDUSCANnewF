
import { ApiError } from 'next/dist/server/api-utils';
import api from '../lib/api';
import type { IUser } from '../types/index';

type ToggleResponse = {
  success: boolean;
  data?: {
    user?: IUser;
  };
  message?: string;
};

export async function toggleStudentBlock(studentId: string, blocked: boolean): Promise<IUser> {
  if (!studentId) throw new Error('studentId required');
  try {
    const res = await api.put<ToggleResponse>(`/api/student-record/${studentId}/block`, { blocked });
    if (!res?.data?.success) {
      throw new Error(res?.data?.message || 'Failed to toggle block status');
    }
    const user = res.data.data?.user;
    if (!user){
        throw new ApiError(402,'Unexpected response from server (no student returned)')    
    }
    return user;
  } catch (err: any) {
    console.error('Failed to toggle block status', err);
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      'Network or server error while toggling block';
    throw new Error(msg);
  }
}
