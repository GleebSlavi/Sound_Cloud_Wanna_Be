import "./song_controller.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackward,
  faForward,
  faShuffle,
  faTv,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { usePlayerContext } from "../../../../providers/PlayerProvider";
import { useStreamContext } from "../../../../providers/StreamProvider";
import MessageWindow from "../../../message_window/MessageWindow";
import { WebSocketMessage } from "../../../../interfaces/WebSocketMessage";

const SongController = () => {
  const { startStream, inStream, isStreamOwner, streamData, sendData, stompClient } = useStreamContext();

  const [streamIsActive, setStreamIsActive] = useState(inStream || isStreamOwner);
  const [isMessageWindowVissible, setIsMessageWindowVisible] = useState(false);
  const [message, setMessage] = useState("");


  const {
    isPlaying,
    setIsPlaying,
    currentPlaylistIndex,
    currentPlaylist,
    setSong,
    setNextSong,
    isShuffled,
    setIsShuffled,
  } = usePlayerContext();

  const handlePreviousSong = () => {
    if (!inStream) {
      const previousIndex = currentPlaylistIndex - 1;
      setSong(previousIndex, previousIndex >= 0, false, -1);

    } else {
      setIsMessageWindowVisible(true);
      setMessage("You can't change song while in stream!");
    }
  };

  const handleNextSong = () => {
    if (!inStream) {
      setNextSong();
    } else {
      setIsMessageWindowVisible(true);
      setMessage("You can't change song while in stream!");
    }
  }
  
  const handleStreamPlay = () => {
    if (!streamIsActive) {
      startStream();
    }
    setStreamIsActive(!streamIsActive);
  };

  const handleShuffling = () => {
    if (inStream) {
      setIsMessageWindowVisible(true);
      setMessage("You can't shuffle while in stream!");
    } else {
      setIsShuffled(!isShuffled);
    }
  };

  const handlePlay = () => {
    if (inStream) {
      setIsMessageWindowVisible(true);
      setMessage("You can't play/pause music while in stream!");
    } else {
      setIsPlaying(!isPlaying);
    }
  }

  return (
    <div className="container song-controller-container">
      <div className="container shuffle-songs-container">
        <button
          className={`song-controller-button shuffle-button 
        ${isShuffled ? "active" : ""}`}
          type="button"
          onClick={handleShuffling}
        >
          <FontAwesomeIcon icon={faShuffle} />
        </button>
      </div>
      <div className="container controller-container">
        <div className="container backward-container">
          <button className="song-controller-button click" type="button">
            <FontAwesomeIcon icon={faBackward} onClick={handlePreviousSong} />
          </button>
        </div>
        <div className="container start-stop-container">
          <button
            className="song-controller-button click"
            type="button"
            onClick={handlePlay}  
          >
            <FontAwesomeIcon icon={!isPlaying ? faPlay : faPause} />
          </button>
        </div>
        <div className="container forward-container">
          <button className="song-controller-button click" type="button">
            <FontAwesomeIcon icon={faForward} onClick={handleNextSong} />
          </button>
        </div>
      </div>
      <div className="container stream-container">
        <button
          className={`song-controller-button stream-button 
          ${streamIsActive ? "active" : ""}`}
          type="button"
          onClick={handleStreamPlay}
        >
          <FontAwesomeIcon icon={faTv} />
        </button>
      </div>
      <MessageWindow
        isVisible={isMessageWindowVissible}
        setIsVisible={setIsMessageWindowVisible}
        message={message}
      />
    </div>
  );
};

export default SongController;
