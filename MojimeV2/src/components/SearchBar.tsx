import '../styles/searchbar/searchbar.css';

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useRef, useState, useEffect } from "react"
import { getSearch } from "../lib/api";
import { Link, useNavigate } from "@tanstack/react-router";
import useClickAway from '../lib/hooks/useClickAway';

function SearchBar() {
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isDropdownVisible, toggleDropdown] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useClickAway({
    onClick: () => (toggleDropdown(true), setSelectedIndex(-1)),
    onAway: () => (toggleDropdown(false), setSelectedIndex(-1))
  }, containerRef);

  const { data: results, refetch, isFetching } = useQuery({
    queryKey: ['Search', searchValue],
    queryFn: () => getSearch(searchValue),
    enabled: !!searchValue,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSearchValue(inputValue);
    const cachedData = queryClient.getQueryData(['Search', searchValue]);
    if (!cachedData) await refetch();
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!results || results.length === 0) return;

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
      const selectedResult = results[selectedIndex];
      if (selectedResult) {
        toggleDropdown(false);
        containerRef.current?.querySelector('input')?.blur();
        navigate({ to: `/${selectedResult.id}` });
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [results, selectedIndex]);

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
          value={inputValue}
          onFocus={() => toggleDropdown(true)}
          onChange={e => (
            setInputValue(e.target.value),
            setSelectedIndex(-1)
          )}
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