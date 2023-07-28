import { useNavigate, useParams } from "react-router-dom";
import "./search_entity.css"
import { useSearchContext } from "../../../providers/SearchProvider";

interface Props {
  entityName: string;
  entityCount: number;
}

const SearchEntity = ({entityName, entityCount}: Props) => {

  const { type } = useParams();
  const { search } = useSearchContext();
  const navigate = useNavigate();

  const handleOnClick = () => {
    const buttonName = entityName.toLowerCase();
    if (buttonName !== type) {
      navigate(`/search/${buttonName}/${search}`);
    }
  }

  return (
    <div className="container search-entity-container">
      <button className="entity" type="button" onClick={handleOnClick}>{entityName}</button>
      <span className="entity-count">{entityCount}</span>
    </div>
  )
}

export default SearchEntity;