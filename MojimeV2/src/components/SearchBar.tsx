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

  return (<>
    <form onSubmit={handleSubmit}>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        required
      />
      {isFetching && <label>Loading...</label>}
    </form>
    {results &&
      <div className="flex col">
        {results?.length > 0 ?
          results.map(result => <Link key={result.id} to={result.id}>{result.title}</Link>)
          :
          <div>No results</div>
        }
      </div>
    }
  </>)
}

export default SearchBar