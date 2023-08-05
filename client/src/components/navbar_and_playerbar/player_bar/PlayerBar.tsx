import SongController from "./song_controller/SongController";
import SongData from "./song_data/SongData";
import SongVolume from "./song_volume/SongVolume";
import "./player_bar.css";
import { usePlayerContext } from "../../../providers/PlayerProvider";
import { useEffect, useRef } from "react";
import { useStreamContext } from "../../../providers/StreamProvider";
import { WebSocketMessage } from "../../../interfaces/WebSocketMessage";
import cron from 'node-cron';

const PlayerBar = () => {
  const {
    currentPlaylist,
    currentPlaylistIndex,
    isPlaying,
    currentTime,
    setCurrentTime,
    setNextSong,
    isMuted,
    volume,
    playingPlaylistId,
    currentSongId,
    setIsPlaying,
  } = usePlayerContext();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    sendData,
    stompClient,
    isStreamOwner,
    setStreamData,
    streamId,
    updateStream,
  } = useStreamContext();

  useEffect(() => {
    if (currentPlaylistIndex === -1 && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
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
          };
          setStreamData(updatedData);
          if (currentSong.id !== currentSongId) {
            updateStream(
              streamId,
              updatedData.songName,
              updatedData.songArtist,
              null,
              null);
          }
          sendData(stompClient!, updatedData, streamId);
        }

        if (!isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
      }
    }
  }, [playingPlaylistId, currentPlaylistIndex, isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setStreamData((prevStreamData) => ({
        ...prevStreamData,
        currentTime: audioRef.current!.currentTime,
        delay: Date.now()
      }));
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("ended", setNextSong);
      return () => {
        audioRef.current?.removeEventListener("ended", setNextSong);
      };
    }
  }, [audioRef, setNextSong]);

  useEffect(() => {
    const audioElement = document.getElementById("audio") as HTMLAudioElement;
    audioElement.volume = volume;
  }, [volume]);

  return (
    <div className="player-bar">
      <SongData />
      <SongController />
      <SongVolume />
      <audio
        ref={audioRef}
        id="audio"
        onTimeUpdate={handleTimeUpdate}
        muted={isMuted ? true : false}
      />
    </div>
  );
};

export default PlayerBar;
