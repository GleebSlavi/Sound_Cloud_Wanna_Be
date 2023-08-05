import { useState } from "react";
import "./create_playlist_section.css";
import default_playlist_picture from "../../../../../pictures/playlist_default_picture.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../../../../image_upload/ImageUpload";
import { uploadFileToS3 } from "../../../../../s3/s3";
import MessageWindow from "../../../../message_window/MessageWindow";

const CreatePlaylistSection = () => {
  const [isPrivateType, setPrivateType] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleNotFoundPlaylist = async () => {
    let imgS3Url;
    if (image) {
      imgS3Url = await uploadFileToS3(
        image,
        process.env.REACT_APP_AWS_PLAYLIST_PICTURES_BUCKET,
        null
      );
    }

    const playlistData = {
      userId: localStorage.getItem("id"),
      name: name,
      description: description,
      type: isPrivateType ? "PRIVATE" : "PUBLIC",
      imageUrl: image ? imgS3Url : null,
    };

    await axios
      .post(process.env.REACT_APP_PLAYLISTS_ENDPOINT!, playlistData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setIsVisible(true);
        setMessage(`Successfully created playlist ${response.data.name}`);
      })
      .catch((error) => {
        if (axios.isAxiosError(error) && error.response) {
          setIsVisible(true);
          if (error.response.status === 400) {
            setMessage("Playlist can't have no name! Please enter one!");
          } else if (error.response.status === 500) {
            setMessage("There is a problem with the server! Try again later!");
          } else {
            setMessage(`An error occured: ${error.response.data.message}`);
          }
        }
      });
  };

  const handleCreatePlaylist = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await axios.get(
        `${process.env.REACT_APP_PLAYLISTS_ENDPOINT!}/users/${localStorage.getItem(
          "id"
        )}/${name}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setIsVisible(true);
      setMessage(
        "There is already a playlist with this name among your playlists. Please enter another name."
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          handleNotFoundPlaylist();
        } else {
          setIsVisible(true);
          setMessage(`An error occured: ${error.response.data.message}`);
        }
      }
    }
  };

  return (
    <section className="section create-playlist-page-section">
      <div className="button-bar-field">
        <div className="container button-bar-header-container">
          <h2 className="button-bar-header">Create Playlist</h2>
        </div>
        <form
          className="container button-bar-form"
          onSubmit={handleCreatePlaylist}
        >
          <div className="container button-bar-data-container">
            <ImageUpload
              imgStyleClass=" playlist-picture"
              defaultPicture={default_playlist_picture}
              imageUrl={imageUrl}
              setImage={setImage}
              setImageUrl={setImageUrl}
            />
            <div className="container playlist-info-container">
              <div className="container playlist-name-container">
                <label className="playlist-label">Name:</label>
                <input
                  className="playlist-name-field"
                  required
                  name="name"
                  placeholder="Enter playlist name"
                  pattern="^.+$"
                  title="Playlist can't have no name"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setName(event.target.value);
                  }}
                />
              </div>
              <div className="container playlist-description-container">
                <label className="playlist-label">Description:</label>
                <textarea
                  className="playlist-description-field"
                  name="description"
                  placeholder="Enter playlist description"
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setDescription(event.target.value);
                  }}
                />
              </div>
              <div className="container playlist-type-container">
                <div className="label-container">
                  <label className="playlist-label">Type:</label>
                </div>
                <div className="type-container">
                  <button
                    className={`type-playlist ${
                      isPrivateType ? "" : "active-playlist-type"
                    }`}
                    type="button"
                    onClick={() => setPrivateType(false)}
                  >
                    Public
                  </button>
                  <button
                    className={`type-playlist ${
                      !isPrivateType ? "" : "active-playlist-type"
                    }`}
                    type="button"
                    onClick={() => setPrivateType(true)}
                  >
                    Private
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            <button className="button-bar-button" type="submit">
              Create
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
    </section>
  );
};

export default CreatePlaylistSection;
