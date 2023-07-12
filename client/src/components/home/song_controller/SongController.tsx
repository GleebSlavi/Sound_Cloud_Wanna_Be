import "./song_controller.css"
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faForward, faShuffle, faTv, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";

const SongController = () => {
  const [isPlayButton, setPlayButton] = useState(true);

  return (
    <div className="song-controller-container">
      <div className="shuffle-songs-container">
        <button className="song-controller-button shuffle-button" type="button">
          <FontAwesomeIcon icon={faShuffle} />
        </button>
      </div>
      <div className="controller-container">
        <div className="backward-container">
          <button className="song-controller-button" type="button">
            <FontAwesomeIcon icon={faBackward} style={{ fontFamily: 'Press Start 2P' }}/>
          </button>
        </div>
        <div className="start-stop-container">
          <button className="song-controller-button" type="button"
          onClick={() => setPlayButton(!isPlayButton)}>
            <FontAwesomeIcon icon={ isPlayButton ? faPlay : faPause } />
          </button>
        </div>
        <div className="forward-container">
          <button className="song-controller-button" type="button">
            <FontAwesomeIcon icon={faForward} />
          </button>
        </div>
      </div>
      <div className="stream-controller">
        <button className="song-controller-button stream-button" type="button">
          <FontAwesomeIcon icon={faTv} />
        </button>
      </div>
    </div>
  );
}

export default SongController;