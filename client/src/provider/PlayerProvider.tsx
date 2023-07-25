import { ReactNode, createContext, useContext, useState } from "react";
import { Song } from "../interfaces/Song";
import { PlayerContextData } from "../interfaces/PlayerContextData";


const PlayerContext = createContext<PlayerContextData>({
  // // currentSong: null,
  // // setCurrentSong: () => {},
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
  shuffleSongs: () => {return []}
});

export const usePlayerContext = () => {
  return useContext(PlayerContext);
}

interface Props {
  children: ReactNode;
}

const PlayerProvider = ({ children }: Props) => {
  // // const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentPlaylist, setCurrentPlaylist] = useState<{id: string, songs: Song[]}>({id: "", songs: []});
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState<number>(0);

  const setSong = (index: number, condition: boolean) => {
      if (condition) {
        setCurrentPlaylistIndex(index);
        setCurrentTime(0);
        setIsPlaying(true);
      } else {
        setCurrentPlaylistIndex(0);
        setIsPlaying(false);
      }
  }

  const setNextSong = () => {
    const nextIndex = currentPlaylistIndex + 1;
    setSong(nextIndex, nextIndex < currentPlaylist.songs.length);
  }

  const shuffleSongs = (playFromCurrentPlaylist: boolean, songs: Song[], index: number): Song[] => {
    const songsToShuffle = playFromCurrentPlaylist
      ? songs.filter(song => song.id !== currentPlaylist.songs[index].id)
      : songs.slice();

      console.log(playFromCurrentPlaylist);

    for (let i = songsToShuffle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [songsToShuffle[i], songsToShuffle[j]] = [songsToShuffle[j], songsToShuffle[i]];
    }

    return playFromCurrentPlaylist 
    ? [currentPlaylist.songs[index], ...songsToShuffle]
    : songsToShuffle;
  }

  return (
    <PlayerContext.Provider value={{
      // currentSong, setCurrentSong, 
      isPlaying, setIsPlaying, 
      currentTime, setCurrentTime,
      currentPlaylist, setCurrentPlaylist,
      currentPlaylistIndex, setCurrentPlaylistIndex,
      setSong, setNextSong, shuffleSongs
    }}>
      {children}
    </PlayerContext.Provider>
  )
}

export default PlayerProvider;