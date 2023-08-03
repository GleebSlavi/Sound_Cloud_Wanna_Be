import "./song_controller.css";
import { useState, useEffect, useRef } from "react";
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
import { v4 as uuidv4 } from "uuid";
import { User } from "../../../../interfaces/User";
import axios from "axios";

const SongController = () => {
  const { startStream, inStream, isStreamOwner, leaveStream, stompClient } =
    useStreamContext();

  const [streamIsActive, setStreamIsActive] = useState(false);
  const [isMessageWindowVissible, setIsMessageWindowVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<User>({
    id: "",
    username: "",
    imageUrl: null,
    role: "",
  });

  const {
    isPlaying,
    setIsPlaying,
    currentPlaylistIndex,
    setSong,
    setNextSong,
    isShuffled,
    setIsShuffled,
  } = usePlayerContext();

  // const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  //   event.preventDefault();
  //   event.returnValue = "onbeforeunload";
  //   leaveStream(stompClient, false);
  // };

  // const beforeunloadRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (streamIsActive) {
  //     window.addEventListener("beforeunload", handleBeforeUnload);
  //   }

  //   return () => {
  //     if (streamIsActive) {
  //       leaveStream(stompClient, false, inStream ? true : false);
  //       window.removeEventListener("beforeunload", handleBeforeUnload);
  //     }
  //   };
  // }, []);

  useEffect(() => {
    setStreamIsActive(isStreamOwner || inStream);
  }, [isStreamOwner, inStream]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_USERS_ENDPOINT}/${localStorage.getItem(
            "id"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

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
  };

  const handleStreamPlay = () => {
    if (!streamIsActive) {
      const id = uuidv4();
      startStream(id, user.username, user.imageUrl);
    } else {
      leaveStream(stompClient, false, inStream ? true : false);
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
  };

  return (
    <div /*ref={beforeunloadRef}*/ className="container song-controller-container">
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
