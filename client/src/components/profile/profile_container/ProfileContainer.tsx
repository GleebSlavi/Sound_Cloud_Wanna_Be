import "./profile_container.css";

const ProfileContainer = () => {
  return (
    <div className="profile-container">
      <div className="profile-picture-container"></div>
      <div className="other-profile-part-container">
        <div className="user-info-container"></div>
        <div className="profile-button-container">
          <div className="cnage-password-button-container"></div>
          <div className="add-song-container"></div>
          <div className="create-playlist-container"></div>
        </div>
      </div>
    </div>
  );
}

export default ProfileContainer;