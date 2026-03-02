
export interface IUser {
  _id: string;
  fullname: string;
  email: string;
  registrationNo?: string;
  phoneNumber: string;
  semester?: number;
  branch?: string;
  grade?: string;
  department?: string;
  profilePhoto?: string;
  macHash?: string | null;
  attendancePercentage?: number;
  riskPercentage?: number;
  blocked?: boolean;
  Id?: string;
  role: 'student' | 'teacher' ;
  joinDate?: string;
}

export interface IAssignment {
  _id: string;
  subject: string;
  description?: string;
  filePreview?: string;
  fileType?: string;
  createdAt?: string;
}

export interface IGradeSubject {
  subject: string;
  midSemester: number;
  practicals: number;
  semesterExam: number;
  finalGrade: number;
}

export interface IGradesSemester {
  semester: number;
  subjects: IGradeSubject[];
}
