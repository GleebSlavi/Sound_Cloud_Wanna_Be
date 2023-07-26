import { useState, useEffect } from "react";
import PlaylistBox from "../../../playlist/playlist_box/PlaylistBox";
import { Playlist } from "../../../../interfaces/Playlist";
import "./playlist_results.css";

interface Props {
  search: string;
}

const PlaylistResults = ({search}: Props) => {
  const [items, setItems] = useState<Playlist[]>([]);

  useEffect(() => {
    
  })

  return (
    <div className="container search-page-playlists">
      {items.map((item) => (
        <PlaylistBox 
        id={item.id}
        name={item.name}
        creator={item.userId === localStorage.getItem("id") ? "you" : item.creator}
        imageUrl={item.imageUrl}
        />
      ))}
    </div>
  )
}

export default PlaylistResults;