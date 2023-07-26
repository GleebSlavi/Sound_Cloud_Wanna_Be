import { ReactNode, createContext, useContext, useState } from "react";
import { Song } from "../interfaces/Song";
import { PlayerContextData } from "../interfaces/PlayerContextData";


const PlayerContext = createContext<PlayerContextData>({
  isPlaying: false,
  setIsPlaying: () => {},
  currentTime: 0,
  setCurrentTime: () => {},
  currentPlaylist: {id: "", songs: []},
  setCurrentPlaylist: () => {},
  currentPlaylistIndex: 0,
  setCurrentPlaylistIndex: () => {},
  setSong: () => {},
  setNextSong: () => {},
  shuffleSongs: () => {return []},
  currentSongId: "",
  setCurrentSongId: () => {},
  isShuffled: false,
  setIsShuffled: () => {},
  originalPlaylist: {id: "", songs: []},
  setOriginalPlaylist: () => {},
  isNewPlaylist: false,
  setIsNewPlaylist: () => {}
});

export const usePlayerContext = () => {
  return useContext(PlayerContext);
}

interface Props {
  children: ReactNode;
}

const PlayerProvider = ({ children }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentPlaylist, setCurrentPlaylist] = useState<{id: string, songs: Song[]}>({id: "", songs: []});
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState<number>(0);
  const [currentSongId, setCurrentSongId] = useState("");
  const [isShuffled, setIsShuffled] = useState(false);
  const [originalPlaylist, setOriginalPlaylist] = useState<{id: string, songs: Song[]}>({id: "", songs: []});
  const [isNewPlaylist, setIsNewPlaylist] = useState(false);

  const setSong = (index: number, condition: boolean, conditionShuffle: boolean) => {
      if (condition) {
        setCurrentPlaylistIndex(index);
        if (!conditionShuffle) {
          setCurrentTime(0);
        }
        setIsPlaying(true);
      } else {
        setCurrentPlaylistIndex(0);
        setIsPlaying(false);
      }
  }

  const setNextSong = () => {
    const nextIndex = currentPlaylistIndex + 1;
    setSong(nextIndex, nextIndex < currentPlaylist.songs.length, false);
  }

  const shuffleSongs = (playFromCurrentPlaylist: boolean, songs: {id: string, songs: Song[]}, index: number): Song[] => {
    const startSong = songs.id === currentPlaylist.id ? currentPlaylist.songs[index] : songs.songs[index];
    const songsToShuffle = playFromCurrentPlaylist
      ? songs.songs.filter(song => song.id !== startSong.id)
      : songs.songs.slice();

    for (let i = songsToShuffle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [songsToShuffle[i], songsToShuffle[j]] = [songsToShuffle[j], songsToShuffle[i]];
    }

    if (playFromCurrentPlaylist) {
      songsToShuffle.unshift(startSong);
    }

    return songsToShuffle;
  }

  return (
    <PlayerContext.Provider value={{
      isPlaying, setIsPlaying, 
      currentTime, setCurrentTime,
      currentPlaylist, setCurrentPlaylist,
      currentPlaylistIndex, setCurrentPlaylistIndex,
      setSong, setNextSong, shuffleSongs, currentSongId,
      setCurrentSongId, isShuffled, setIsShuffled,
      originalPlaylist, setOriginalPlaylist,
      isNewPlaylist, setIsNewPlaylist
    }}>
      {children}
    </PlayerContext.Provider>
  )
}

export default PlayerProvider;