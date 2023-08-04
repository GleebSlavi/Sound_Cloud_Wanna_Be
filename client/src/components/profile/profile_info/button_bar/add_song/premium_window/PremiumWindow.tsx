import { useNavigate } from "react-router-dom";
import "./premium_window.css";

interface Props {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
}

const PremiumWindow = ({ isVisible, setIsVisible, message }: Props) => {

  const navigate = useNavigate();

  return (
    <div className={`${isVisible && "container message-window-container"}`}>
      <div className={`message-window${isVisible ? " visible" : ""}`}>
        <div className="container">
          <span className="message-text">{message}</span>
        </div>
        <div className="container premium-buttons-container">
        <div className="container accept-button-container">
          <button
            className="premium-button"
            type="button"
            onClick={() => {navigate("/subscription")}}
          >
            Subscribe
          </button>
        </div>
        <div className="container decline-button-container">
          <button
            className="premium-button"
            type="button"
            onClick={() => setIsVisible(false)}
          >
            No
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

export default PremiumWindow;