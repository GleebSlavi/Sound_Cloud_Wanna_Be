import "./create_playlist_section.css"

const CreatePlaylistSection = () => {
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
              <label className="playlist-label">Playlist name:</label>
              <input className="playlist-name-field"/>
            </div>
            <div className="playlist-description-container">
              <label className="playlist-label">Description:</label>
              <textarea className="playlist-description-field" />
            </div>
            <div className="playlist-type-container">
              <label className="playlist-label">Type:</label>
              <div className="public-playlist"></div>
              <div className="private-playlist"></div>
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