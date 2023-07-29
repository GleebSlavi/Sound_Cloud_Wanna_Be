import { useParams } from "react-router-dom";
import SearchEntity from "./search_entity/SearchEntity";
import PlaylistResults from "./search_results/playlists/PlaylistResults";
import SongResults from "./search_results/songs/SongResults";
import UserResults from "./search_results/users/UserResults";
import "./section.css";
import { Playlist } from "../../interfaces/Playlist";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Song } from "../../interfaces/Song";
import { User } from "../../interfaces/User";
import axios from "axios";

const SearchPageSection = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isActive, setIsActive] = useState("songs");

  const { type, search } = useParams();

  type Item = Song[] | Playlist[] | User[];

  const fetchItems = async <T extends Item>(
    setItems: Dispatch<SetStateAction<T>>,
    endpoint: string
  ) => {
    try {
      const response = await axios.get(`${endpoint}/search/${search}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setItems(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      if (search !== "") {
        await fetchItems(setSongs, process.env.REACT_APP_SONGS_ENDPOINT!);
        await fetchItems(setUsers, process.env.REACT_APP_USERS_ENDPOINT!);
        await fetchItems(
          setPlaylists,
          process.env.REACT_APP_PLAYLISTS_ENDPOINT!
        );
      }
    })();
  }, [search, setUsers, setPlaylists, setSongs]);

  let resultsComponent;
  switch (type) {
    case "songs":
      resultsComponent = <SongResults items={songs} />;
      break;
    case "playlists":
      resultsComponent = <PlaylistResults items={playlists} />;
      break;
    case "users":
      resultsComponent = <UserResults items={users} />;
      break;
    default:
      resultsComponent = <SongResults items={songs} />;
  }

  return (
    <section className="section search-page-section">
      <div className="container search-page-top-container">
        <div className="container"></div>
        <div className="container entities-container">
          <SearchEntity
            entityName="Songs"
            entityCount={songs.length}
            isActive={isActive === "songs"}
            onClick={() => setIsActive("songs")}
          />
          <SearchEntity
            entityName="Users"
            entityCount={users.length}
            isActive={isActive === "users"}
            onClick={() => setIsActive("users")}
          />
          <SearchEntity
            entityName="Playlists"
            entityCount={playlists.length}
            isActive={isActive === "playlists"}
            onClick={() => setIsActive("playlists")}
          />
        </div>
        <div className="container"></div>
      </div>
      {resultsComponent}
    </section>
  );
};

export default SearchPageSection;
