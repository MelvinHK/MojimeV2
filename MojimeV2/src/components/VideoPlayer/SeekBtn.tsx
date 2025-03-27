import { useMediaPlayer } from "@vidstack/react";
import "../../styles/video/mediaButton.css"

/**
 * @param time - In seconds 
 */
function SeekBtn({ time }: { time: number }) {
  const player = useMediaPlayer();

  const handleSeek = () => {
    if (player) player.currentTime += time;
  }

  return (
    <button className="media-button" onClick={handleSeek}><u>+{time}s</u></button>
  )
}

export default SeekBtn;