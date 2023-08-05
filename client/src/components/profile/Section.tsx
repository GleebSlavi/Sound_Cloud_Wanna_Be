import "./section.css";
import ProfileInfo from "./profile_info/ProfileInfo";
import PlaylistBox from "../playlist/playlist_box/PlaylistBox";
import { useEffect, useState, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { Playlist } from "../../interfaces/Playlist";
import { playlistsEndpoint } from "../../reusable_parameters/reusable_parameters";


const ProfileSection = () => {
  const [items, setItems] = useState<Playlist[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [username, setUsername] = useState("");

  const sectionRef = useRef<HTMLElement>(null);

  const limit = 10;

  const location = useLocation();

  const { uuid } = useParams();

  const checkPath = () => {
    return location.pathname === "/profile";
  }


  useEffect(() => {
    const fetchItems = async () => {
      try {
        const responsePlaylists = await axios.get(
          `${playlistsEndpoint}/user/${
            checkPath() ? localStorage.getItem("id") : uuid
          }?offset=${offset}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setItems(
          checkPath()
            ? (prevItems) => [...prevItems, ...responsePlaylists.data]
            : (prevItems) => [...prevItems, ...responsePlaylists.data.filter(
                (playlist: Playlist) => playlist.type === "PUBLIC"
              )]
        );

        if (responsePlaylists.data.length < limit) {
          setHasMoreItems(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchItems();
  }, [offset]);

  const handleScroll = () => {
    if (sectionRef.current && 
      sectionRef.current.scrollTop + (window.innerHeight / 2) > sectionRef.current.scrollHeight / 2
      && hasMoreItems) {
        setOffset(offset + limit);
  }
  }

  return (
    <section ref={sectionRef} onScroll={handleScroll} className="section profile-section">
      <ProfileInfo setUsernameForPlaylist={setUsername}/>
      <div className="container playlists-header-container">
        <h3 className="playlists-header">
          {checkPath() ? "Your playlists" : `${username}'s playlists`}
        </h3>
      </div>
      <div className="container profile-playlists-container">
        {items.map((item) => (
          <PlaylistBox
            key={item.id}
            id={item.id}
            name={item.name}
            creator="you"
            imageUrl={item.imageUrl}
            songId={null}
          />
        ))}
      </div>
    </section>
  );
};

export default ProfileSection;
