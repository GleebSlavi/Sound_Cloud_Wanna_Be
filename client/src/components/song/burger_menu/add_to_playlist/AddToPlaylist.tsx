import "./add_to_playlist.css"
import { useState, useEffect } from "react";
import { Playlist } from "../../../../interfaces/Playlist";
import axios from "axios";
import PlaylistBox from "../../../playlist/playlist_box/PlaylistBox";
import { useParams } from "react-router-dom";


const AddToPlaylistSection = () => {
  const [items, setItems] = useState<Playlist[]>([]);

  const { uuid } = useParams();

  useEffect(() => {
    (async () => {
      try{
        const response = await axios.get(
          `${process.env.REACT_APP_PLAYLISTS_ENDPOINT}/${localStorage.getItem("id")}/song-not-in/${uuid}`,
          {
            headers: {
             Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        setItems(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  })

  return (
    <div className="section add-to-playlist-section">
      <div className="container">
        <h2 className="add-to-playlist-header">Add To Playlist</h2>
      </div>
      <div className="container add-to-playlist-playlists-container">
        {items.map((item) => (
          <PlaylistBox
          id={item.id}
          name={item.name}
          creator="you"
          imageUrl={item.imageUrl} 
          songId={uuid!}/>
        ))}
      </div>
    </div>
  )
}

export default AddToPlaylistSection;