import './section.css'
import ProfileInfo from "./profile_info/ProfileInfo";
import PlaylistBox from '../playlist/playlist_box/PlaylistBox';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Playlist } from '../../interfaces/Playlists';


const ProfileSection = () => {
  const [items, setItems] = useState<Playlist[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const responsePlaylists = await axios.get(
          `http://localhost:8080/api/playlists/user/${localStorage.getItem("id")}`
        )

        const newItems: Playlist[] = responsePlaylists.data;
        setItems(newItems);
        
        
      } catch (error) {
        console.log(error);
      }
    };

    fetchItems();
  }, [setItems]);

  return (
    <section className="profile-section">
      <ProfileInfo />
      <div className='playlists-header-container'>
          <h3 className='playlists-header'>Your Playlists</h3>
      </div>
      <div className="profile-playlists-container">
        {items.map((item) => (
          <PlaylistBox id={item.id} name={item.name} creator="you" imageUrl={item.imageUrl} />
        ))}
      </div>
    </section>
  );
}

export default ProfileSection;