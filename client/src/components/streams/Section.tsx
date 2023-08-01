import { useStreamContext } from "../../providers/StreamProvider";
import "./section.css";
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
        <button type="button" onClick={handleJoinStream}>Click me</button>
      </div>
    </section>
  );
};

export default StreamsSection;
