import "./section.css";
import PlaylistBox from "../playlist/playlist_box/PlaylistBox";
import { useState, useEffect } from "react";
import { Playlist } from "../../interfaces/Playlist";
import axios from "axios";
import MessageWindow from "../message_window/MessageWindow";
import { useRef} from 'react';

const HomeSection = () => {
  const [items, setItems] = useState<Playlist[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMoreItems, setHasMoreItems] = useState(true);

  const sectionRef = useRef<HTMLElement>(null);

  const limit = 10;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_USERS_ENDPOINT}/${localStorage.getItem(
            "id"
          )}/playlists?offset=${offset}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log(response.data);
        setItems((prevItems) => [...prevItems, ...response.data]);
        if (response.data.length < limit) {
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
    <section ref={sectionRef} onScroll={handleScroll} className="section home-section">
      <div className="container home-header-container">
        <h2 className="home-header">Favorite Playlists</h2>
      </div>
      <div className="container home-playlists-container">
        {items.map((item) => (
          <PlaylistBox
            key={item.id}
            id={item.id}
            name={item.name}
            creator={
              item.userId === localStorage.getItem("id") ? "you" : item.creator
            }
            imageUrl={item.imageUrl}
            songId={null}
          />
        ))}
      </div>
      <MessageWindow
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        message={message}
      />
    </section>
  );
};

export default HomeSection;
