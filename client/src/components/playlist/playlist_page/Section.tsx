import { useParams } from "react-router-dom";
import "./section.css";
import { useEffect, useState, useRef } from "react";
import { Playlist } from "../../../interfaces/Playlist";
import { Song } from "../../../interfaces/Song";
import axios from "axios";
import default_playlist_picture from "../../../pictures/playlist_default_picture.png";
import SongBox from "../../song/SongBox";
import { usePlayerContext } from "../../../providers/PlayerProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faBars } from "@fortawesome/free-solid-svg-icons";
import BurgerMenuPlaylist from "./burger_menu/BurgerMenuPlaylist";
import DeleteWindow from "./delete_window/DeleteWindow";
import { useStreamContext } from "../../../providers/StreamProvider";
import MessageWindow from "../../message_window/MessageWindow";
import { playlistsEndpoint, usersEndpoint } from "../../../reusable_parameters/reusable_parameters";

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
  const [messageWindowVisible, setMessageWindowVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMoreItems, setHasMoreItems] = useState(true);

  const limit = 8;

  const { inStream } = useStreamContext();

  const {
    currentPlaylist,
    currentPlaylistIndex,
    setIsPlaying,
    isPlaying,
    setCurrentPlaylist,
    setSong,
    shuffleSongs,
    setCurrentSongId,
    currentSongId,
    isShuffled,
    setOriginalPlaylist,
    originalPlaylist,
    setPlayingPlaylistId,
  } = usePlayerContext();

  const currentSong = currentPlaylist.songs[currentPlaylistIndex];
  const playlist = { id: playlistData.id, songs: items };

  const { uuid } = useParams();

  const burgerMenuRef = useRef<HTMLDivElement>(null);
  const burgerButtonRef = useRef<SVGSVGElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const responsePlaylist = await axios.get(
          `${playlistsEndpoint}/${uuid}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setPlaylistData(responsePlaylist.data);
        setImageUrl(
          responsePlaylist.data.imageUrl ? responsePlaylist.data.imageUrl : ""
        );

        const responseFavorite = await axios.get(
          `${usersEndpoint}/${localStorage.getItem(
            "id"
          )}/favorite/${uuid}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsFavorite(responseFavorite.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [typeChanged, uuid, setPlaylistData]);

  
  useEffect(() => {
      (async () => {
        try {
          const responseSongs = await axios.get(
            `${
             playlistsEndpoint
            }/${uuid}/songs?offset=${offset}&limit=${limit}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setItems((prevItems) => [...prevItems, ...responseSongs.data]);

          if (responseSongs.data.length < limit) {
            setHasMoreItems(false);
          }
        } catch (error) {
          console.log(error);
        }
      })();
  }, [offset]);

  const handleScroll = () => {
    if (sectionRef.current && 
        sectionRef.current.scrollTop + (window.innerHeight / 2) > sectionRef.current.scrollHeight / 2
        && hasMoreItems) {
          setOffset(offset + limit);
    }
  };

  const handleClickOutside = (event: any) => {
    const clickedOnBurgerButton = burgerButtonRef.current?.contains(
      event.target
    );
    const clickedInsideBurgerMenu = burgerMenuRef.current?.contains(
      event.target
    );

    if (clickedOnBurgerButton) {
      setIsVisible((prevVisible) => !prevVisible);
    } else if (!clickedInsideBurgerMenu) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const onSpanClick = () => {
    setIsVisible(false);
  };

  const playSong = (index: number) => {
    setOriginalPlaylist(playlist);
    if (isShuffled) {
      setCurrentPlaylist({
        id: !isPlaying ? playlistData.id : currentPlaylist.id,
        songs: shuffleSongs(
          !isPlaying ? true : false,
          !isPlaying ? playlist : currentPlaylist,
          index
        ),
      });
      setPlayingPlaylistId(!isPlaying ? playlistData.id : currentPlaylist.id);
      setSong(0, true, false, -1);
    } else {
      setSong(
        index,
        true,
        currentPlaylist.id === playlistData.id ? true : false,
        -1
      );
    }
  };

  const handleSongPlay = (index: number) => {
    if (!inStream) {
      setOriginalPlaylist(playlist);
      let newPlaylist = false;
      if (currentPlaylist.id !== playlistData.id) {
        setCurrentPlaylist({ id: playlistData.id, songs: items });
        setPlayingPlaylistId(playlistData.id);
        newPlaylist = true;
      }

      if (!isPlaying || currentPlaylistIndex !== index || newPlaylist) {
        playSong(index);
      } else {
        setIsPlaying(false);
      }
    } else {
      setMessageWindowVisible(true);
      setMessage("You can't play music while in stream!");
    }
  };

  useEffect(() => {
    if (isPlaying) {
      if (isShuffled) {
        const updatedSongs = shuffleSongs(
          true,
          currentPlaylist.id === playlistData.id
            ? currentPlaylist
            : originalPlaylist,
          currentPlaylistIndex
        );
        setCurrentPlaylist({ id: currentPlaylist.id, songs: updatedSongs });
        setSong(0, true, true, -1);
      } else {
        const updatedSongs =
          currentPlaylist.id === playlistData.id
            ? items
            : originalPlaylist.songs;
        const indexToSet = updatedSongs.findIndex(
          (song) => song.id === currentSongId
        );
        setCurrentPlaylist({ id: currentPlaylist.id, songs: updatedSongs });
        setSong(indexToSet, true, true, -1);
      }
    }
  }, [isShuffled]);

  useEffect(() => {
    setCurrentSongId(currentPlaylist.songs[currentPlaylistIndex]?.id);
  }, [currentPlaylistIndex, currentPlaylist, setCurrentSongId]);

  const handlePlaylistPlay = () => {
    if (!inStream) {
      if (items.length > 0) {
        if (currentPlaylist.id !== playlistData.id) {
          setCurrentPlaylist({ id: playlistData.id, songs: items });
          setPlayingPlaylistId(playlistData.id);
          playSong(0);
        } else {
          setIsPlaying(!isPlaying);
        }
      }
    } else {
      setMessageWindowVisible(true);
      setMessage("You can't play music while in stream!");
    }
  };

  return (
    <section ref={sectionRef} onScroll={handleScroll} className="section playlist-page-section">
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
        {playlistData.isAllSongs ? (
          <div></div>
        ) : (
          <div className="container burger-menu-button-container">
            <button className="burger-menu-button" type="button">
              <FontAwesomeIcon
                ref={burgerButtonRef}
                icon={faBars}
                className="playlist-burger-menu"
              />
            </button>
            <div ref={burgerMenuRef}>
              <BurgerMenuPlaylist
                isYours={playlistData.userId === localStorage.getItem("id")}
                isBarVisible={isVisible}
                onClick={onSpanClick}
                isPublic={playlistData.type === "PUBLIC"}
                setTypeChanged={setTypeChanged}
                isFavorite={isFavorite}
                setIsFavorite={setIsFavorite}
                setIsDeleteWindowVisible={setIsDeleteWindowVisible}
              />
            </div>
          </div>
        )}
      </div>
      <div className="container playlist-songs-info-control-container">
        <div className="container playlist-songs-play-button-container">
          <button
            type="button"
            className="song-controller-button playlist-songs-play-button click"
            onClick={handlePlaylistPlay}
          >
            <FontAwesomeIcon
              icon={
                currentPlaylist.id === playlistData.id && isPlaying
                  ? faPause
                  : faPlay
              }
            />
          </button>
        </div>
        <div className="container filler-container"></div>
        <div className="container playlist-songs-uploader">
          <span className="playlist-songs-info">Uploader</span>
        </div>
        <div className="container playlist-songs-uploader">
          <span className="playlist-songs-info playlist-songs-duration-text">
            Duration
          </span>
        </div>
        <div className="container playlist-songs-upload-date">
          <span className="playlist-songs-info playlist-songs-upload-date-text">
            Upload date
          </span>
        </div>
      </div>
      <div className="container playlist-songs-container">
        {items.map((item, index) => (
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
            isCurrentSong={
              `${playlistData.id}_${item.id}` ===
              `${currentPlaylist.id}_${currentSong?.id}`
            }
            handlePlay={() => handleSongPlay(index)}
            inPlaylist={true}
            playlistUploaderId={playlistData.userId}
            isAllSongsPlaylist={playlistData.isAllSongs}
            songId={item.id}
            songUrl={item.cloudUrl}
          />
        ))}
      </div>
      <DeleteWindow
        isVisible={isDeleteWindowVisible}
        setIsVisible={setIsDeleteWindowVisible}
        imgKey={playlistData.imageUrl}
      />
      <MessageWindow
        isVisible={messageWindowVisible}
        setIsVisible={setMessageWindowVisible}
        message={message}
        profileButtonPage={false}
      />
    </section>
  );
};

export default PlaylistPageSection;
