import "./stream_box.css";
import default_picture from "../../../pictures/default_profile_picture.png";
import { User } from "../../../interfaces/User";
import { useState, useEffect } from "react";
import axios from "axios";
import { useStreamContext } from "../../../providers/StreamProvider";
import MessageWindow from "../../message_window/MessageWindow";

interface Props {
  id: string;
  songName: string;
  songArtist: string;
  listeners: number;
  ownerUsername: string;
  ownerImageUrl: string | null;
}

const StreamBox = ({
  id,
  ownerUsername,
  ownerImageUrl,
  songName,
  songArtist,
  listeners,
}: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");

  const { isStreamOwner, joinStream, inStream, leaveStream } = useStreamContext();

  const handleJoinStream = () => {
    if (isStreamOwner) {
      setIsVisible(true);
      setMessage("You can't join a stream while streaming!");
    } else {
      if (inStream) {
        console.log("in stream");
        leaveStream();
      }
      console.log(id);
      joinStream(id);
    }
  }

  return (
    <div className="container stream-box" onClick={handleJoinStream}>
      <div className="container stream-owner-container">
        <div className="container stream-owner-picture-container">
          <img className="stream-owner-picture" src={
            !ownerImageUrl ? default_picture : ownerImageUrl} />
        </div>
        <div className="container">
          <span className="stream-owner">{ownerUsername}</span>
        </div>
      </div>
      <div className="container stream-info-container">
        <div className="container stream-song-info-container">
          <div className="container">
            <span className="stream-song-name">{songName}</span>
          </div>
          <div className="container">
            <span className="stream-song-artist">{songArtist}</span>
          </div>
        </div>
        <div className="container listeners-container">
          <span className="listeners">{listeners}</span>
        </div>
      </div>
      <MessageWindow isVisible={isVisible} setIsVisible={setIsVisible} message={message} />
    </div>
  );
};

export default StreamBox;
