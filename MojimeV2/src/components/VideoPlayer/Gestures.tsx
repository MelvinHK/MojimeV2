import { Gesture } from "@vidstack/react";

function Gestures() {
  return (<>
    <Gesture className="media-gesture" event="pointerup" action="toggle:paused" />
    <Gesture className='media-gesture' event="pointerup" action="toggle:controls" />
    <Gesture className='media-gesture' event="dblpointerup" action="toggle:fullscreen" />
  </>)
}

export default Gestures;