import { Song } from "./Song";

type Playlist = {
  id: string;
  songs: Song[]
}

export interface PlayerContextData {
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
  currentTime: number;
  setCurrentTime: (value: number) => void;
  currentPlaylist: Playlist;
  setCurrentPlaylist: (value: Playlist) => void;
  currentPlaylistIndex: number;
  setCurrentPlaylistIndex: (value: number) => void;
  setSong: (value: number, conditionPlay: boolean, conditionShuffle: boolean, currentTime: number) => void;
  setNextSong: () => void;
  shuffleSongs: (condition: boolean, songs: Playlist, index: number) => Song[];
  setCurrentSongId: (value: string) => void;
  currentSongId: string;
  isShuffled: boolean;
  setIsShuffled: (value: boolean) => void;
  originalPlaylist: Playlist;
  setOriginalPlaylist: (value: Playlist) => void;
  isNewPlaylist: boolean;
  setIsNewPlaylist: (value: boolean) => void;
  isMuted: boolean;
  setIsMuted: (value: boolean) => void;
  volume: number;
  setVolume: (value: number) => void;
  playingPlaylistId: string;
  setPlayingPlaylistId: (value: string) => void;
}