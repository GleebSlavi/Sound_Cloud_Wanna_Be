

export interface WebSocketMessage {
  isPlaying: boolean;
  songUrl: string;
  currentTime: number;
  songName: string;
  songArtist: string;
  songImageUrl: string | null;
}