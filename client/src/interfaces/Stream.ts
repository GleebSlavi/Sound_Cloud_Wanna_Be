
export interface Stream {
  streamId: string;
  songId: string;
  ownerUsername: string;
  ownerImageUrl: string | null;
  songName: string | null;
  songArtist: string | null;
  listeners: number | null;
}