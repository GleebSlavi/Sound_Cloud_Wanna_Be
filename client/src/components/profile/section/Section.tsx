import './section.css'
import ProfileContainer from "../profile_container/ProfileContainer";


const ProfileSection = () => {
  return (
    <section className="profile-section">
      <ProfileContainer />
      <div className="playlists-container">

      </div>
    </section>
  );
}

export default ProfileSection;