import "./user_results.css"
import {User} from "../../../../interfaces/User"
import { useState, useEffect } from "react"
import UserBox from "../../../user/UserBox"

interface Props {
  search: string
}

const UserResults = ({search}: Props) => {
  const [items, setItems] = useState<User[]>([]);

  useEffect(() => {
    
  })

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