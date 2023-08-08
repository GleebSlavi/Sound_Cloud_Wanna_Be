import "./stream_box.css";
import default_picture from "../../../pictures/default_profile_picture.png";
import { useStreamContext } from "../../../providers/StreamProvider";

interface Props {
  id: string;
  songName: string;
  songArtist: string;
  listeners: number;
  ownerUsername: string;
  ownerImageUrl: string | null;
  setMessage: React.Dispatch<React.SetStateAction<string>>
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const StreamBox = ({
  id,
  ownerUsername,
  ownerImageUrl,
  songName,
  songArtist,
  listeners,
  setMessage,
  setIsVisible
}: Props) => {

  const { isStreamOwner, joinStream, inStream, leaveStream, stompClient, streamId } = useStreamContext();

  const handleJoinStream = () => {
    if (isStreamOwner) {
      setIsVisible(true);
      setMessage("You can't join a stream while streaming!");
    } else {
      if (inStream) {
        if (streamId === id) {
          setMessage("You are already in this stream!");
          setIsVisible(true);
          return;
        }
        leaveStream(stompClient, false, true);
      }
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
    </div>
  );
};

export default StreamBox;
