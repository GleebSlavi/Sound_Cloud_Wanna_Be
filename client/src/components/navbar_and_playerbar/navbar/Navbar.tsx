import "./navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useRef } from "react";

const Navbar = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { type } = useParams();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    localStorage.clear();
    alert("You are leaving SoundCloud Wanna-Be! Goodbye :c !");
    navigate("/login");
  };

  const handleOnClickButtons = (path: string) => () => {
    if (location.pathname !== path && location.pathname !== `${path}/`) {
      if (
        /^\/search\/(songs|playlists|users)\/.*?$/.test(location.pathname) &&
        inputRef.current
      ) {
        setInput("");
        inputRef.current.value = "";
      }
      navigate(path);
    }
  };

  const handleSubmut = (event: React.FormEvent) => {
    event.preventDefault();

    if (!/^\/search\/(songs|playlists|users)\/.+$/.test(location.pathname)) {
      navigate(`/search/songs/${input}`);
    } else {
      navigate(`search/${type}/${input}`);
    }
  };

  return (
    <header>
      <nav className="navbar">
        <button
          className="nav-bar-button"
          type="button"
          onClick={handleOnClickButtons("/")}
        >
          Home
        </button>
        <button
          className="nav-bar-button"
          type="button"
          onClick={handleOnClickButtons("/profile")}
        >
          Profile
        </button>
        <button
          className="nav-bar-button"
          type="button"
          onClick={handleOnClickButtons("/streams")}
        >
          Streams
        </button>
        <div className="container">
          <form
            className="container search-bar-container"
            onSubmit={handleSubmut}
          >
            <input
              ref={inputRef}
              className="search-bar welcome-input"
              type="text"
              name="search"
              placeholder="What are you looking for?"
              required
              pattern="^.+$"
              title="Please enter something to search!"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setInput(event.target.value);
              }}
            />
            <button className="search-button" type="submit">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>
        </div>
        <button className="nav-bar-button" type="button" onClick={handleLogout}>
          Log Out
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
