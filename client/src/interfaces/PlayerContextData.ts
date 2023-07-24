import { Song } from "./Song";

export interface PlayerContextData {
  // currentSong: Song | null;
  // setCurrentSong: (value: Song | null) => void;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  currentTime: number;
  setCurrentTime: (value: number) => void;
  currentPlaylist: Song[];
  setCurrentPlaylist: (value: Song[]) => void;
  currentPlaylistIndex: number;
  setCurrentPlaylistIndex: (value: number) => void;
  setSong: (value: number, condition: boolean) => void;
  setNextSong: () => void;
}