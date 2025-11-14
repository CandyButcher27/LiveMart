// src/components/search/SearchBar.tsx
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";

interface Props {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery]);

  return (
    <div className="relative w-full max-w-sm">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="w-full rounded-xl bg-slate-800 border border-slate-700 px-9 py-2 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-600"
      />
      <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
    </div>
  );
};

export default SearchBar;
