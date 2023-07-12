import "./navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  return (
    <header>
      <nav className="navbar">
        <button className="button" type="button">
          Home
        </button>
        <button className="button" type="button">
          Profile
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
        <button className="button" type="button">
          Log Out
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
