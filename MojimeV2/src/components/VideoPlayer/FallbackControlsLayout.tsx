import { Slider } from "@vidstack/react"
import FullscreenBtn from "./FullscreenBtn"

/**
 * This component displays whilst the video player's controls are inaccessible.
 */
function FallbackControlsLayout() {
  return (
    <div className='fallback controls-layout'>
      <div className="media-slider">
        <Slider.Track className="media-slider-track" />
      </div>
      <div className='buttons-layout'>
        <div>Loading...</div>
        <div className="spacer"></div>
        <FullscreenBtn />
      </div>
    </div>
  )
}

export default FallbackControlsLayout