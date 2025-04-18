import '../styles/searchbar.css';

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useRef, useState, useEffect, useMemo } from "react"
import getApiClient, { PROVIDERS } from '../lib/api/clientManager';
import { Link, useNavigate } from "@tanstack/react-router";
import useClickAway from '../lib/hooks/useClickAway';

const PREFERRED_PROVIDER_KEY = "preferredProvider";

function SearchBar() {
  const [selectedProvider, selectProvider] = useState(() => {
    const preferredProvider = localStorage.getItem(PREFERRED_PROVIDER_KEY) as PROVIDERS | null;
    return preferredProvider ?? PROVIDERS.KAI;
  });
  const api = useMemo(() => getApiClient(selectedProvider), [selectedProvider]);

  const [value, setValue] = useState("");
  const [isDropdownVisible, toggleDropdown] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useClickAway({
    onClick: () => toggleDropdown(true),
    onAway: () => toggleDropdown(false)
  }, containerRef);

  const { data: results, refetch, isFetching } = useQuery({
    queryKey: ['Search', value, selectedProvider],
    queryFn: () => api.getSearch(value),
    enabled: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    toggleDropdown(true);
    if (!/\S/.test(value)) return;
    const cachedData = queryClient.getQueryData(['Search', value, selectedProvider]);
    if (!cachedData) await refetch();
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    const isInputFocused = document.activeElement === inputRef.current;

    if (e.key === "/" && !isInputFocused) {
      e.preventDefault();
      inputRef.current?.focus();
    }

    if (e.key === "Escape" && isInputFocused) {
      e.preventDefault();
      inputRef.current?.blur();
      toggleDropdown(false);
    }

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
      inputRef.current?.blur();
      setValue(results[selectedIndex].title);
      navigate({ to: `/${selectedProvider}/${results[selectedIndex].id}` });
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [inputRef, results, selectedIndex, isDropdownVisible]);

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
        to={selectedProvider + "/" + result.id}
        onClick={() => (
          toggleDropdown(false),
          setValue(result.title)
        )}
        className={index === selectedIndex ? "selected" : ""}
        tabIndex={-1}
      >
        {result.title}
      </Link>
    ));
  };

  const handleClear = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setValue("");
    inputRef.current?.focus();
  }

  const handleProviderSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    selectProvider(e.target.value as PROVIDERS);
    localStorage.setItem(PREFERRED_PROVIDER_KEY, e.target.value);
  }

  return (
    <div className='searchbar-container' ref={containerRef}>
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className='searchbar'
          value={value}
          onFocus={() => toggleDropdown(true)}
          onChange={e => (setValue(e.target.value), toggleDropdown(true))}
          placeholder='Search'
          spellCheck={false}
          title=""
        />
        {value.length > 0 &&
          <button
            title="Clear Search"
            type="button"
            className="clear-search-btn"
            onClick={handleClear}
            tabIndex={-1}
          >
            {"\u2715"}
          </button>
        }
        <select
          className="provider-select"
          onChange={handleProviderSelect}
          defaultValue={selectedProvider}
          autoComplete="off"
        >
          <option className="test" value="" disabled>Select Provider:</option>
          {Object.keys(PROVIDERS).map(provider => {
            const name = PROVIDERS[provider as keyof typeof PROVIDERS];
            return (
              <option
                key={provider}
                value={name}
              >
                {provider.charAt(0) + provider.substring(1).toLowerCase()}
                {name == PROVIDERS.PAHE ? " (unstable)" : ""}
              </option>
            )
          })}
        </select>
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