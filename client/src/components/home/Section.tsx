import "./section.css";
import PlaylistBox from "../playlist/playlist_box/PlaylistBox";
import { useState, useEffect } from "react";
import { Playlist } from "../../interfaces/Playlists";
import axios from "axios";

const HomeSection = () => {
  const [items, setItems] = useState<Playlist[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/users/${localStorage.getItem(
            "id"
          )}/playlists`
        );

        setItems(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchItems();
  }, [setItems]);

  return (
    <section className="section home-section">
      <div className="container home-header-container">
        <h2 className="home-header">Favorite Playlists</h2>
      </div>
      <div className="container home-playlists-container">
        {items.map((item) => (
          <PlaylistBox
            id={item.id}
            name={item.name}
            creator={
              item.userId === localStorage.getItem("id") ? "you" : item.creator
            }
            imageUrl={item.imageUrl}
          />
        ))}
      </div>
    </section>
  );
};

export default HomeSection;
