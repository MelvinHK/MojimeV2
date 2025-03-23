import '../styles/searchbar/searchbar.css';

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useRef, useState, useEffect } from "react"
import { getSearch } from "../lib/api";
import { Link, useNavigate } from "@tanstack/react-router";
import useClickAway from '../lib/hooks/useClickAway';

function SearchBar() {
  const [value, setValue] = useState("");
  const [isDropdownVisible, toggleDropdown] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useClickAway({
    onClick: () => toggleDropdown(true),
    onAway: () => toggleDropdown(false)
  }, containerRef);

  const { data: results, refetch, isFetching } = useQuery({
    queryKey: ['Search', value],
    queryFn: () => getSearch(value),
    enabled: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cachedData = queryClient.getQueryData(['Search', value]);
    if (!cachedData) await refetch();
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isDropdownVisible || !results || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
    }

    if (e.key === "Enter" && selectedIndex !== -1) {
      e.preventDefault();
      toggleDropdown(false);
      containerRef.current?.querySelector('input')?.blur();
      navigate({ to: `/${results[selectedIndex].id}` });
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [results, selectedIndex, isDropdownVisible]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [isDropdownVisible])

  const renderDropdown = () => {
    if (isFetching) {
      return <label>Searching...</label>;
    }

    if (results?.length === 0) {
      return <div>No results</div>;
    }

    return results?.map((result, index) => (
      <Link
        key={result.id}
        to={result.id}
        onClick={() => toggleDropdown(false)}
        className={index === selectedIndex ? "selected" : ""}
        tabIndex={-1}
      >
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
          onFocus={() => toggleDropdown(true)}
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