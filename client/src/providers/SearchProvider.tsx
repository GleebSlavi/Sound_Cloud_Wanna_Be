import { createContext, useContext, ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";
import { SearchContextData } from "../interfaces/SearchContextData";


const SearchContext = createContext<SearchContextData>({
  search: "",
  setSearch: () => {},
  checkPath: () => {return false;}
})

export const useSearchContext = () => {
  return useContext(SearchContext);
}

interface Props {
  children: ReactNode;
}

const SearchProvider = ({ children }: Props) => {
  const [search, setSearch] = useState("");

  const location = useLocation();

  const checkPath = () => {
    return location.pathname === "/profile";
  }

  return (
    <SearchContext.Provider value={{
      search, setSearch, checkPath
    }}>
      {children}
    </SearchContext.Provider>
  )

}

export default SearchProvider;