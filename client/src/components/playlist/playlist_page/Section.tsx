import { useLocation } from "react-router-dom";
import "./section.css"
import { useEffect, useState } from "react";
import { Playlist } from "../../../interfaces/Playlists";
import axios from "axios";
import default_playlist_picture from "../../pictures/playlist_default_picture.png"

const PlaylistPageSection = () => {
  const location = useLocation();
  const [playlist, setPlaylist] = useState<Playlist> ({
    id: "",
    userId: "",
    name: "",
    description: "",
    isAllSongs: false,
    createDate: "",
    type: "",
    imageUrl: null
  });
  const [username, setUsername] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const uuid = location.pathname.split("/playlist/")[1];
        const responsePlaylist = await axios.get(
          `http://localhost:8080/api/playlists/id/${uuid}`);
        
        setPlaylist(responsePlaylist.data);

        const responseUser = await axios.get(
          `http://localhost:8080/api/users/${responsePlaylist.data.userId}`);
        
        setUsername(responseUser.data.username);
        
      } catch (error) {
        console.log(error);
      }
    })();
  }, [location])

  console.log(playlist.imageUrl);

  return (
    <section className="playlist-page-section">
      <div className="playlist-page-info-container">
        <div className="playlist-info-left-container">
          <div className="playlist-page-picture-container">
            <img className="playlist-page-picture" src={
              !playlist.imageUrl ? 
              default_playlist_picture :
              playlist.imageUrl }/>
          </div>
          <div className="playlist-page-type-container">
            <span className="playlist-page-type">
              {playlist.type.charAt(0).toUpperCase() + playlist.type.slice(1).toLowerCase()} Playlist
            </span>
          </div>
        </div>
        <div className="playlist-info-right-container">
          <div className="playlist-page-name-container">
            <span className="playlist-page-name">{playlist.name}</span>
          </div>
          <div className="playlist-page-description-container">
            <span className="playlist-page-description">{playlist.description}</span>
          </div>
          <div className="playlist-page-data-container">
            <div className="playlist-page-creator-container">
              <span className="playlist-page-creator">by: {
              playlist.userId !== localStorage.getItem("id") ? 
              username :
              "you"}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="playlist-songs-container">

      </div>
    </section>
  );
}

export default PlaylistPageSection;