import { useParams } from "react-router-dom";
import { useSearchContext } from "../../providers/SearchProvider";
import SearchEntity from "./search_entity/SearchEntity";
import PlaylistResults from "./search_results/playlists/PlaylistResults";
import SongResults from "./search_results/songs/SongResults";
import UserResults from "./search_results/users/UserResults";
import "./section.css"


const SearchPageSection = () => {
  const { search } = useSearchContext();
  const { type } = useParams();

  let resultsComponent;
  switch (type) {
    case 'songs':
      resultsComponent = <SongResults />;
      break;
    case 'playlists':
      resultsComponent = <PlaylistResults />;
      break;
    case 'users':
      resultsComponent = <UserResults />;
      break;
    default:
      resultsComponent = <SongResults />;
  }

  return (
    <section className="section search-page-section">
      <div className="container search-page-top-container">
        <div className="container"></div>
        <div className="container entities-container">
          <SearchEntity entityName="Songs"/>
          <SearchEntity entityName="Users"/>
          <SearchEntity entityName="Playlists"/>
        </div>
        <div className="container"></div>
      </div>
      {resultsComponent}
    </section>
  )
}

export default SearchPageSection;