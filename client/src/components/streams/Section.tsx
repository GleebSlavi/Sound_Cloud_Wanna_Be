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
    // setIsStreamActive(true);

    console.log(streamData);
    if (streamData.isPlaying) {
      const item: Song= {
        id: "",
        userId: "",
        name: streamData.songName,
        artist: streamData.songArtist,
        releaseYear: 0,
        duration: 0,
        type: "",
        uploadDate: "",
        imageUrl: streamData.songImageUrl,
        cloudUrl: streamData.songUrl,
        uploader: ""
      }
      const id = uuidv4();
      setCurrentPlaylist({id: id, songs: [item]});
      setCurrentSongId(item.id);
      setSong(0, true, false);
    }
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
