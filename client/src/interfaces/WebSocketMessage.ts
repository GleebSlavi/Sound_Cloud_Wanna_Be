

export interface WebSocketMessage {
  songId: string;
  isPlaying: boolean;
  songUrl: string;
  currentTime: number;
  songName: string;
  songArtist: string;
  songImageUrl: string | null;
}