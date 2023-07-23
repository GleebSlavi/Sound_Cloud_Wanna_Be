import { useState } from "react";
import "./create_playlist_section.css";
import default_playlist_picture from "../../../../../pictures/playlist_default_picture.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../../../../image_upload/ImageUpload";
import { uploadFileToS3 } from "../../../../../s3";

const CreatePlaylistSection = () => {
  const [isPrivateType, setPrivateType] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const navigate = useNavigate();

  const handleNotFoundPlaylist = async () => {
    if (image) {
      await uploadFileToS3(
        image,
        process.env.REACT_APP_AWS_SONG_PICTURES_BUCKET,
        setImageUrl,
        null
      );
    }

    const playlistData = {
      userId: localStorage.getItem("id"),
      name: name,
      description: description,
      type: isPrivateType ? "PRIVATE" : "PUBLIC",
      imageUrl: image ? imageUrl : null,
    };

    await axios
      .post(`http://localhost:8080/api/playlists`, playlistData)
      .then((response) => {
        alert(`Successfully created playlist ${response.data.name}`);
        navigate("/profile");
      })
      .catch((error) => {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 400) {
            alert("Playlist can't have no name! Please enter one!");
          } else if (error.response.status === 500) {
            alert("There is a problem with the server! Try again later!");
          } else {
            alert(`An error occured: ${error.response.data.message}`);
          }
        }
      });
  };

  const handleCreatePlaylist = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await axios.get(
        `http://localhost:8080/api/playlists/users/${localStorage.getItem(
          "id"
        )}/${name}`
      );

      alert(
        "There is already a playlist with this name among your playlists. Please enter another name."
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          handleNotFoundPlaylist();
        } else {
          alert(`An error occured: ${error.response.data.message}`);
        }
      }
    }
  };

  return (
    <section className="section">
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
    </section>
  );
};

export default CreatePlaylistSection;
