import { useLocation } from "react-router-dom";
import "./section.css";
import { useEffect, useState } from "react";
import { Playlist } from "../../../interfaces/Playlists";
import { Song } from "../../../interfaces/Song";
import axios from "axios";
import default_playlist_picture from "../../../pictures/playlist_default_picture.png"
import SongBox from "../../song/SongBox";
import { playlistsEndpoint} from "../../../ts_files/reusable";
import { usePlayerContext } from "../../../provider/PlayerProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faShuffle } from "@fortawesome/free-solid-svg-icons";

const PlaylistPageSection = () => {
  const location = useLocation();
  const [playlistData, setPlaylistData] = useState<Playlist>({
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
  const [shuffled, setShuffled] = useState<Song[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isShuffled, setIsShuffled] = useState(false);
  
  const { currentPlaylist, currentPlaylistIndex, setCurrentPlaylistIndex, setIsPlaying, 
    isPlaying, setCurrentPlaylist, setSong, shuffleSongs, setCurrentSongId, currentSongId } = usePlayerContext();

  const currentSong = currentPlaylist.songs[currentPlaylistIndex];

  useEffect(() => {
    (async () => {
      try {
        const uuid = location.pathname.split("/playlist/")[1];

        const responsePlaylist = await axios.get(
          `${playlistsEndpoint}/${uuid}`
        );
        setPlaylistData(responsePlaylist.data);
        setImageUrl(playlistData.imageUrl ? playlistData.imageUrl : "");

        const responseSongs = await axios.get(
          `${playlistsEndpoint}/${responsePlaylist.data.id}/songs`
        );
        setItems(responseSongs.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [location, setPlaylistData, setItems]);

  const handleSongPlay = (item: Song, index: number) => {
    if (currentPlaylist.id !== playlistData.id) {
      let playlistSongs = isShuffled 
        ? shuffleSongs(true, items, index)
        : items;
      
      setCurrentPlaylist({id: playlistData.id, songs: playlistSongs});
    }

    if (currentSong && currentSong.id === item.id) {
      setIsPlaying(!isPlaying);
    } 
    else {
      setSong(index, true, false);
    }
  }

  const handleShuffle = () => {
    setIsShuffled(!isShuffled);

    if (!isShuffled) {
      if (currentPlaylist.id !== playlistData.id) {
        setShuffled(shuffleSongs(false, items, 0));
      } else {
        if (isPlaying) {
          setCurrentPlaylist({id: currentPlaylist.id, songs: shuffleSongs(true, items, currentPlaylistIndex)});
          setSong(0, true, true);
        }
      }
    } else {
      if (isPlaying) {
        setCurrentPlaylist({id: currentPlaylist.id, songs: items});
        setSong((items.findIndex((song) => song.id == currentSongId)), true, true);
      }
    }
  }

  useEffect(() => {
    setCurrentSongId(currentPlaylist.songs[currentPlaylistIndex]?.id)
  }, [currentPlaylistIndex, currentPlaylist, setCurrentSongId])

  const handlePlaylistPlay = () => {
    if (currentPlaylist.id !== playlistData.id) {
      setCurrentPlaylist({id: playlistData.id, songs: isShuffled ? shuffled : items})
      setSong(0, true, false);
    } else {
      setIsPlaying(!isPlaying);
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
              {playlistData.type.charAt(0).toUpperCase() +
                playlistData.type.slice(1).toLowerCase()}{" "}
              Playlist
            </span>
          </div>
        </div>
        <div className="container playlist-info-right-container">
          <div className="container playlist-page-name-container">
            <span className="playlist-page-name">{playlistData.name}</span>
          </div>
          <div className="container playlist-page-description-container">
            <span className="playlist-page-description">
              {playlistData.description}
            </span>
          </div>
          <div className="container playlist-page-data-container">
            <div className="container playlist-page-creator-container">
              <span className="playlist-page-creator">
                by:{" "}
                {playlistData.userId !== localStorage.getItem("id")
                  ? playlistData.creator
                  : "you"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="container playlist-songs-info-control-container">
        <div className="container playlist-songs-play-button-container">
            <button type="button" className="song-controller-button playlist-songs-play-button click"
            onClick={handlePlaylistPlay}>
              <FontAwesomeIcon icon={currentPlaylist.id === playlistData.id && isPlaying ? faPause : faPlay} />
            </button>
        </div>
        <div className="container playlist-songs-shuffle-button-container">
          <button type="button" className={`song-controller-button playlist-songs-shuffle-button 
          ${isShuffled ? "active" : ""}`} onClick={handleShuffle}>
            <FontAwesomeIcon icon={faShuffle} />
          </button>
        </div>
        <div className="container playlist-songs-uploader">
          <span className="playlist-songs-info">Uploader</span>
        </div>
        <div className="container playlist-songs-uploader">
          <span className="playlist-songs-info playlist-songs-duration-text">Duration</span>
        </div>
        <div className="container playlist-songs-upload-date">
          <span className="playlist-songs-info playlist-songs-upload-date-text">Upload date</span>
        </div>
      </div>
      <div className="container playlist-songs-container">
        {items.map((item, index) => (
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
            handlePlay={() => handleSongPlay(item, index)}
          />
        ))}
      </div>
    </section>
  );
};

export default PlaylistPageSection;
