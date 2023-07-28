import { useNavigate, useParams } from "react-router-dom";
import "./burger_menu_song.css"
import axios from "axios";

interface Props {
  isYours: boolean
  isBarVisible: boolean;
  inPlaylist: boolean;
  songId: string;
  isAllSongs: boolean
}


const BurgerMenuSong = ({ isYours, isBarVisible, inPlaylist, songId, isAllSongs }: Props) => {
  const navigate = useNavigate();

  const { uuid } = useParams();

  const removeSongFromPlaylist = async () => {
    try {
      !isAllSongs 
        ? await axios.delete(
          `${process.env.REACT_APP_PLAYLISTS_ENDPOINT}/${uuid}/remove/${songId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        : await axios.delete(
          `${process.env.REACT_APP_SONGS_ENDPOINT}/${songId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
      window.location.reload();
    } catch (error) {
      console.log(error);
    }

  }

  return (
      <div className={`container burger-menu-song${inPlaylist ? " bigger-song-menu": ""}
      ${isBarVisible ? " visible" : ""}`}>
        <div className="container">
          <span className="burger-menu-text" onClick={() => navigate(`/add-to-playlist/${songId}`)}>Add to playlist</span>
        </div>
        {inPlaylist && isYours && (
        <div className="container bottom-menu-button-container">
          <span className="burger-menu-text" onClick={removeSongFromPlaylist}>
            {isAllSongs ? "Remove song" : "Remove from playlist"}</span>
        </div>
        )}
      </div>
  )
}

export default BurgerMenuSong;