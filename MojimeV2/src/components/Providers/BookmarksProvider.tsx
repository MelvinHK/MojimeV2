import { createContext, useState, useContext, useEffect } from "react";
import { Bookmark } from "../../models";
import { ReactNode } from "@tanstack/react-router";

export const BOOKMARKS_KEY = "bookmarks";

const BookmarkContext = createContext<{
  bookmarks: Bookmark[];
  updateBookmarks: (newBookmarks: Bookmark[]) => void;
  clearBookmarks: () => void;
}>({
  bookmarks: [],
  updateBookmarks: () => { },
  clearBookmarks: () => { }
});

export const BookmarksProvider = ({ children }: { children: ReactNode }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === BOOKMARKS_KEY) {
        const updated = event.newValue ? JSON.parse(event.newValue) : [];
        setBookmarks(updated);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const updateBookmarks = (newBookmarks: Bookmark[]) => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
    setBookmarks(newBookmarks);
  };

  const clearBookmarks = () => {
    localStorage.removeItem(BOOKMARKS_KEY);
    setBookmarks([]);
  }

  return (
    <BookmarkContext.Provider value={{ bookmarks, updateBookmarks, clearBookmarks }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => useContext(BookmarkContext);