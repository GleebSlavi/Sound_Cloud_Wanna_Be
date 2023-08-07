import "./add_song_section.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faL, faX } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef } from "react";
import default_song_picture from "../../../../../pictures/default_song_picture.png";
import { uploadFileToS3 } from "../../../../../s3/s3";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../../../../image_upload/ImageUpload";
import MessageWindow from "../../../../message_window/MessageWindow";
import { useEffect } from "react";
import { User } from "../../../../../interfaces/User";
import PremiumWindow from "./premium_window/PremiumWindow";
import { awsSongBucket, awsSongPicturesBucket, songsEndpoint, usersEndpoint } from "../../../../../reusable_parameters/reusable_parameters";

const AddSongSection = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [artist, setArtist] = useState("");
  const [year, setYear] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [audioSrc, setAudioSrc] = useState("");
  const [user, setUser] = useState<User>({
    id: "",
    username: "",
    imageUrl: null,
    isPremium: false,
    leftSongs: 0,
    role: "",
  });

  const [isVisible, setIsVisible] = useState(false);
  const [premiumWindowVisible, setPremiumWindowVisible] = useState(false);
  const [message, setMessage] = useState("");

  const fileInputRefSong = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${usersEndpoint}/${localStorage.getItem(
            "id"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleFileSelectSong = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAudioSrc(URL.createObjectURL(selectedFile));
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

    if (!user.isPremium && user.leftSongs <= 0) {
      setPremiumWindowVisible(true);
      setMessage(
        "You've run out of uploads. Become premium user and upload unlimited or wait till Monday."
      );
      return;
    }

    if (file) {
      let songS3Url = await uploadFileToS3(
        file,
        awsSongBucket,
        null
      );

      let imgS3Url;
      if (image) {
        imgS3Url = await uploadFileToS3(
          image,
          awsSongPicturesBucket,
          null
        );
      }

      const songData = {
        userId: localStorage.getItem("id"),
        name: name,
        artist: artist,
        releaseYear: year,
        duration: duration,
        imageUrl: image ? imgS3Url : null,
        cloudUrl: songS3Url,
      };

      try {
        await axios.post(`${songsEndpoint}`, songData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!user.isPremium) {
          const userData = {
            leftSongs: user.leftSongs - 1,
          };

          await axios.patch(
            `${usersEndpoint}/${localStorage.getItem(
              "id"
            )}`,
            userData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
        }
        setIsVisible(true);
        setMessage(
          `Successfuly uploaded ${name} by ${artist}.${
            !user.isPremium
              ? ` You got ${user.leftSongs - 1} uploads left.`
              : ""
          }`
        );
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setIsVisible(true);
          if (error.response.status === 400) {
            setMessage("Song name and artist can't be less than 1 character!");
          } else if (error.response.status === 500) {
            setMessage("There is a problem with the server! Try again later!");
          } else {
            setMessage(`An error occured: ${error.response.data.message}`);
          }
        }
      }
      return;
    }
    setIsVisible(true);
    setMessage("You need to upload an .mp3 file!");
  };

  return (
    <section className="section add-song-section">
      <div className="button-bar-field">
        <div className="container button-bar-header-container">
          <h2 className="button-bar-header">Add Song</h2>
        </div>
        <form className="container button-bar-form" onSubmit={handleAddSong}>
          <div className="container button-bar-data-container">
            <div className="container song-picture-upload-container">
              <ImageUpload
                imgStyleClass=" song-picture"
                defaultPicture={default_song_picture}
                imageUrl={imageUrl}
                setImage={setImage}
                setImageUrl={setImageUrl}
              />
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
            </div>
          </div>
          <div className="container">
            <button className="button-bar-button" type="submit">
              Add
            </button>
          </div>
        </form>
      </div>
      <MessageWindow
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        message={message}
        profileButtonPage={true}
      />
      <PremiumWindow
        isVisible={premiumWindowVisible}
        setIsVisible={setPremiumWindowVisible}
        message={message}
      />
    </section>
  );
};

export default AddSongSection;
