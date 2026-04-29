export type EventMedia = {
  type: 'image' | 'video' | 'none'
  url?: string
  thumbnailUrl?: string
}

export type EventItem = {
  _id: string
  title: string
  description?: string
  startDate?: string
  date?: string // ISO
  startTime?: string
  time?: string
  location?: string
  category?: string
  mediaUrl?: string
  mediaType?: 'image' | 'video' | 'none'
  media?: EventMedia
  createdBy?: { _id: string; fullname?: string }
  createdAt?: string
}

export type EventMediaType = "image" | "video" | "none";

export type TeacherEvent = {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  startDate: string;   // ISO string
  endDate: string;     // ISO string
  startTime: string;   // e.g. "09:00"
  endTime: string;
  location?: string;
  mediaType?: EventMediaType;
  mediaUrl?: string;    // server-stored URL
  createdAt?: string;
  updatedAt?: string;
};