import { useLocation } from "react-router-dom";
import "./section.css";
import { useEffect, useState, useRef } from "react";
import { Playlist } from "../../../interfaces/Playlists";
import { Song } from "../../../interfaces/Song";
import axios from "axios";
import default_playlist_picture from "../../../pictures/playlist_default_picture.png";
import SongBox from "../../song/SongBox";
import { playlistsEndpoint, usersEndpoint } from "../../../reusable";
import { uploadFileToS3 } from "../../../s3";

const PlaylistPageSection = () => {
  const location = useLocation();
  const [playlist, setPlaylist] = useState<Playlist>({
    id: "",
    userId: "",
    name: "",
    description: "",
    isAllSongs: false,
    createDate: "",
    type: "",
    imageUrl: null,
  });
  const [username, setUsername] = useState("");
  const [items, setItems] = useState<Song[]>([]);
  const [hovering, setHovering] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const fileInputRefImg = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const uuid = location.pathname.split("/playlist/")[1];

        const responsePlaylist = await axios.get(
          `${playlistsEndpoint}/id/${uuid}`
        );
        setPlaylist(responsePlaylist.data);
        setImageUrl(playlist.imageUrl);

        const responseUser = await axios.get(
          `${usersEndpoint}/${responsePlaylist.data.userId}`
        );
        setUsername(responseUser.data.username);

        const responseSongs = await axios.get(
          `${playlistsEndpoint}/${responsePlaylist.data.id}/songs`
        );
        setItems(responseSongs.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [location, setPlaylist, setUsername, setItems]);

  const getUser = async (userId: string): Promise<string> => {
    try {
      const response = await axios.get(`${usersEndpoint}/${userId}`);
      return response.data.username;
    } catch (error) {
      console.log(error);
      return "";
    }
  };

  const handleFileSelectImg = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      await uploadFileToS3(
        file,
        process.env.REACT_APP_AWS_PLAYLIST_PICTURES_BUCKET,
        setImageUrl,
        imageUrl ? imageUrl.split("/").slice(-1)[0] : null
      );

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const secondsToMMSS = (durationInSeconds: number): string => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    const formattedMinutes = minutes < 10 ? `${minutes}` : `0${minutes}`;
    return `${formattedMinutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <section className="section playlist-page-section">
      <div className="container playlist-page-info-container">
        <div className="container playlist-info-left-container">
          <div className="container">
            <img
              className="playlist-page-picture"
              src={!imageUrl ? default_playlist_picture : imageUrl}
              onClick={() => fileInputRefImg.current?.click()}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            />
            {hovering && (
              <span className="change-image-text-playlist">
                {!imageUrl ? "Add photo" : "Change photo"}
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRefImg}
              style={{ display: "none" }}
              onChange={handleFileSelectImg}
            />
          </div>
          <div className="container">
            <span className="playlist-page-type">
              {playlist.type.charAt(0).toUpperCase() +
                playlist.type.slice(1).toLowerCase()}{" "}
              Playlist
            </span>
          </div>
        </div>
        <div className="container playlist-info-right-container">
          <div className="container playlist-page-name-container">
            <span className="playlist-page-name">{playlist.name}</span>
          </div>
          <div className="container playlist-page-description-container">
            <span className="playlist-page-description">
              {playlist.description}
            </span>
          </div>
          <div className="container playlist-page-data-container">
            <div className="container playlist-page-creator-container">
              <span className="playlist-page-creator">
                by:{" "}
                {playlist.userId !== localStorage.getItem("id")
                  ? username
                  : "you"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="container playlist-songs-container">
        {items.map((item) => (
          <SongBox
            key={item.id}
            name={item.name}
            artist={item.artist}
            uploader={"you"}
            duration={secondsToMMSS(item.duration)}
            uploadDate={item.uploadDate}
            imageUrl={item.imageUrl}
          />
        ))}
      </div>
    </section>
  );
};

export default PlaylistPageSection;
