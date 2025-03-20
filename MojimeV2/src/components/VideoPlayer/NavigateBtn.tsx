import { AnimeContext } from "../../routes/$animeId";
import { useContext, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Route } from "../../routes/$animeId";

interface NavigateBtnProps {
  type: "previous" | "next";
}

function NavigateBtn({ type }: NavigateBtnProps) {
  const { anime, currentIndex } = useContext(AnimeContext);
  const navigate = useNavigate({ from: Route.fullPath });

  const hasPrevious = useMemo(() => currentIndex > 0, [currentIndex]);
  const hasNext = useMemo(() => anime && currentIndex < anime.episodes.length - 1, [anime, currentIndex]);

  const handleNavigate = () => {
    if (!anime) return;
    const newIndex = type === "next" ? currentIndex + 1 : currentIndex - 1;
    navigate({ search: () => ({ ep: anime.episodes[newIndex].number }) });
  }

  return (
    <button className="media-button" onClick={handleNavigate} disabled={type === "next" ? !hasNext : !hasPrevious}>
      {type === "next" ?
        <svg xmlns="http://www.w3.org/2000/svg" className="next-icon" fill="currentColor" viewBox="4.6 3.3 8.1 9.4">
          <path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.693 3.3 4 3.678 4 4.308v7.384c0 .63.692 1.01 1.233.697L11.5 8.753V12a.5.5 0 0 0 1 0z" />
        </svg>
        :
        <svg xmlns="http://www.w3.org/2000/svg" className="previous-icon" fill="currentColor" viewBox="4.6 3.3 8.1 9.4">
          <path d="M4 4a.5.5 0 0 1 1 0v3.248l6.267-3.636c.54-.313 1.232.066 1.232.696v7.384c0 .63-.692 1.01-1.232.697L5 8.753V12a.5.5 0 0 1-1 0z" />
        </svg>
      }
    </button>
  )
}

export default NavigateBtn