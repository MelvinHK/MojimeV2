import { useState } from "react";
import { useBookmarks } from "../Providers/BookmarksProvider";
import { Link } from "@tanstack/react-router";
import { useHistory } from "../Providers/HistoryProvider";

const BOOKMARKS_TITLE = "Bookmarks";
const HISTORY_TITLE = "History";

function ListModal() {
  const { clearHistory } = useHistory();
  const { clearBookmarks } = useBookmarks();

  const [menu, setMenu] = useState(BOOKMARKS_TITLE);

  const renderMenu = () => {
    if (menu === BOOKMARKS_TITLE) {
      return <Bookmarks />
    }
    else if (menu === HISTORY_TITLE) {
      return <History />
    }
  }

  const handleClear = () => {
    menu === HISTORY_TITLE
      ? clearHistory()
      : clearBookmarks()
  }

  return (
    <div className="flex col gap-y">
      <div className="flex">
        <button className="transparent-btn t-align-left mr-1ch" onClick={() => setMenu(BOOKMARKS_TITLE)}>
          {menu === BOOKMARKS_TITLE ? <u>{BOOKMARKS_TITLE}</u> : BOOKMARKS_TITLE}
        </button>
        <button className="transparent-btn t-align-left ml-1ch" onClick={() => setMenu(HISTORY_TITLE)}>
          {menu === HISTORY_TITLE ? <u>{HISTORY_TITLE}</u> : HISTORY_TITLE}
        </button>
        <span className="ml-auto">
          {"[ "}
          <button className="transparent-btn" onClick={handleClear}>
            Clear
          </button>
          {" ]"}
        </span>
      </div>
      <div className="divider" />
      {renderMenu()}
    </div>
  )
}

function Bookmarks() {
  const { bookmarks, updateBookmarks } = useBookmarks();

  const removeBookmark = (animeId: string) => {
    updateBookmarks(bookmarks.filter(b => b.animeId !== animeId));
  }

  return (
    <div className="anime-list">
      {bookmarks.length > 0
        ? bookmarks.map(b =>
          <Link
            className="list-result flex a-center"
            key={b.animeId}
            to={b.provider + "/" + b.animeId}
          >
            {b.title}
            <button className="ml-auto x-btn" onClick={(e) => {
              e.preventDefault();
              removeBookmark(b.animeId);
            }}>
              {"\u2715"}
            </button>
          </Link>
        )
        : <div className="list-result p-none bright-gray">No bookmarks</div>
      }
    </div>
  )
}

function History() {
  const { history } = useHistory();

  return (
    <div className="anime-list">
      {history.length > 0
        ? history.map(b =>
          <Link
            className="list-result"
            key={b.animeId}
            to={b.provider + "/" + b.animeId}
          >
            {b.title}
          </Link>
        )
        : <div className="list-result p-none bright-gray">No history</div>
      }
    </div>
  )
}

export default ListModal;