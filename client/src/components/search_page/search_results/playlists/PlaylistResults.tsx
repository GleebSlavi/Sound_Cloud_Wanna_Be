import { useState, useEffect } from "react";
import PlaylistBox from "../../../playlist/playlist_box/PlaylistBox";
import { Playlist } from "../../../../interfaces/Playlist";
import "./playlist_results.css";
import { useParams } from "react-router-dom";
import axios from "axios";


const PlaylistResults = () => {
  const [items, setItems] = useState<Playlist[]>([]);

  const { search } = useParams()

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_PLAYLISTS_ENDPOINT}/search/${search}`,
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
  }, [search, setItems])

  return (
    <div className="container search-page-playlists">
      {items.map((item) => (
        <PlaylistBox 
        id={item.id}
        name={item.name}
        creator={item.userId === localStorage.getItem("id") ? "you" : item.creator}
        imageUrl={item.imageUrl}
        songId={null}
        />
      ))}
    </div>
  )
}

export default PlaylistResults;