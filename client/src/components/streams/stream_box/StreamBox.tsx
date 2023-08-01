import "./stream_box.css"
import default_picture from "../../../pictures/default_profile_picture.png"

const StreamBox = () => {

  return (
    <div className="container stream-box">
      <div className="container stream-owner-container">
        <div className="container stream-owner-picture-container">
          <img className="stream-owner-picture" src={default_picture}/>
        </div>
        <div className="container">
          <span className="stream-owner">Stream owner name</span>
        </div>
      </div>
      <div className="container stream-info-container">
        <div className="container stream-song-info-container">
          <div className="container">
            <span className="stream-song-name">Song Name</span>
         </div>
          <div className="container">
            <span className="stream-song-artist">Song artist</span>
          </div>
        </div>
        <div className="container listeners-container">
          <span className="listeners">34</span>
        </div>
      </div>
    </div>
  )
}

export default StreamBox;