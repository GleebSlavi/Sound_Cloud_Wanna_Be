import { useState, useEffect } from "react";
import PlaylistBox from "../../../playlist/playlist_box/PlaylistBox";
import { Playlist } from "../../../../interfaces/Playlist";
import "./playlist_results.css";
import { useParams } from "react-router-dom";

interface Props {
  items: Playlist[];
}


const PlaylistResults = ({ items }: Props) => {

  return (
    <div className="container search-page-playlists">
      {items.map((item) => (
        <PlaylistBox 
        id={item.id}
        name={item.name}
        creator={item.userId === localStorage.getItem("id") ? "you" : item.creator}
        imageUrl={item.imageUrl}
        songId={null}
        />
      ))}
    </div>
  )
}

export default PlaylistResults;