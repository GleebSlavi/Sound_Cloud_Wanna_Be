import "./add_song_section.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef } from "react";
import default_song_picture from '../../../../../pictures/default_song_picture.png'
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";
import {s3} from "../../../../../s3/s3";

const AddSongSection = () => {
  const [isFreeSong, setFreeSong] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [artist, setArtist] = useState("");
  const [year, setYear] = useState(2023);
  const [file, setFile] = useState<File | null>(null);
  const [hovering, setHovering] = useState(false);

  const fileInputRefSong = useRef<HTMLInputElement>(null);
  const fileInputRefImg = useRef<HTMLInputElement>(null);

  const handleFileSelectSong = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files && event.target.files[0];
      console.log("nz");
      if (selectedFile) {
        console.log(selectedFile.name);
        setFile(selectedFile);
      }
  }

  const handleFileSelectImg = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    console.log("nz");
    if (selectedFile) {
      console.log(selectedFile.name);
      setImage(selectedFile);
    }
}

  const handleIconClick = () => {
    if (file) {
      setFile(null);
    }
  };

  const handleAddSong = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();


  }

  return (
    <section className="add-song-section">
      <div className="add-song-field">
        <div className="add-song-header-container">
          <h2 className="add-song-header">Add Song</h2>
        </div>
        <form className="add-song-form">
        <div className="add-song-data-container">
          <div className="song-picture-upload-container">
            <div className="song-picture-container">
              <img className="song-picture" 
                src={!imageUrl ? default_song_picture : imageUrl}
                onClick={() => fileInputRefImg.current?.click()}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}/>
                {hovering && <span className="change-image-text-song">Add photo</span>}
                <input
                type="file"
                accept="image/*"
                ref={fileInputRefImg}
                style={{ display: 'none' }}
                onChange={handleFileSelectImg}
                />
            </div>
            <div className="upload-container">
              <div className="upload-button-container">
                <button className="upload-button" type="button"
                onClick={() => fileInputRefSong.current?.click()}>Upload song</button>
                <input
                type="file"
                ref={fileInputRefSong}
                style={{ display: 'none' }}
                accept=".mp3"
                onChange={handleFileSelectSong}
                />
              </div>
              <div className="uploaded-song-icon-container">
                <FontAwesomeIcon className="uploaded-song-icon" icon={!file ? faX : faCheck}
                onClick={handleIconClick}/>
              </div>
          </div>
          </div>
          <div className="add-song-info-container">
            <div className="song-data-input-container">
              <label className="song-label">Name:</label>
              <div className="song-input-container">
                <input 
                className="song-input-field" 
                placeholder="Enter song name" 
                required
                onChange={
                  (event: React.ChangeEvent<HTMLInputElement>) => {
                    setName(event.target.value);
                  }
                }
                pattern="^.+$"
                title="Song can't have no name!"/>
              </div>
            </div>
            <div className="song-data-input-container">
              <label className="song-label">Artist:</label>
              <div className="song-input-container">
                <input 
                className="song-input-field" 
                placeholder="Enter song artist" 
                required
                onChange={
                  (event: React.ChangeEvent<HTMLInputElement>) => {
                    setArtist(event.target.value);
                  }
                }
                pattern="^.+$"
                title="Artist can't have no name!"/>
              </div>
            </div>
            <div className="song-year-upload-container">
              <div className="song-data-input-container song-year-input-container">
                <label className="song-label">Release year:</label>
                <div className="song-input-container">
                  <input 
                  className="song-input-year" 
                  placeholder="Enter song year" 
                  required
                  onChange={
                  (event: React.ChangeEvent<HTMLInputElement>) => {
                    setYear(parseInt(event.target.value));
                  }
                  }
                  pattern="^(18[0-9][0-9]|19[0-9][0-9]|20[01][0-9]|202[0-3])$"
                  title="Song year can't be less than 1800 and more than 2023!"/>
                </div>
              </div>
              <div className="song-type-container">
                <div className="song-label-container">
                  <label className="song-label">Type:</label>
                </div>
                <div className="song-types">
                  <button 
                  className={`type-playlist ${ !isFreeSong ? "" : "active-playlist-type"}`}
                  type="button" 
                  onClick={() => setFreeSong(true)}>
                    Free
                  </button>
                  <button 
                  className={`type-playlist ${ isFreeSong ? "" : "active-playlist-type"}`}
                  type="button"
                  onClick={() => setFreeSong(false)}>
                    Paid
                  </button>
              </div>
            </div>
            </div>
          </div>
        </div>
        <div className="add-song-button-container">
          <button className="add-song-button" type="submit" onClick={handleAddSong}>
            Add
          </button>
        </div>
        </form>
      </div>
    </section>
  )
}

export default AddSongSection;
