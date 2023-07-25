import { Song } from "./Song";

type Playlist = {
  id: string;
  songs: Song[]
}

export interface PlayerContextData {
  // currentSong: Song | null;
  // setCurrentSong: (value: Song | null) => void;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  currentTime: number;
  setCurrentTime: (value: number) => void;
  currentPlaylist: Playlist;
  setCurrentPlaylist: (value: Playlist) => void;
  currentPlaylistIndex: number;
  setCurrentPlaylistIndex: (value: number) => void;
  setSong: (value: number, conditionPlay: boolean, conditionShuffle: boolean) => void;
  setNextSong: () => void;
  shuffleSongs: (condition: boolean, songs: Playlist, index: number) => Song[];
  setCurrentSongId: (value: string) => void;
  currentSongId: string;
}