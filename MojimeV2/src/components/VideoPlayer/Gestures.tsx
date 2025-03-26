import { Gesture, MediaPlayerInstance } from "@vidstack/react";
import { RefObject } from "react";
import { useAutoResetState } from "../../lib/hooks/useAutoResetState";

function Gestures({ playerRef }: { playerRef: RefObject<MediaPlayerInstance> }) {
  return (<>
    <Gesture className="media-gesture" event="pointerup" action="toggle:paused" />{/* Mouse pointer only */}
    <Gesture className='media-gesture' event="pointerup" action="toggle:controls" />{/* Touch screen only */}
    <SeekGesture playerRef={playerRef} />{/* Touch screen only */}
    <SeekGesture playerRef={playerRef} isForward={false} />{/* Touch screen only */}
    <Gesture className='media-gesture' event="dblpointerup" action="toggle:fullscreen" />
  </>)
}

function SeekGesture({
  playerRef,
  time = 10, // In seconds
  isForward = true
}: {
  playerRef: RefObject<MediaPlayerInstance>,
  time?: number,
  isForward?: boolean
}) {
  const [isSeeking, setIsSeeking] = useAutoResetState(false, 500);
  const [seekedTime, setSeekedTime] = useAutoResetState(0, 550); // +50ms (css transition time)

  const handleSeek = () => {
    setIsSeeking(true);
    setSeekedTime(seekedTime + time);
  }

  const handleSubsequentSeek = () => {
    if (playerRef?.current) {
      handleSeek();
      playerRef.current.currentTime += isForward ? time : -time;
    }
  }

  const feedbackStyle: React.CSSProperties = {
    opacity: isSeeking ? "1" : "0",
    pointerEvents: isSeeking ? "auto" : "none",
    backgroundImage: isForward ?
      "linear-gradient(to left, rgba(0, 0, 0, 0.314) 70%, rgba(0, 0, 0, 0))"
      :
      "linear-gradient(to right, rgba(0, 0, 0, 0.314) 70%, rgba(0, 0, 0, 0))"
  }

  return (
    <Gesture
      className="media-gesture"
      event="dblpointerup"
      action={`seek:${isForward ? "" : "-"}10`}
      onTrigger={handleSeek}
    >
      <button
        className="seek-feedback"
        style={feedbackStyle}
        onClick={handleSubsequentSeek}
      >
        {isForward ? "+" : "-"}{seekedTime}s
      </button>
    </Gesture>
  );
}

export default Gestures;