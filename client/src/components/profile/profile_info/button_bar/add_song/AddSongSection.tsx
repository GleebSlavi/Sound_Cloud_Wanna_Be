import "./add_song_section.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faL, faX } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef } from "react";
import default_song_picture from "../../../../../pictures/default_song_picture.png";
import { uploadFileToS3 } from "../../../../../s3";
import axios from "axios";
import { songsEndpoint } from "../../../../../reusable";
import { useNavigate } from "react-router-dom";

const AddSongSection = () => {
  const [isFreeSong, setFreeSong] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [artist, setArtist] = useState("");
  const [year, setYear] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [hovering, setHovering] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioSrc, setAudioSrc] = useState("");

  const fileInputRefSong = useRef<HTMLInputElement>(null);
  const fileInputRefImg = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const navigate = useNavigate();

  const handleFileSelectSong = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAudioSrc(URL.createObjectURL(selectedFile));
    }
  };

  const handleFileSelectImg = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      setImage(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleIconClick = () => {
    if (file) {
      setFile(null);
    }
  };

  const handleMetadataLoaded = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAddSong = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    if (file) {
      await uploadFileToS3(
        file,
        process.env.REACT_APP_AWS_SONGS_BUCKET,
        setFileUrl,
        null
      );

      if (image) {
        await uploadFileToS3(
          image,
          process.env.REACT_APP_AWS_SONG_PICTURES_BUCKET,
          setImageUrl,
          null
        );
      }

      const songData = {
        userId: localStorage.getItem("id"),
        name: name,
        artist: artist,
        releaseYear: year,
        duration: duration,
        type: isFreeSong ? "FREE" : "PAID",
        imageUrl: imageUrl ? imageUrl : null,
        cloudUrl: fileUrl,
      };

      try {
        await axios.post(`${songsEndpoint}`, songData);
        alert(`Successfuly uploaded ${name} by ${artist}`);
        navigate("/profile");
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 400) {
            alert("Song name and artist can't be less than 1 character!");
          } else if (error.response.status === 500) {
            alert("There is a problem with the server! Try again later!");
          } else {
            alert(`An error occured: ${error.response.data.message}`);
          }
        }
      }
      return;
    }
    alert("You need to upload an .mp3 file!");
  };

  return (
    <section className="section">
      <div className="button-bar-field">
        <div className="container button-bar-header-container">
          <h2 className="button-bar-header">Add Song</h2>
        </div>
        <form className="container button-bar-form" onSubmit={handleAddSong}>
          <div className="container add-song-data-container button-bar-data-container">
            <div className="container song-picture-upload-container">
              <div className="container add-picture-container">
                <img
                  className="add-picture song-picture"
                  src={!imageUrl ? default_song_picture : imageUrl}
                  onClick={() => fileInputRefImg.current?.click()}
                  onMouseEnter={() => setHovering(true)}
                  onMouseLeave={() => setHovering(false)}
                />
                {hovering && (
                  <span className="picture-text-pop-up">Add photo</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRefImg}
                  style={{ display: "none" }}
                  onChange={handleFileSelectImg}
                />
              </div>
              <div className="container upload-container">
                <div className="container upload-button-container">
                  <button
                    className="upload-button"
                    type="button"
                    onClick={() => fileInputRefSong.current?.click()}
                  >
                    Upload song
                  </button>
                  <input
                    type="file"
                    ref={fileInputRefSong}
                    style={{ display: "none" }}
                    accept=".mp3"
                    onChange={handleFileSelectSong}
                  />
                  <audio
                    ref={audioRef}
                    controls={false}
                    preload="metadata"
                    src={audioSrc}
                    onLoadedMetadata={handleMetadataLoaded}
                  />
                </div>
                <div className="container uploaded-song-icon-container">
                  <FontAwesomeIcon
                    className="uploaded-song-icon"
                    icon={!file ? faX : faCheck}
                    onClick={handleIconClick}
                  />
                </div>
              </div>
            </div>
            <div className="container add-song-info-container">
              <div className="container song-data-input-container">
                <label className="song-label">Name:</label>
                <div className="container song-input-container">
                  <input
                    className="song-input-field"
                    placeholder="Enter song name"
                    required
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setName(event.target.value);
                    }}
                    pattern="^.+$"
                    title="Song can't have no name!"
                  />
                </div>
              </div>
              <div className="container song-data-input-container">
                <label className="song-label">Artist:</label>
                <div className="container song-input-container">
                  <input
                    className="song-input-field"
                    placeholder="Enter song artist"
                    required
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setArtist(event.target.value);
                    }}
                    pattern="^.+$"
                    title="Artist can't have no name!"
                  />
                </div>
              </div>
              <div className="container song-year-upload-container">
                <div className="container song-data-input-container song-year-input-container">
                  <label className="song-label">Release year:</label>
                  <div className="container song-input-container">
                    <input
                      className="song-input-year"
                      placeholder="Enter song year"
                      required
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setYear(parseInt(event.target.value));
                      }}
                      pattern="^(18[0-9][0-9]|19[0-9][0-9]|20[01][0-9]|202[0-3])$"
                      title="Song year can't be less than 1800 and more than 2023!"
                    />
                  </div>
                </div>
                <div className="container song-type-container">
                  <div className="song-label-container">
                    <label className="song-label">Type:</label>
                  </div>
                  <div className="container song-types">
                    <button
                      className={`type-playlist ${
                        !isFreeSong ? "" : "active-playlist-type"
                      }`}
                      type="button"
                      onClick={() => setFreeSong(true)}
                    >
                      Free
                    </button>
                    <button
                      className={`type-playlist ${
                        isFreeSong ? "" : "active-playlist-type"
                      }`}
                      type="button"
                      onClick={() => setFreeSong(false)}
                    >
                      Paid
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <button className="button-bar-button" type="submit">
              Add
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddSongSection;
