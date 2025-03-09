import '../../styles/video/mediaButton.css';
import { PlayButton } from "@vidstack/react";

function PausePlayButton() {
  return (
    <PlayButton className="media-button">
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="play-icon" viewBox="3.8 3.3 8.1 9.4">
        <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="pause-icon" viewBox="3.8 3.3 8.1 9.4">
        <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5" />
      </svg>
    </PlayButton>
  )
}

export default PausePlayButton;