import { useLocation, useParams } from "react-router-dom";
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
  const [imageUrl, setImageUrl] = useState<string>("");
  
  const { currentPlaylist, currentPlaylistIndex, setIsPlaying, isPlaying, 
    setCurrentPlaylist, setSong, shuffleSongs, setCurrentSongId, currentSongId,
    isShuffled, setOriginalPlaylist, originalPlaylist } = usePlayerContext();

  const currentSong = currentPlaylist.songs[currentPlaylistIndex];
  const playlist = {id: playlistData.id, songs: items};

  const { uuid } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const responsePlaylist = await axios.get(
          `${playlistsEndpoint}/${uuid}`
        );
        setPlaylistData(responsePlaylist.data);
        setImageUrl(responsePlaylist.data.imageUrl ? responsePlaylist.data.imageUrl : "");

        const responseSongs = await axios.get(
          `${playlistsEndpoint}/${responsePlaylist.data.id}/songs`
        );
        setItems(responseSongs.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [uuid, setPlaylistData, setItems]);

  const playSong = (index: number) => {
    setOriginalPlaylist(playlist);
    if (isShuffled) {
      setCurrentPlaylist({
          id: !isPlaying ? playlistData.id : currentPlaylist.id, 
          songs: shuffleSongs(
            !isPlaying ? true : false,
            !isPlaying ? playlist : currentPlaylist,
            index)});
      setSong(0, true, false);
    } else {
      setSong(index, true, currentPlaylist.id === playlistData.id ? true : false);
    }
  }

  const handleSongPlay = (index: number) => {
    setOriginalPlaylist(playlist);
    let newPlaylist = false;
    if (currentPlaylist.id !== playlistData.id) {
        setCurrentPlaylist({id: playlistData.id, songs: items});
        newPlaylist = true;
    }

    if (!isPlaying || currentPlaylistIndex !== index || newPlaylist) {
      playSong(index);
    } else {
      setIsPlaying(false);
    }
  }

  // useEffect(() => {
  //   if (isPlaying) {
  //     if (currentPlaylist.id === playlistData.id) {
  //       if (isShuffled) {
  //         setCurrentPlaylist({id: currentPlaylist.id, songs: shuffleSongs(true, currentPlaylist, currentPlaylistIndex)})
  //         setSong(0, true, true);
  //       } else {
  //         setCurrentPlaylist({id: currentPlaylist.id, songs: items});
  //         setSong((items.findIndex((song) => song.id === currentSongId)), true, true);
  //       }
  //     } else {
  //       if (isShuffled) {
  //         setCurrentPlaylist({id: currentPlaylist.id, songs: shuffleSongs(true, originalPlaylist, currentPlaylistIndex)})
  //         setSong(0, true, true);
  //       } else {
  //         setCurrentPlaylist({id: originalPlaylist.id, songs: originalPlaylist.songs});
  //         setSong((originalPlaylist.songs.findIndex((song) => song.id === currentSongId)), true, true);
  //       }
  //     }
  // }
  // }, [isShuffled])

  useEffect(() => {
    if (isPlaying) {
      if (isShuffled) {
        const updatedSongs = shuffleSongs(true, currentPlaylist.id === playlistData.id ? currentPlaylist : originalPlaylist, currentPlaylistIndex);
        setCurrentPlaylist({ id: currentPlaylist.id, songs: updatedSongs });
        setSong(0, true, true);
      } else {
        const updatedSongs = currentPlaylist.id === playlistData.id ? items : originalPlaylist.songs;
        const indexToSet = updatedSongs.findIndex((song) => song.id === currentSongId);
        setCurrentPlaylist({ id: currentPlaylist.id, songs: updatedSongs });
        setSong(indexToSet, true, true);
      }
    }
  }, [isShuffled])

  // Optimized variant
  // useEffect(() => {
  //   if (isPlaying && isShuffled) {
  //     const updatedSongs = shuffleSongs(true, currentPlaylist.id === playlistData.id ? currentPlaylist : originalPlaylist, currentPlaylistIndex);
  //     setCurrentPlaylist({ id: currentPlaylist.id, songs: updatedSongs });
  //     setSong(0, true, true);
  //   } else if (isPlaying && !isShuffled) {
  //     const updatedSongs = currentPlaylist.id === playlistData.id ? items : originalPlaylist.songs;
  //     const indexToSet = updatedSongs.findIndex((song) => song.id === currentSongId);
  //     setCurrentPlaylist({ id: currentPlaylist.id, songs: updatedSongs });
  //     setSong(indexToSet, true, true);
  //   }
  // }, [isPlaying, isShuffled, currentPlaylist, currentPlaylistIndex, playlistData.id, items, originalPlaylist, currentSongId]);

  useEffect(() => {
    setCurrentSongId(currentPlaylist.songs[currentPlaylistIndex]?.id)
  }, [currentPlaylistIndex, currentPlaylist, setCurrentSongId])

  const handlePlaylistPlay = () => {
    if (currentPlaylist.id !== playlistData.id) {
      setCurrentPlaylist({id: playlistData.id, songs: items});
      playSong(0);
    } else {
      setIsPlaying(!isPlaying);
    }
  }

  return (
    <section className="section playlist-page-section">
      <div className="container playlist-page-info-container">
        <div className="container playlist-info-left-container">
          <div className="container playlist-page-picture-container">
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
        <div className="container filler-container">
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
            isCurrentSong={`${playlistData.id}_${item.id}` === `${currentPlaylist.id}_${currentSong?.id}`}
            handlePlay={() => handleSongPlay(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default PlaylistPageSection;
