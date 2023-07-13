import "./profile_info.css";
import UserProfileInfo from "./user_profile_info/UserProfileInfo";

const ProfileInfo = () => {
  return (
    <div className="profile-container">
      <div className="profile-picture-container">
        <div className="profile-picture"></div>
      </div>
      <UserProfileInfo />
    </div>
  );
}

export default ProfileInfo;