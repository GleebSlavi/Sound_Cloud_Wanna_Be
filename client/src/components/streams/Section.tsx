import { useEffect, useState } from "react";
import "./section.css";
import StreamBox from "./stream_box/StreamBox";
import axios from "axios";
import { useStreamContext } from "../../providers/StreamProvider";
import MessageWindow from "../message_window/MessageWindow";
import { streamsEndpoint } from "../../reusable_parameters/reusable_parameters";

const StreamsSection = () => {
  const { setStreams, streams } = useStreamContext();

  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${streamsEndpoint}`,
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
            setMessage={setMessage}
            setIsVisible={setIsVisible}
          />
        ))}
      </div>
      <MessageWindow setIsVisible={setIsVisible} message={message} isVisible={isVisible} profileButtonPage={false} />
    </section>
  );
};

export default StreamsSection;
