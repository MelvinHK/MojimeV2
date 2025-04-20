import { Anime } from "../models";
import { useEffect, useState } from "react";
import { useBookmarks } from "./Providers/BookmarksProvider";
import '../styles/animeId.css';
import '../styles/vidstack/mediaButton.css';
import { useAnime } from "./Providers/AnimeProvider";

function BookmarkBtn({ anime }: { anime: Anime }) {
  const { provider } = useAnime();
  const { bookmarks, updateBookmarks } = useBookmarks();

  const [isBookmarked, toggleBookmarked] = useState(() =>
    bookmarks.some(b => b.animeId === anime.id)
  );

  const handleBookmark = () => {
    const updatedBookmarks = isBookmarked
      ? bookmarks.filter(b => b.animeId !== anime.id)
      : [{ animeId: anime.id, title: anime.title, provider: provider }, ...bookmarks];

    updateBookmarks(updatedBookmarks);
  };

  useEffect(() => {
    toggleBookmarked(bookmarks.some(b => b.animeId === anime.id));
  }, [bookmarks])

  return (
    <button className="bookmark-btn media-button" title="Bookmark" onClick={handleBookmark}>
      {!isBookmarked ?
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="-1.8 0 16 16">
          <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
        </svg>
        :
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="-1.8 0 16 16">
          <path fillRule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z" />
        </svg>
      }
    </button>
  )
}

export default BookmarkBtn;