import SongController from "./song_controller/SongController";
import SongData from "./song_data/SongData";
import SongVolume from "./song_volume/SongVolume";
import "./player_bar.css";
import { usePlayerContext } from "../../../provider/PlayerProvider";
import { useEffect, useRef, useState } from "react";

const PlayerBar = () => {
  const { currentSong, isPlaying, currentTime, setCurrentTime } = usePlayerContext();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.cloudUrl;
      if (!isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = currentTime;
      } else {
        audioRef.current.currentTime = currentTime;
        audioRef.current.play();
      }
    }

  }, [currentSong, isPlaying])

  useEffect(() => {
    setCurrentTime(0);
  }, [currentSong, setCurrentTime]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      console.log(audioRef.current.currentTime);
    }
  }

  return <div className="player-bar">
    <SongData />
    <SongController />
    <SongVolume />
    <audio ref={audioRef} onTimeUpdate={handleTimeUpdate}/>
  </div>;
};

export default PlayerBar;
