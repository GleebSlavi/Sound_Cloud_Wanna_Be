import { ReactNode, createContext, useContext, useState, useRef } from "react";
import { Song } from "../interfaces/Song";
import { PlayerContextData } from "../interfaces/PlayerContextData";


const PlayerContext = createContext<PlayerContextData>({
  currentSong: null,
  setCurrentSong: () => {},
  isPlaying: false,
  setIsPlaying: () => {},
  currentTime: 0,
  setCurrentTime: () => {}
});

export const usePlayerContext = () => {
  return useContext(PlayerContext);
}

interface Props {
  children: ReactNode;
}

const PlayerProvider = ({ children }: Props) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <PlayerContext.Provider value={{currentSong, setCurrentSong, isPlaying, setIsPlaying, currentTime, setCurrentTime }}>
      {children}
    </PlayerContext.Provider>
  )
}

export default PlayerProvider;