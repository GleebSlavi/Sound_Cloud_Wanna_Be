import "./playlist_box.css";
import playlist_default_picture from "../../../pictures/playlist_default_picture.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { playlistsEndpoint } from "../../../reusable_parameters/reusable_parameters";

interface Props {
  id: string;
  name: string;
  creator: string;
  imageUrl: string | null;
  songId: string | null;
}

const PlaylistBox = ({ id, name, creator, imageUrl, songId }: Props) => {
  const navigate = useNavigate();

  const handleOnClick = async () => {
    if (songId) {
      handleAddSongToPlaylist();
    } 
    navigate(`/playlist/${id}`);
  }

  const handleAddSongToPlaylist = async () => {
    try {
      await axios.post(
        `${playlistsEndpoint}/${id}/add/${songId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className="playlist-box"
      onClick={handleOnClick}
    >
      <div className="container">
        <img
          className="playlist-image"
          src={!imageUrl ? playlist_default_picture : imageUrl}
        />
      </div>
      <div className="container">
        <span className="playlist-name">{name}</span>
      </div>
      <div className="container">
        <span className="playlist-creator">by: {creator}</span>
      </div>
    </div>
  );
};

export default PlaylistBox;
