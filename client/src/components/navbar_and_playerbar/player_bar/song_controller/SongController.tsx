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
import { usePlayerContext } from "../../../../provider/PlayerProvider";

const SongController = () => {
  const [isShuffleActive, setShuffleActive] = useState(false);
  const [isStreamActive, setStreamActive] = useState(false);

  const { isPlaying, setIsPlaying, currentPlaylistIndex,
   setSong, setNextSong } = usePlayerContext()

  const handlePreviousSong = () => {
    const previousIndex = currentPlaylistIndex - 1;
    setSong(previousIndex, previousIndex >= 0);
  }

  return (
    <div className="container song-controller-container">
      <div className="container shuffle-songs-container">
        <button
          className={`song-controller-button shuffle-button 
        ${isShuffleActive ? "active" : ""}`}
          type="button"
          onClick={() => setShuffleActive(!isShuffleActive)}
        >
          <FontAwesomeIcon icon={faShuffle} />
        </button>
      </div>
      <div className="container controller-container">
        <div className="container backward-container">
          <button className="song-controller-button click" type="button">
            <FontAwesomeIcon
              icon={faBackward}
              onClick={handlePreviousSong}
            />
          </button>
        </div>
        <div className="container start-stop-container">
          <button
            className="song-controller-button click"
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            <FontAwesomeIcon icon={!isPlaying ? faPlay : faPause} />
          </button>
        </div>
        <div className="container forward-container">
          <button className="song-controller-button click" type="button">
            <FontAwesomeIcon 
            icon={faForward}
            onClick={setNextSong} />
          </button>
        </div>
      </div>
      <div className="container stream-container">
        <button
          className={`song-controller-button stream-button
        ${isStreamActive ? "active" : ""}`}
          type="button"
          onClick={() => setStreamActive(!isStreamActive)}
        >
          <FontAwesomeIcon icon={faTv} />
        </button>
      </div>
    </div>
  );
};

export default SongController;
