import "./user_results.css"
import {User} from "../../../../interfaces/User"
import { useState, useEffect } from "react"
import UserBox from "../../../user/UserBox"
import axios from "axios"
import { useParams } from "react-router-dom"

const UserResults = () => {
  const [items, setItems] = useState<User[]>([]);

  const { search } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_USERS_ENDPOINT}/search/${search}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setItems(response.data);
      } catch (error) {
        console.log(error);
      }

    })();
  }, [search, setItems]);

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