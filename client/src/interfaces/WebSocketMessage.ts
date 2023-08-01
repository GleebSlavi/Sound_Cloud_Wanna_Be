

export interface WebSocketMessage {
  songId: string;
  isPlaying: boolean;
  songUrl: string;
  currentTime: number;
  delay?: number;
  songName: string;
  songArtist: string;
  songImageUrl: string | null;
}