import "./profile_info.css";
import UserProfileInfo from "./user_profile_info/UserProfileInfo";
import pic from './kur.jpeg'

const ProfileInfo = () => {
  return (
    <div className="profile-container">
      <div className="profile-picture-container">
        <img className="profile-picture" alt="kur"></img>
      </div>
      <UserProfileInfo />
    </div>
  );
}

export default ProfileInfo;