export type ScheduleStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled' | 'rescheduled';

export interface SubjectData {
  _id?: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'|'saturday';
  subject: string;
  type: 'academic' | 'arts' | 'pe' | string;
  room: string;
  teacher: string;
  status: ScheduleStatus;
  note?: string;
  rescheduledTo?: string;
}

export interface ScheduleSlot {
  time: string;
  recess?: boolean;
  subjects?: SubjectData[];
}

export interface TeacherSubjectData {
  _id?: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'|'saturday';
  subject: string;
  type: 'academic' | 'arts' | 'pe' | string;
  room: string;
  classGroup: string; // e.g., 'Grade 10-A'
  status: ScheduleStatus;
  note?: string;
  rescheduledTo?: string;
}

export interface TeacherScheduleSlot {
  time: string;
  recess?: boolean;
  subjects?: TeacherSubjectData[];
}
