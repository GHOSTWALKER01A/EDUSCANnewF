

export type ResourceType = 'Academic Material' | 'Previous year paper' | 'Video' | 'Other';

export type Resource = {
  _id: string;
  title: string;
  description?: string;
  fileUrl?: string;        
  fileType?: string;       
  type: ResourceType;
  uploadedBy?: { _id: string; fullname?: string; };
  createdAt: string;
};
