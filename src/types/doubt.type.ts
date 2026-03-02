
export type Attachment = {
     url: string;
     fileName?: string;
     fileType?: string;
     publicId?: string }

     
export type DoubtReply = {
  _id?: string;
  by: { _id: string; name: string; role?: string };
  message: string;
  attachments?: Attachment[];
  createdAt?: string;
}
export type DoubtItem = {
  _id: string
  studentId: { _id: string; fullname: string }
  teacherId?: { _id: string; fullname: string }
  subject: string
  description: string
  branch?: string;
  date: string; // ISO or display
  time?: string;
  attachments?: Attachment[];
  status?: 'Pending' | 'Replied' | 'Not Relevant' | string;
  replies?: DoubtReply[];
  createdAt?: string;
}


// export type DoubtItem = {
//   _id: string;
//   studentName: string;
//   studentId?: string;
//   branch?: string;
//   date: string; // ISO or display
//   time?: string;
//   content: string;
//   attachments?: { url: string; fileName?: string; fileType?: string }[];
//   status?: 'Pending' | 'Replied' | 'Not Relevant' | string;
//   replies?: DoubtReply[];
//   createdAt?: string;
// };