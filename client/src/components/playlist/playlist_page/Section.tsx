import { useLocation } from "react-router-dom";
import "./section.css";
import { useEffect, useState } from "react";
import { Playlist } from "../../../interfaces/Playlists";
import { Song } from "../../../interfaces/Song";
import axios from "axios";
import default_playlist_picture from "../../../pictures/playlist_default_picture.png";
import SongBox from "../../song/SongBox";
import { playlistsEndpoint} from "../../../ts_files/reusable";
import { usePlayerContext } from "../../../provider/PlayerProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

const PlaylistPageSection = () => {
  const location = useLocation();
  const [playlist, setPlaylist] = useState<Playlist>({
    id: "",
    userId: "",
    name: "",
    description: "",
    isAllSongs: false,
    createDate: "",
    type: "",
    imageUrl: null,
    creator: "",
  });
  const [items, setItems] = useState<Song[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  
  const { setCurrentSong, currentSong, setIsPlaying, isPlaying } = usePlayerContext();


  useEffect(() => {
    (async () => {
      try {
        const uuid = location.pathname.split("/playlist/")[1];

        const responsePlaylist = await axios.get(
          `${playlistsEndpoint}/id/${uuid}`
        );
        setPlaylist(responsePlaylist.data);
        setImageUrl(playlist.imageUrl ? playlist.imageUrl : "");

        const responseSongs = await axios.get(
          `${playlistsEndpoint}/${responsePlaylist.data.id}/songs`
        );
        setItems(responseSongs.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [location, setPlaylist, setItems]);

  const handleSongPlay = (item: Song) => {
    if (currentSong && currentSong.id === item.id) {
      setIsPlaying(!isPlaying);
    }
    else {
      setCurrentSong(item);
      setIsPlaying(true);
    }
  }

  return (
    <section className="section playlist-page-section">
      <div className="container playlist-page-info-container">
        <div className="container playlist-info-left-container">
          <div className="container">
            <img
              className="playlist-page-picture"
              src={!imageUrl ? default_playlist_picture : imageUrl}
            />
          </div>
          <div className="container">
            <span className="playlist-page-type">
              {playlist.type.charAt(0).toUpperCase() +
                playlist.type.slice(1).toLowerCase()}{" "}
              Playlist
            </span>
          </div>
        </div>
        <div className="container playlist-info-right-container">
          <div className="container playlist-page-name-container">
            <span className="playlist-page-name">{playlist.name}</span>
          </div>
          <div className="container playlist-page-description-container">
            <span className="playlist-page-description">
              {playlist.description}
            </span>
          </div>
          <div className="container playlist-page-data-container">
            <div className="container playlist-page-creator-container">
              <span className="playlist-page-creator">
                by:{" "}
                {playlist.userId !== localStorage.getItem("id")
                  ? playlist.creator
                  : "you"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="container playlist-songs-info-control-container">
        <div className="container">
            <button type="button" className="playlist-songs-play-button">
              <FontAwesomeIcon icon={faPlay} />
            </button>
        </div>
        <div className="container"></div>
        <div className="container"></div>
        <div className="container"></div>
        <div className="container"></div>
      </div>
      <div className="container playlist-songs-container">
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
            isCurrentSong={item.id === currentSong?.id}
            handlePlay={() => handleSongPlay(item)}
          />
        ))}
      </div>
    </section>
  );
};

export default PlaylistPageSection;
