import { useLocation, useNavigate } from "react-router-dom";
import "./button_bar.css";

const ButtonBar = () => {
  const navigate = useNavigate();

  const handleOnClickButtons = (path: string) => () => {
    navigate("/profile" + path);
  };

  return (
    <div className="container profile-buttons-container">
      <button
        className="profile-button"
        type="button"
        onClick={handleOnClickButtons("/edit_profile")}
      >
        Edit Profile
      </button>
      <button
        className="profile-button"
        type="button"
        onClick={handleOnClickButtons("/add_song")}
      >
        Add song
      </button>
      <button
        className="profile-button"
        type="button"
        onClick={handleOnClickButtons("/create_playlist")}
      >
        Create Playlist
      </button>
    </div>
  );
};

export default ButtonBar;
