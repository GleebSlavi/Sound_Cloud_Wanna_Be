import "./song_box.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPlay } from "@fortawesome/free-solid-svg-icons";
import default_song_picture from "../../pictures/default_song_picture.png";
import { useState } from "react";

interface Props {
  name: string;
  artist: string;
  uploader: string;
  duration: string;
  uploadDate: string;
  imageUrl: string | null;
}

const SongBox = ({
  name,
  artist,
  uploader,
  duration,
  uploadDate,
  imageUrl,
}: Props) => {
  const [hovering, setHovering] = useState(false);

  return (
    <div
      className="container song-box"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="container song-box-picture-container">
        <img
          className="song-box-picture"
          src={imageUrl ? imageUrl : default_song_picture}
        />
        {hovering && <FontAwesomeIcon className="song-hover" icon={faPlay} />}
      </div>
      <div className="container song-box-song-data-container">
        <div className="container song-box-song-name-container">
          <span className="song-box-song-name">{name}</span>
        </div>
        <div className="container song-box-song-artist-container">
          <span className="song-box-song-artist">{artist}</span>
        </div>
      </div>
      <div className="container song-box-song-uploader-container">
        <span className="song-box-uploader">{uploader}</span>
      </div>
      <div className="container song-box-song-duration-container">
        <span className="song-box-duration">{duration}</span>
      </div>
      <div className="container song-box-song-upload-date-container">
        <span className="song-box-upload-date">{uploadDate}</span>
      </div>
      <div className="container song-box-burger-menu-container">
        <button className="burger-menu-button" type="button">
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
    </div>
  );
};

export default SongBox;
