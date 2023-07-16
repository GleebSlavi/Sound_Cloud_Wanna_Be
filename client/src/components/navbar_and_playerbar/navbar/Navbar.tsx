import "./navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleOnClickButtons = (path: string) => () => {
    if (location.pathname !== path && location.pathname !== `${path}/`) {
      navigate(path);
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
        <div className="search-bar-container">
          <input
            className="search-bar welcome-input"
            type="text"
            name="search"
            placeholder="What are you looking for?"
          />
          <button className="search-button" type="submit">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        <button className="nav-bar-button" type="button" onClick={handleLogout}>
          Log Out
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
