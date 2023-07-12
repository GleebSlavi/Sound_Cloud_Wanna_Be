import './song_volume.css'
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';

const SongVolume = () => {
  const [isVolumeMuted, setVolumeMuted] = useState(false);
  const [sliderValue, setSliderValue] = useState(100);
  const [previousSliderValue, setPreviousSliderValue] = useState(100);
  const [isDragged, setIsDragged] = useState(false);

  const handleVolumeMute = (): void => {
    setVolumeMuted(!isVolumeMuted)
    if (!isVolumeMuted) {
      setPreviousSliderValue(sliderValue);
      setSliderValue(0);
    } else {
      if (sliderValue === 0 && isDragged) {
        setVolumeMuted(false);
        setSliderValue(100);
        setIsDragged(false);
      } else {
        setSliderValue(previousSliderValue);
      }
    }
  };
  
  const handleVolumeSlider = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(event.target.value, 10);
    setSliderValue(value);
  
    if (value === 0 && !isVolumeMuted) {
      setVolumeMuted(true);
      setIsDragged(true);
    } else if (value !== 0 && isVolumeMuted) {
      setVolumeMuted(false);
    }
  };
  

  return (
    <div className="song-volume-container">
      <div className="mute-button-container">
        <button className="song-controller-button" type="button"
        onClick={handleVolumeMute}>
          <FontAwesomeIcon icon={ (isVolumeMuted && sliderValue === 0) ? 
            faVolumeMute : faVolumeUp } />
        </button>
      </div>
      <div className="slide-container">
        <input className="volume-slider" type="range" min="0" 
        max="100" step="1" value={sliderValue} 
        onChange={handleVolumeSlider}/>
      </div>

    </div>
  )
}

export default SongVolume;