import '../styles/searchbar/searchbar.css';

import { useQuery } from "@tanstack/react-query";
import { FormEvent, useState } from "react"
import { getSearch } from "../lib/api";
import { Link } from "@tanstack/react-router";

function SearchBar() {
  const [value, setValue] = useState("");

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

  return (<div className='searchbar-container'>
    <form onSubmit={handleSubmit}>
      <input
        className='searchbar'
        value={value}
        onChange={e => setValue(e.target.value)}
        required
        placeholder='Search'
      />
    </form>
      {results &&
        <div className="dropdown">
          {results?.length > 0 ?
            results.map(result => <Link key={result.id} to={result.id}>{result.title}</Link>)
            :
            <div>No results</div>
          }
          {isFetching && <label>Loading...</label>}
        </div>
      }
  </div>)
}

export default SearchBar