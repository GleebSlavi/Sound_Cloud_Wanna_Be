import "./section.css";
import PlaylistBox from "../playlist/playlist_box/PlaylistBox";
import { useState, useEffect } from "react";
import { Playlist } from "../../interfaces/Playlists";
import axios from "axios";

const HomeSection = () => {
  const [items, setItems] = useState<Playlist[]>([]);
  const [usernames, setUsernames] = useState<string[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/users/${localStorage.getItem("id")}/playlists`
        );

        const newItems: Playlist[] = response.data;
        setItems(newItems);

        const userIds = newItems.map((item) => item.userId);
        const usernames = await Promise.all(userIds.map((userId: string) => getUsername(userId)));
        setUsernames(usernames);
        
      } catch (error) {
        console.log(error);
      }
    };

    fetchItems();
  }, [setItems]);

  const getUsername = async (userId: string): Promise<string> => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/users/${userId}`
      );
      return (userId === localStorage.getItem("id") ? "you" : response.data.username);
      
    } catch (error) {
      console.log(error);
      return "";
    }
  };

  return (
    <section className="home-section">
      <div className="home-header-container">
        <h2 className="home-header">Favorite Playlists</h2>
      </div>
      <div className="home-playlists-container">
      {items.map((item, index) => (
          <PlaylistBox id={item.id} name={item.name} creator={usernames[index]} imageUrl={item.imageUrl} />
        ))}
      </div>
    </section>
  );
};

export default HomeSection;
