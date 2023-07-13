import { useState } from "react";
import "./create_playlist_section.css"

const CreatePlaylistSection = () => {
  const [isPrivateType, setPrivateType] = useState(false);

  return (
    <section className="create-playlist-section">
      <div className="create-playlist-field">
        <div className="create-playlist-header-container">
          <h2 className="create-playlist-header">Create Playlist</h2>
        </div>
        <div className="playlist-info-container">
          <div className="playlist-picture-container">
            <div className="playlist-picture"></div>
          </div>
          <div className="playlist-data-container">
            <div className="playlist-name-container">
              <label className="playlist-label">Name:</label>
              <input className="playlist-name-field" placeholder="Enter playlist name"/>
            </div>
            <div className="playlist-description-container">
              <label className="playlist-label">Description:</label>
              <textarea className="playlist-description-field" placeholder="Enter playlist description"/>
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
          <button className="create-playlist-button" type="button">
            Create
          </button>
        </div>
      </div>
    </section>
  );
}

export default CreatePlaylistSection;