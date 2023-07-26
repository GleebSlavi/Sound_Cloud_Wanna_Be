

export interface SearchContextData {
  search: string;
  setSearch: (value: string) => void;
  checkPath: () => boolean;
}