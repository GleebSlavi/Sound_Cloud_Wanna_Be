import "./song_results.css"
import { useState, useEffect } from "react";
import { Song } from "../../../../interfaces/Song";
import SongBox from "../../../song/SongBox";
import { usePlayerContext } from "../../../../providers/PlayerProvider";
import { v4 as uuidv4 } from 'uuid';
import { useParams } from "react-router-dom";
import axios from "axios";

const SongResults = () => {
  const [items, setItems] = useState<Song[]>([]);

  const { setCurrentPlaylist, setSong, setCurrentSongId, currentSongId,
  setOriginalPlaylist } = usePlayerContext();

  const { search } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SONGS_ENDPOINT}/search/${search}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setItems(response.data);
      } catch (error) {
        console.log(error);
      }

    })();
  }, [search, setItems]);

  const handleSongPlay = (item: Song) => {
    if (currentSongId !== item.id) {
      const id = uuidv4();
      setCurrentPlaylist({id: id, songs: [item]});
      setOriginalPlaylist({id: id, songs: [item]});
      setCurrentSongId(item.id);
    }
    setSong(0, item.id !== currentSongId, item.id === currentSongId);
  }

  return (
    <div className="container search-page-songs">
       {items.map((item) => (
        <SongBox
          key={item.id}
          name={item.name}
          artist={item.artist}
          uploader={
            item.userId === localStorage.getItem("id") ? "you" : item.uploader
          }
          duration={item.duration}
          uploadDate={item.uploadDate}
          imageUrl={item.imageUrl}
          isCurrentSong={item.id === currentSongId}
          handlePlay={() => handleSongPlay(item)}
          inPlaylist={false}
          playlistUploaderId=""
        />
      ))} 
    </div>
  )
}

export default SongResults