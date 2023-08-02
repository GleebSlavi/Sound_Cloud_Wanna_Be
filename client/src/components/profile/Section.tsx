import "./section.css";
import ProfileInfo from "./profile_info/ProfileInfo";
import PlaylistBox from "../playlist/playlist_box/PlaylistBox";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { Playlist } from "../../interfaces/Playlist";

const ProfileSection = () => {
  const [items, setItems] = useState<Playlist[]>([]);

  const location = useLocation();

  const { uuid } = useParams();

  const checkPath = () => {
    return location.pathname === "/profile";
  }


  useEffect(() => {
    const fetchItems = async () => {
      try {
        const responsePlaylists = await axios.get(
          `${process.env.REACT_APP_PLAYLISTS_ENDPOINT}/user/${
            checkPath() ? localStorage.getItem("id") : uuid
          }`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setItems(
          checkPath()
            ? responsePlaylists.data
            : responsePlaylists.data.filter(
                (playlist: Playlist) => playlist.type === "PUBLIC"
              )
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchItems();
  }, [setItems]);

  return (
    <section className="section profile-section">
      <ProfileInfo />
      <div className="container playlists-header-container">
        <h3 className="playlists-header">
          {checkPath() ? "Your Playlists" : `${items[0]?.creator}'s Playlists`}
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
