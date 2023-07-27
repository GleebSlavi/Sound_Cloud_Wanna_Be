import SongController from "./song_controller/SongController";
import SongData from "./song_data/SongData";
import SongVolume from "./song_volume/SongVolume";
import "./player_bar.css";
import { usePlayerContext } from "../../../providers/PlayerProvider";
import { useEffect, useRef, useState } from "react";

const PlayerBar = () => {
  const { currentPlaylist, currentPlaylistIndex, 
  isPlaying, currentTime, setCurrentTime, setNextSong,
  isMuted, volume } = usePlayerContext();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const currentSong = currentPlaylist.songs[currentPlaylistIndex];
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

  }, [currentPlaylistIndex, isPlaying])

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
  }, [audioRef, setNextSong])

  useEffect(() => {
    const audioElement = document.getElementById("audio") as HTMLAudioElement;
    audioElement.volume = volume;
  }, [volume]);

  return <div className="player-bar">
    <SongData />
    <SongController />
    <SongVolume />
    <audio ref={audioRef} id="audio" onTimeUpdate={handleTimeUpdate} muted={isMuted ? true : false}/>
  </div>;
};

export default PlayerBar;
