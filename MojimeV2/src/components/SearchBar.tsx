import { FormEvent, useState } from "react"

function SearchBar() {
  const [value, setValue] = useState("");

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
  }

  return (
    <form onSubmit={submitSearch}>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        required
      />
    </form>
  )
}

export default SearchBar