import { AnimeContext } from "../../routes/$animeId";
import { useContext } from "react";
import { IndexNavigation } from "../../routes/$animeId";

interface NavigateBtnProps {
  type: IndexNavigation;
}

function NavigateBtn({ type }: NavigateBtnProps) {
  const { handleNavigate, hasNext, hasPrevious } = useContext(AnimeContext);

  return (
    <button
      className="media-button"
      onClick={() => handleNavigate(type)}
      disabled={type === IndexNavigation.NEXT ? !hasNext : !hasPrevious}
      title={`${type === IndexNavigation.NEXT ? "Next" : "Previous"} Episode`}
    >
      {type === IndexNavigation.NEXT ?
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