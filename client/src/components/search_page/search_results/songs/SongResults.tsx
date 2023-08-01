import "./song_results.css";
import { useState, useEffect } from "react";
import { Song } from "../../../../interfaces/Song";
import SongBox from "../../../song/SongBox";
import { usePlayerContext } from "../../../../providers/PlayerProvider";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import { useStreamContext } from "../../../../providers/StreamProvider";
import MessageWindow from "../../../message_window/MessageWindow";

interface Props {
  items: Song[];
}

const SongResults = ({ items }: Props) => {
  const {
    setCurrentPlaylist,
    setSong,
    setCurrentSongId,
    currentSongId,
    setOriginalPlaylist,
    setPlayingPlaylistId
  } = usePlayerContext();

  const { inStream, setStreamData } = useStreamContext();

  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");

  const handleSongPlay = (item: Song) => {
    if (!inStream) {
      if (currentSongId !== item.id) {
        const id = uuidv4();
        setCurrentPlaylist({ id: id, songs: [item] });
        setPlayingPlaylistId(id);
        setOriginalPlaylist({ id: id, songs: [item] });
        setCurrentSongId(item.id);
        setStreamData({
          songId: item.id,
          isPlaying: true,
          songUrl: item.cloudUrl,
          songName: item.name,
          songArtist: item.artist,
          songImageUrl: item.imageUrl,
          currentTime: 0,
        });
      }
      setSong(0, item.id !== currentSongId, item.id === currentSongId, -1);
    } else {
      setIsVisible(true);
      setMessage("You can't play music while in stream!");
    }
  };

  return (
    <div className="container search-page-container">
      <div className="container search-page-songs">
        {items.map((item) => (
          <SongBox
            key={item.id}
            name={item.name}
            artist={item.artist}
            uploader={
              item.userId === localStorage.getItem("id")
                ? "you"
                : item.uploader!
            }
            duration={item.duration!}
            uploadDate={item.uploadDate!}
            imageUrl={item.imageUrl}
            isCurrentSong={item.id === currentSongId}
            handlePlay={() => handleSongPlay(item)}
            inPlaylist={false}
            playlistUploaderId=""
            isAllSongsPlaylist={false}
            songId=""
          />
        ))}
      </div>
      <MessageWindow isVisible={isVisible} setIsVisible={setIsVisible} message={message} />
    </div>
  );
};

export default SongResults;
