import { useState } from "react";
import "./create_playlist_section.css"
import default_playlist_picture from "../../../../pictures/playlist_default_picture.png"
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePlaylistSection = () => {
  const [isPrivateType, setPrivateType] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const handleNotFoundPlaylist = async () => {
      const playlistData = {
        userId: localStorage.getItem("id"),
        name: name,
        description: description,
        type: isPrivateType ? "PRIVATE" : "PUBLIC",
        imageUrl: imageUrl
      }

      await axios.post(
        `http://localhost:8080/api/playlists`,
        playlistData

      ).then(response => {
        alert(`Successfully created playlist ${response.data.name}`)
        navigate("/profile");
      }).catch(error => {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 400) {
            alert("Playlist can't have no name! Please enter one!")
          } else if (error.response.status === 500) {
            alert("There is a problem with the server! Try again later!");
          } else {
            alert(`An error occured: ${error.message}`);
          }
        }
      })
  }

  const handleCreatePlaylist = async (event: React.FormEvent) => {
      event.preventDefault();
      
      try {
        const response = await axios.get(
          `http://localhost:8080/api/playlists/users/${localStorage.getItem("id")}/${name}`
        );

        alert("There is already a playlist with this name among your playlists. Please enter another name.");
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 404) {
            handleNotFoundPlaylist();
          } else {
            alert(`An error occured: ${error.message}`)
          }
        }
      }
  }
  

  return (
    <section className="create-playlist-section">
      <div className="create-playlist-field">
        <div className="create-playlist-header-container">
          <h2 className="create-playlist-header">Create Playlist</h2>
        </div>
        <form className="playlist-form" onSubmit={handleCreatePlaylist}>
          <div className="playlist-data-container">
          <div className="playlist-picture-container">
            <img className="playlist-picture" src={default_playlist_picture}/>
          </div>
          <div className="playlist-info-container">
            <div className="playlist-name-container">
              <label className="playlist-label">Name:</label>
              <input className="playlist-name-field" required name="name" placeholder="Enter playlist name"
              pattern="^.+$" title="Playlist can't have no name" onChange={
                (event: React.ChangeEvent<HTMLInputElement>) => {
                  setName(event.target.value);
                }
              }/>
            </div>
            <div className="playlist-description-container">
              <label className="playlist-label">Description:</label>
              <textarea className="playlist-description-field" name="description" placeholder="Enter playlist description"
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                setDescription(event.target.value);
              }} />
            </div>
            <div className="playlist-type-container">
              <div className="label-container">
                <label className="playlist-label">Type:</label>
              </div>
              <div className="type-container">
                <button 
                className={`type-playlist ${ isPrivateType ? "" : "active-playlist-type"}`}
                type="button" 
                onClick={() => setPrivateType(false)}>
                  Public
                  </button>
                <button 
                className={`type-playlist ${ !isPrivateType ? "" : "active-playlist-type"}`}
                type="button"
                onClick={() => setPrivateType(true)}>
                  Private
                  </button>
              </div>
            </div>
          </div>
          </div>
          
          <div className="create-playlist-button-container">
            <button className="create-playlist-button" type="submit">
            Create
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default CreatePlaylistSection;