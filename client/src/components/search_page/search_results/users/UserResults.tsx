import "./user_results.css"
import {User} from "../../../../interfaces/User"
import { useState, useEffect } from "react"
import UserBox from "../../../user/UserBox"
import axios from "axios"
import { useParams } from "react-router-dom"

interface Props {
  items: User[];
}

const UserResults = ({ items }: Props) => {

  return (
    <div className="container search-page-playlists">
      {items.map((item) => (
        <UserBox 
        key={item.id}
        id={item.id}
        username={item.username}
        imageUrl={item.imageUrl}
        />
      ))}
    </div>
  )
}

export default UserResults;