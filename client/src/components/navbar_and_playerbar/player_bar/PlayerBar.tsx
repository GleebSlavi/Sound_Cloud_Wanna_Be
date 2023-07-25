import SongController from "./song_controller/SongController";
import SongData from "./song_data/SongData";
import SongVolume from "./song_volume/SongVolume";
import "./player_bar.css";
import { usePlayerContext } from "../../../provider/PlayerProvider";
import { useEffect, useRef, useState } from "react";

const PlayerBar = () => {
  const { /*currentSong,*/ currentPlaylist, currentPlaylistIndex, 
  isPlaying, currentTime, setCurrentTime, setNextSong } = usePlayerContext();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const currentSong = currentPlaylist.songs[currentPlaylistIndex];
    if (/*currentSong*/ currentSong && audioRef.current) {
      audioRef.current.src = currentSong.cloudUrl;
      if (!isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = currentTime;
      } else {
        audioRef.current.currentTime = currentTime;
        audioRef.current.play();
      }
    }

  }, [currentPlaylist, currentPlaylistIndex, isPlaying])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("ended", setNextSong);
      return () => {
        audioRef.current?.removeEventListener("ended", setNextSong);
      }
    }
  }, [setNextSong])

  return <div className="player-bar">
    <SongData />
    <SongController />
    <SongVolume />
    <audio ref={audioRef} onTimeUpdate={handleTimeUpdate}/>
  </div>;
};

export default PlayerBar;
