import { useNavigate, useParams } from "react-router-dom";
import "./search_entity.css";

interface Props {
  entityName: string;
  entityCount: number;
  isActive: boolean;
  onClick: () => void;
}

const SearchEntity = ({
  entityName,
  entityCount,
  isActive,
  onClick,
}: Props) => {
  const { type, "*": search } = useParams();
  const navigate = useNavigate();

  const handleOnClick = () => {
    const buttonName = entityName.toLowerCase();
    onClick();
    if (buttonName !== type) {
      navigate(`/search/${buttonName}/${search}`);
    }
  };

  return (
    <div className="container search-entity-container">
      <button
        className={`entity${isActive ? " clicked" : ""}`}
        type="button"
        onClick={handleOnClick}
      >
        {`${entityName} ${entityCount}`}
      </button>
    </div>
  );
};

export default SearchEntity;
