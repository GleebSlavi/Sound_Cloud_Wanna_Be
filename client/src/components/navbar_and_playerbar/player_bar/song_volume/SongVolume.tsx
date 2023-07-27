import "./song_volume.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp, faVolumeMute } from "@fortawesome/free-solid-svg-icons";
import { usePlayerContext } from "../../../../providers/PlayerProvider";

const SongVolume = () => {
  const [sliderValue, setSliderValue] = useState(100);
  const [previousSliderValue, setPreviousSliderValue] = useState(100);
  const [isDragged, setIsDragged] = useState(false);

  const { isMuted, setIsMuted, volume, setVolume } = usePlayerContext();

  const handleVolumeMute = (): void => {
    setIsMuted(!isMuted)
    if (!isMuted) {
      setPreviousSliderValue(sliderValue);
      setSliderValue(0);
    } else {
      if (sliderValue === 0 && isDragged) {
        setIsMuted(false);
        setSliderValue(100);
        setIsDragged(false);
      } else {
        setSliderValue(previousSliderValue);
      }
    }
  };

  const handleVolumeSlider = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = parseInt(event.target.value, 10);
    setSliderValue(value);
    setVolume(value / 100);

    if (value === 0 && !isMuted) {
      setIsMuted(true);
      setIsDragged(true);
    } else if (value !== 0 && isMuted) {
      setIsMuted(false);
    }
  };

  return (
    <div className="container song-volume-container">
      <div className="container mute-button-container">
        <button
          className="song-controller-button click"
          type="button"
          onClick={handleVolumeMute}
        >
          <FontAwesomeIcon
            icon={
              isMuted && sliderValue === 0 ? faVolumeMute : faVolumeUp
            }
          />
        </button>
      </div>
      <div className="container">
        <input
          className="volume-slider"
          type="range"
          min="0"
          max="100"
          step="1"
          value={sliderValue}
          onChange={handleVolumeSlider}
        />
      </div>
    </div>
  );
};

export default SongVolume;
