import './section.css'
import ProfileInfo from "./profile_info/ProfileInfo";


const ProfileSection = () => {
  

  return (
    <section className="profile-section">
      <ProfileInfo />
      <div className='playlists-header-container'>
          <h3 className='playlists-header'>Your Playlists</h3>
      </div>
      <div className="playlists-container">
      </div>
    </section>
  );
}

export default ProfileSection;