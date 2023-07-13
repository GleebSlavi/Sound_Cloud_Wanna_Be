import "./button_bar.css"

const ButtonBar = () => {
  return (
    <div className="profile-buttons-container">
      <button className="profile-button" type="button">
        Change password
      </button>
      <button className="profile-button" type="button">
        Add song
      </button>
      <button className="profile-button" type="button">
        Create Playlist
      </button>
    </div>
  )
}

export default ButtonBar;