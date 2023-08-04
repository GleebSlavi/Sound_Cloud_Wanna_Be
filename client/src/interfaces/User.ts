
export interface User {
  id: string;
  username: string;
  imageUrl: string | null;
  isPremium: boolean;
  leftSongs: number;
  role: string;
}