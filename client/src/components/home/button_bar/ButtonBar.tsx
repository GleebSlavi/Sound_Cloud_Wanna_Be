import "./button_bar.css";

const ButtonBar = () => {
  return (
    <div className="button-bar">
      <div></div>
      <button className="button" type="button">
        Favorite Playlists
      </button>
      <button className="button" type="button">
        Streams
      </button>
      <div></div>
    </div>
  );
};

export default ButtonBar;
