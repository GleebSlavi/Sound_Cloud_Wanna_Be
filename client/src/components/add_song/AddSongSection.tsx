import "./add_song_section.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";

const AddSongSection = () => {
  return (
    <section className="add-song-section">
      <div className="add-song-field">
        <div className="create-playlist-header-container">
          <h2 className="add-song-header">Add Song</h2>
        </div>
        <div className="add-song-data-container">
          <div className="song-picture-container">
            <div className="song-picture"></div>
          </div>
          <div className="add-song-info-container">
            <div className="song-data-input-container">
              <label className="song-label">Name:</label>
              <div className="song-input-container">
                <input className="song-input-field" placeholder="Enter song name" />
              </div>
            </div>
            <div className="song-data-input-container">
              <label className="song-label">Artist:</label>
              <div className="song-input-container">
                <input className="song-input-field" placeholder="Enter song artist" />
              </div>
            </div>
            <div className="song-year-upload-container">
              <div className="song-data-input-container song-year-input-container">
                <label className="song-label">Release year:</label>
                <div className="song-input-container">
                  <input className="song-input-year" placeholder="Enter song year" />
                </div>
              </div>
              <div className="upload-container">
                <div className="upload-button-container">
                  <button className="upload-button" type="button">Upload</button>
                </div>
                <div className="uploaded-song-icon-container">
                  <FontAwesomeIcon className="uploaded-song-icon" icon={faX}/>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="add-song-button-container">
          <button className="add-song-button" type="button">
            Add
          </button>
        </div>
      </div>
    </section>
  )
}

export default AddSongSection;
