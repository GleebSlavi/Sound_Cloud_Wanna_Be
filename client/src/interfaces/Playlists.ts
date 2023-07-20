
export interface Playlist {
  id: string;
  userId: string;
  name: string;
  description: string;
  isAllSongs: boolean;
  createDate: string;
  type: string;
  imageUrl: string | null;
}