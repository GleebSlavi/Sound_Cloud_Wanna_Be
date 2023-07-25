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
  shuffleSongs: () => {return []},
  currentSongId: "",
  setCurrentSongId: () => {}
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
  const [currentSongId, setCurrentSongId] = useState("");

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

  const shuffleSongs = (playFromCurrentPlaylist: boolean, songs: Song[], index: number): Song[] => {
    const songsToShuffle = playFromCurrentPlaylist
      ? songs.filter(song => song.id !== currentPlaylist.songs[index].id)
      : songs.slice();

    for (let i = songsToShuffle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [songsToShuffle[i], songsToShuffle[j]] = [songsToShuffle[j], songsToShuffle[i]];
    }

    if (playFromCurrentPlaylist) {
      songsToShuffle.unshift(currentPlaylist.songs[index]);
    }

    console.log(index);
    console.log(currentPlaylist.songs[index]);
    console.log(songsToShuffle[0]);

    return songsToShuffle;
  }

  return (
    <PlayerContext.Provider value={{
      // currentSong, setCurrentSong, 
      isPlaying, setIsPlaying, 
      currentTime, setCurrentTime,
      currentPlaylist, setCurrentPlaylist,
      currentPlaylistIndex, setCurrentPlaylistIndex,
      setSong, setNextSong, shuffleSongs, currentSongId,
      setCurrentSongId
    }}>
      {children}
    </PlayerContext.Provider>
  )
}

export default PlayerProvider;