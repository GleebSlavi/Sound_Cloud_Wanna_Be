import { Song } from "./Song";

export interface PlayerContextData {
  currentSong: Song | null;
  setCurrentSong: (value: Song | null) => void;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  currentTime: number;
  setCurrentTime: (value: number) => void;
}