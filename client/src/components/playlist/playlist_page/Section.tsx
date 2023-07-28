import { useParams } from "react-router-dom";
import "./section.css";
import { useEffect, useState, useRef } from "react";
import { Playlist } from "../../../interfaces/Playlist";
import { Song } from "../../../interfaces/Song";
import axios from "axios";
import default_playlist_picture from "../../../pictures/playlist_default_picture.png"
import SongBox from "../../song/SongBox";
import { usePlayerContext } from "../../../providers/PlayerProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faBars } from "@fortawesome/free-solid-svg-icons";
import BurgerMenuPlaylist from "./burger_menu/BurgerMenuPlaylist";
import DeleteWindow from "./delete_window/DeleteWindow";


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
  const [isVisible, setIsVisible] = useState(false);
  const [typeChanged, setTypeChanged] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDeleteWindowVisible, setIsDeleteWindowVisible] = useState(false);
  
  const { currentPlaylist, currentPlaylistIndex, setIsPlaying, isPlaying, 
    setCurrentPlaylist, setSong, shuffleSongs, setCurrentSongId, currentSongId,
    isShuffled, setOriginalPlaylist, originalPlaylist } = usePlayerContext();

  const currentSong = currentPlaylist.songs[currentPlaylistIndex];
  const playlist = {id: playlistData.id, songs: items};

  const { uuid } = useParams();

  const burgerMenuRef = useRef<HTMLDivElement | null>(null);
  const burgerButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const responsePlaylist = await axios.get(
          `${process.env.REACT_APP_PLAYLISTS_ENDPOINT!}/${uuid}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setPlaylistData(responsePlaylist.data);
        setImageUrl(responsePlaylist.data.imageUrl ? responsePlaylist.data.imageUrl : "");

        const responseSongs = await axios.get(
          `${process.env.REACT_APP_PLAYLISTS_ENDPOINT}/${uuid}/songs`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setItems(responseSongs.data);
        
        const responseFavorite = await axios.get(
          `${process.env.REACT_APP_USERS_ENDPOINT}/${localStorage.getItem("id")}/favorite/${uuid}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
         );
         setIsFavorite(responseFavorite.data)
      } catch (error) {
        console.log(error);
      }
    })();
  }, [typeChanged, uuid, setPlaylistData, setItems]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      burgerButtonRef.current &&
      !burgerButtonRef.current.contains(event.target as Node) &&
      burgerMenuRef.current &&
      !burgerMenuRef.current.contains(event.target as Node)
    ) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isVisible]);

  const onSpanClick = () => {
    setIsVisible(false);
  }

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
    if (items.length > 0) {
      if (currentPlaylist.id !== playlistData.id) {
        setCurrentPlaylist({id: playlistData.id, songs: items});
        playSong(0);
      } else {
        setIsPlaying(!isPlaying);
      }
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
        { playlistData.isAllSongs ? <div></div>
          : <div className="container burger-menu-button-container">
              <button className="burger-menu-button" type="button" ref={burgerButtonRef}>
                <FontAwesomeIcon icon={faBars} className="playlist-burger-menu" onClick={() => setIsVisible(!isVisible)}/>
              </button>
              <BurgerMenuPlaylist isYours={playlistData.userId === localStorage.getItem("id")} isBarVisible={isVisible}
              onClick={onSpanClick} isPublic={playlistData.type === "PUBLIC"} setTypeChanged={setTypeChanged}
              isFavorite={isFavorite} setIsFavorite={setIsFavorite} setIsDeleteWindowVisible={setIsDeleteWindowVisible}
              ref={burgerMenuRef}/>
            </div> }
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
            inPlaylist={true}
            playlistUploaderId={playlistData.userId}
            isAllSongsPlaylist={playlistData.isAllSongs}
            songId={item.id}
          />
        ))}
      </div>
      <DeleteWindow isVisible={isDeleteWindowVisible} setIsVisible={setIsDeleteWindowVisible}/>
    </section>
  );
};

export default PlaylistPageSection;
