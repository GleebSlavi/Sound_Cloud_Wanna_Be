import { useEffect } from "react";
import "./section.css";
import StreamBox from "./stream_box/StreamBox";
import axios from "axios";
import { useStreamContext } from "../../providers/StreamProvider";

const StreamsSection = () => {
  const { setStreams, streams } = useStreamContext();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_STREAMS_ENDPOINT}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setStreams(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [streams]);

  return (
    <section className="section streams-section">
      <div className="container streams-header-container">
        <h2 className="streams-header">Streams</h2>
      </div>
      <div className="container streams-container">
        {streams.map((item) => (
          <StreamBox
            key={item.streamId}
            id={item.streamId}
            ownerUsername={item.ownerUsername}
            ownerImageUrl={item.ownerImageUrl}
            songArtist={item.songArtist!}
            songName={item.songName!}
            listeners={item.listeners!}
          />
        ))}
      </div>
    </section>
  );
};

export default StreamsSection;
