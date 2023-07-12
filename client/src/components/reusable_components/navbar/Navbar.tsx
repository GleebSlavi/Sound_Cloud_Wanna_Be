import "./navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <header>
      <nav className="navbar">
        <button className="nav-bar-button" type="button">
          Home
        </button>
        <button className="nav-bar-button" type="button">
          Profile
        </button>
        <button className="nav-bar-button" type="button">
          Streams
        </button> 
        <div className="search-bar-container">
          <input
            className="search-bar"
            type="text"
            name="search"
            placeholder="What are you looking for?"
          />
          <button className="search-button" type="submit">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        <button className="nav-bar-button" type="button"
        onClick={handleLogout} >
          Log Out
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
