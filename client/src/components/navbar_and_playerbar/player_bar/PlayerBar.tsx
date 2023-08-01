import SongController from "./song_controller/SongController";
import SongData from "./song_data/SongData";
import SongVolume from "./song_volume/SongVolume";
import "./player_bar.css";
import { usePlayerContext } from "../../../providers/PlayerProvider";
import { useEffect, useRef } from "react";
import { useStreamContext } from "../../../providers/StreamProvider";
import { WebSocketMessage } from "../../../interfaces/WebSocketMessage";

const PlayerBar = () => {
  const { currentPlaylist, currentPlaylistIndex, 
  isPlaying, currentTime, setCurrentTime, setNextSong,
  isMuted, volume, playingPlaylistId } = usePlayerContext();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { sendData, stompClient, isStreamOwner, setStreamData } = useStreamContext();

  // useEffect(() => {
  //   const currentSong = currentPlaylist.songs[currentPlaylistIndex];
  //   if (currentSong && audioRef.current) {
  //       const dataToSend: WebSocketMessage = {
  //         songId: currentSong.id,
  //         songUrl: currentSong.cloudUrl,
  //         songName: currentSong.name,
  //         songArtist: currentSong.artist,
  //         songImageUrl: currentSong.imageUrl,
  //         isPlaying: isPlaying,
  //         currentTime: currentTime,
  //       }
  //       setStreamData(dataToSend);
  
  //     audioRef.current.src = currentSong.cloudUrl;
  //     if (!isPlaying) {
  //       audioRef.current.pause();
  //       audioRef.current.currentTime = currentTime;
  //       if (isStreamOwner) {
  //       const updatedData: WebSocketMessage = {
  //         ...dataToSend,
  //         isPlaying: false,
  //         currentTime: currentTime
  //       }
  //       setStreamData(updatedData);
  //       console.log(updatedData);
  //       sendData(stompClient!, updatedData);
  //     }
  //     } else {
  //       audioRef.current.currentTime = currentTime;
  //       audioRef.current.play();
  //       if (isStreamOwner) {
  //         const updatedData: WebSocketMessage = {
  //           ...dataToSend,
  //           isPlaying: true,
  //           currentTime: currentTime
  //         }
  //         setStreamData(updatedData);
  //         sendData(stompClient!, updatedData);
  //       }
  //     }
  //   }

  // }, [playingPlaylistId, currentPlaylistIndex, isPlaying])

  useEffect(() => {
    const currentSong = currentPlaylist.songs[currentPlaylistIndex];
    if (currentSong && audioRef.current) {
      const dataToSend: WebSocketMessage = {
        songId: currentSong.id,
        songUrl: currentSong.cloudUrl,
        songName: currentSong.name,
        songArtist: currentSong.artist,
        songImageUrl: currentSong.imageUrl,
        isPlaying: isPlaying,
        currentTime: currentTime,
      };
      setStreamData(dataToSend);
  
      audioRef.current.src = currentSong.cloudUrl;
      audioRef.current.currentTime = currentTime;
  
      if (isStreamOwner) {
        const updatedData: WebSocketMessage = {
          ...dataToSend,
          isPlaying: isPlaying,
          currentTime: currentTime,
          delay: Date.now()
        };
        setStreamData(updatedData);
        sendData(stompClient!, updatedData);
      }
  
      if (!isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  }, [playingPlaylistId, currentPlaylistIndex, isPlaying]);

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
