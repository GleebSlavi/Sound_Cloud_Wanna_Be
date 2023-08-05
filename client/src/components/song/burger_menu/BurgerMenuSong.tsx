import { useNavigate, useParams } from "react-router-dom";
import "./burger_menu_song.css"
import axios from "axios";
import { deleteFileFromS3 } from "../../../s3/s3";
import { awsSongBucket, awsSongPicturesBucket, playlistsEndpoint, songsEndpoint } from "../../../reusable_parameters/reusable_parameters";

interface Props {
  isYours: boolean
  isBarVisible: boolean;
  inPlaylist: boolean;
  songId: string;
  isAllSongs: boolean;
  imgKey: string | null;
  songKey: string;
}


const BurgerMenuSong = ({ isYours, isBarVisible, inPlaylist, songId, isAllSongs, imgKey, songKey }: Props) => {
  const navigate = useNavigate();

  const { uuid } = useParams();

  const removeSongFromPlaylist = async () => {
    try {
      if (!isAllSongs) {
        await axios.delete(
          `${playlistsEndpoint}/${uuid}/remove/${songId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
      } else {
        await axios.delete(
          `${songsEndpoint}/${songId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )

        deleteFileFromS3(songKey, awsSongBucket);
        if (imgKey) {
          deleteFileFromS3(imgKey, awsSongPicturesBucket);
        }
      }

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