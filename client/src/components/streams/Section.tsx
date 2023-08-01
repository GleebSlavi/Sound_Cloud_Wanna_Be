import { useStreamContext } from "../../providers/StreamProvider";
import "./section.css";
import { Song } from "../../interfaces/Song";
import { v4 as uuidv4 } from 'uuid';
import { usePlayerContext } from "../../providers/PlayerProvider";

const StreamsSection = () => {

 const { streamData, joinStream } = useStreamContext();

  const { setCurrentPlaylist, setCurrentSongId, setSong } = usePlayerContext();

  const handleJoinStream = () => {
    joinStream();
  }

  return (
    <section className="section streams-section">
      <div className="container">
        <h2 className="streams-header">Streams</h2>
      </div>
      <div className="container">
        <button type="button" onClick={handleJoinStream}>Click me</button>
      </div>
    </section>
  );
};

export default StreamsSection;
