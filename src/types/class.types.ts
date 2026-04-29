export type QRSession = {
  sessionId?: string;
  isActive?: boolean;
  startTime?: string;
  endTime?: string;
};

export type ClassItem = {
  _id: string;
  subject: string;
  branch?: string;
  date: string;   // ISO
  time: string;
  room?: string;
  studentsPresent?: number;
  totalStudents?: number;
  classStatus?: 'scheduled'|'rescheduled'|'cancelled';
  qrSession?: QRSession;
  isConfirmed?: boolean;
};



export type Profile = {
  fullname: string;
  id?: string;
  email?: string;
  phoneNumber?: string;
  department?: string;
  joinDate?: string;
  profilePhoto?: string;
};

export type StudentListItem = {
  regNo: string;
  name: string;
  present: boolean;
  method?: string;
};