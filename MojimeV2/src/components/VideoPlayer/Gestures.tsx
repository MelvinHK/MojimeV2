import { Gesture, MediaPlayerInstance, useMediaPlayer, GestureWillTriggerEvent, GestureAction } from "@vidstack/react";
import { useAutoResetState } from "../../lib/hooks/useAutoResetState";
import { CONTROLS_DELAY, VideoPlayerContext } from "../VideoPlayer";
import { CSSProperties, useContext } from "react";

function Gestures() {
  const player = useMediaPlayer();
  const { isTapGesture } = useContext(VideoPlayerContext)

  const willControlsTrigger = (_: GestureAction, nativeEvent: GestureWillTriggerEvent) => {
    // Vidstack's "pointerup" event doesn't differentiate between taps and drag+release gestures,
    // so this check is preferred.
    if (!isTapGesture.current) {
      nativeEvent.preventDefault();
    }
  }

  const handleControlsToggle = () => {
    if (player?.controls.showing && !player?.paused) {
      player.controls.hide(CONTROLS_DELAY);
    }
    isTapGesture.current = false;
  }

  return (<>
    {/* Mouse pointer only */}
    <Gesture className="media-gesture" event="pointerup" action="toggle:paused" />
    <Gesture className='media-gesture' event="dblpointerup" action="toggle:fullscreen" />

    {/* Touch screen only */}
    <Gesture className='media-gesture' event="pointerup" action="toggle:controls"
      onWillTrigger={willControlsTrigger} onTrigger={handleControlsToggle} />
    <SeekGesture player={player} />
    <SeekGesture player={player} isForward={false} />
  </>)
}

export default Gestures;

function SeekGesture({
  player,
  time = 10, // In seconds
  isForward = true
}: {
  player: MediaPlayerInstance | null,
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
    if (player) {
      handleSeek();
      player.currentTime += isForward ? time : -time;
    }
  }

  const feedbackStyle: CSSProperties = {
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