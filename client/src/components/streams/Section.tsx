import { useStreamContext } from "../../providers/StreamProvider";
import "./section.css";
import { Song } from "../../interfaces/Song";
import { v4 as uuidv4 } from 'uuid';
import { usePlayerContext } from "../../providers/PlayerProvider";
import StreamBox from "./stream_box/StreamBox";

const StreamsSection = () => {

 const { joinStream } = useStreamContext();

  const handleJoinStream = () => {
    joinStream();
  }

  return (
    <section className="section streams-section">
      <div className="container streams-header-container">
        <h2 className="streams-header">Streams</h2>
      </div>
      <div className="container streams-container">
        <StreamBox/>
        <StreamBox/>
        <StreamBox/>
        <StreamBox/>
      </div>
    </section>
  );
};

export default StreamsSection;
