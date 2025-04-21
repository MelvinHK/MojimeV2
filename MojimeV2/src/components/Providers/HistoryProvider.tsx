import { createContext, useState, useContext, useEffect } from "react";
import { History } from "../../models";
import { ReactNode } from "@tanstack/react-router";

export const HISTORY_KEY = "history";

const HistoryContext = createContext<{
  history: History[];
  addHistory: (newEntry: History) => void;
  clearHistory: () => void;
}>({
  history: [],
  addHistory: () => { },
  clearHistory: () => { }
});

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<History[]>(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === HISTORY_KEY) {
        const updated = event.newValue ? JSON.parse(event.newValue) : [];
        setHistory(updated);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const addHistory = (newEntry: History) => {
    const newHistory = history.some(h => h.animeId === newEntry.animeId)
      ? [newEntry, ...history.filter(h => h.animeId !== newEntry.animeId)]
      : [newEntry, ...history];

    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  }

  return (
    <HistoryContext.Provider value={{ history, addHistory, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);