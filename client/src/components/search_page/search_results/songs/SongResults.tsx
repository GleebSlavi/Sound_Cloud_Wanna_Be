import "./song_results.css"
import { useState, useEffect } from "react";
import { Song } from "../../../../interfaces/Song";
import SongBox from "../../../song/SongBox";
import { usePlayerContext } from "../../../../providers/PlayerProvider";
import { v4 as uuidv4 } from 'uuid';

interface Props {
  search: string;
}

const SongResults = ({search}: Props) => {
  const [items, setItems] = useState<Song[]>([]);

  const { setCurrentPlaylist, setSong, setCurrentSongId, currentSongId } = usePlayerContext();

  useEffect(() => {
    
  })

  const handleSongPlay = (item: Song) => {
    if (currentSongId !== item.id) {
      setCurrentPlaylist({id: uuidv4(), songs: [item]});
      setCurrentSongId(item.id);
    }
    setSong(0, item.id !== currentSongId, item.id === currentSongId);
  }

  return (
    <div className="container search-page-songs">
       {items.map((item) => (
        <SongBox
          key={item.id}
          name={item.name}
          artist={item.artist}
          uploader={
            item.userId === localStorage.getItem("id") ? "you" : item.uploader
          }
          duration={item.duration}
          uploadDate={item.uploadDate}
          imageUrl={item.imageUrl}
          isCurrentSong={item.id === currentSongId}
          handlePlay={() => handleSongPlay(item)}
        />
      ))} 
    </div>
  )
}

export default SongResults