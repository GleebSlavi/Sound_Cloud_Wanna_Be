import ButtonBar from './button_bar/ButtonBar';
import './user_profile_info.css'

const UserProfileInfo = () => {
  return (
    <div className="user-profile-info-container">
      <h2 className="user-username-header">Username</h2>
      <ButtonBar />
    </div>
  );

}

export default UserProfileInfo;