import "./section.css";
import PlaylistBox from "../playlist/playlist_box/PlaylistBox";
import { useState, useEffect } from "react";
import { Playlist } from "../../interfaces/Playlist";
import axios from "axios";
import MessageWindow from "../message_window/MessageWindow";
import { useRef} from 'react';
import PremiumWindow from "../profile/profile_info/button_bar/add_song/premium_window/PremiumWindow";
import { useLocation } from "react-router-dom";
import { usersEndpoint } from "../../reusable_parameters/reusable_parameters";

const HomeSection = () => {
  const [items, setItems] = useState<Playlist[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isPremiumWindowVisible, setIsPremiumWindowVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMoreItems, setHasMoreItems] = useState(true);

  const sectionRef = useRef<HTMLElement>(null);

  const location = useLocation();

  const limit = 10;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          `${usersEndpoint}/${localStorage.getItem(
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

  useEffect(() => {
    if (location.state && location.state.from == "/login") {
      setIsPremiumWindowVisible(true);
      setMessage("Become subscriber and get unlimited uploads.");
    }
  }, []);

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
        profileButtonPage={false}
      />
      <PremiumWindow  isVisible={isPremiumWindowVisible} setIsVisible={setIsPremiumWindowVisible} message={message} />
    </section>
  );
};

export default HomeSection;
