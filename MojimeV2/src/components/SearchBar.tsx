import '../styles/searchbar/searchbar.css';

import { useQuery } from "@tanstack/react-query";
import { FormEvent, useRef, useState } from "react"
import { getSearch } from "../lib/api";
import { Link } from "@tanstack/react-router";
import useClickAway from '../lib/hooks/useClickAway';

function SearchBar() {
  const [value, setValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDropdownVisible, toggleDropdown] = useState(true);

  useClickAway({
    onClick: () => toggleDropdown(true),
    onAway: () => toggleDropdown(false)
  }, containerRef.current);

  const { data: results, refetch, isFetching } = useQuery({
    queryKey: ['Search'],
    queryFn: () => getSearch(value),
    enabled: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    refetch();
  }

  const renderDropdown = () => {
    if (isFetching) {
      return <label>Searching...</label>;
    }

    if (results?.length === 0) {
      return <div>No results</div>;
    }

    return results?.map(result => (
      <Link key={result.id} to={result.id} onClick={() => toggleDropdown(false)}>
        {result.title}
      </Link>
    ));
  };

  return (
    <div className='searchbar-container' ref={containerRef}>
      <form onSubmit={handleSubmit}>
        <input
          className='searchbar'
          value={value}
          onChange={e => setValue(e.target.value)}
          required
          placeholder='Search'
          spellCheck={false}
        />
      </form>
      {(results || isFetching) && isDropdownVisible &&
        <div className="dropdown">
          {renderDropdown()}
        </div>
      }
    </div>
  )
}

export default SearchBar