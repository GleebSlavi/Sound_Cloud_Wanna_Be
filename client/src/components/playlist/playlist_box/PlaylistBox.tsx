import "./playlist_box.css"
import playlist_default_picture from '../pictures/playlist_default_picture.png'
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  id: string;
  name: string;
  creator: string;
  imageUrl: string;
}


const PlaylistBox = ({ id, name, creator, imageUrl }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="playlist-box" onClick={() => {navigate(`/playlist/${id}`);}}>
      <div className="playlist-image-container">
        <img className="playlist-image" src={imageUrl === "" ? playlist_default_picture : imageUrl} />
      </div>
      <div className="playlist-name-container">
        <span className="playlist-name">{name}</span>
      </div>
      <div className="playlist-creator-container">
        <span className="playlist-creator">by: {creator}</span>
      </div>
    </div>
  );
}

export default PlaylistBox;