import { TimeSlider } from "@vidstack/react"
import '../../styles/video/mediaSlider.css'

function ProgressBar() {
  return (
    <TimeSlider.Root className="media-slider">
      <TimeSlider.Track className="media-slider-track">
        <TimeSlider.TrackFill className="media-slider-track-fill media-slider-track" />
        <TimeSlider.Progress className="media-slider-progress media-slider-track" />
      </TimeSlider.Track>
      <TimeSlider.Preview className="media-slider-preview">
        <TimeSlider.Value className="media-slider-value" />
      </TimeSlider.Preview>
      <TimeSlider.Thumb className="media-slider-thumb" />
    </TimeSlider.Root>
  )
}

export default ProgressBar