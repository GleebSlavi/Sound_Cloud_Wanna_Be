
export interface Song {
  id: string;
  userId?: string;
  name: string;
  artist: string;
  releaseYear?: number;
  duration?: number;
  type?: string;
  uploadDate?: string;
  imageUrl: string | null;
  cloudUrl: string;
  uploader?: string;
}