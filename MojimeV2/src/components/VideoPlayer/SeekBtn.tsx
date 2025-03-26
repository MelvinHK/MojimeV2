import { useMediaRemote } from "@vidstack/react";
import "../../styles/video/mediaButton.css"

/**
 * @param time - In seconds 
 */
function SeekBtn({ time }: { time: number }) {
  const remote = useMediaRemote();

  const handleSeek = () => {
    const player = remote.getPlayer();
    if (player) player.currentTime += time;
  }

  return (
    <button className="media-button" onClick={handleSeek}><u>+{time}s</u></button>
  )
}

export default SeekBtn;