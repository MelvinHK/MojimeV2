import '../../styles/video/video.css';
import '../../styles/video/mediaSlider.css'
import '../../styles/video/mediaButton.css'
import { VolumeSlider, Menu, VolumeSliderInstance, useStore } from '@vidstack/react';
import { useRef, useMemo } from 'react';

function VolumeBtn() {
  const volumeRef = useRef<VolumeSliderInstance>(null),
    { value } = useStore(VolumeSliderInstance, volumeRef);

  const roundedValue = useMemo(() => Number((value * 0.1).toFixed(0)), [value])

  return (
    <Menu.Root>
      <Menu.Button className="media-button">
        {roundedValue > 5 ?
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="volume-icon" viewBox="3 3.5 9.3 9.3">
            <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z" />
            <path d="M8.707 11.182A4.5 4.5 0 0 0 10.025 8a4.5 4.5 0 0 0-1.318-3.182L8 5.525A3.5 3.5 0 0 1 9.025 8 3.5 3.5 0 0 1 8 10.475zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06" />
          </svg>
        : roundedValue > 0 ?
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="volume-icon" viewBox="5 3.5 9.3 9.3">
            <path d="M9 4a.5.5 0 0 0-.812-.39L5.825 5.5H3.5A.5.5 0 0 0 3 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 9 12zm3.025 4a4.5 4.5 0 0 1-1.318 3.182L10 10.475A3.5 3.5 0 0 0 11.025 8 3.5 3.5 0 0 0 10 5.525l.707-.707A4.5 4.5 0 0 1 12.025 8" />
          </svg>
        :
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="volume-icon" viewBox="3 3.5 9.3 9.3">
            <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06m6.137 2.096a.5.5 0 0 1 0 .708L11.207 8l1.647 1.646a.5.5 0 0 1-.708.708L10.5 8.707 8.854 10.354a.5.5 0 0 1-.708-.708L9.793 8 8.146 6.354a.5.5 0 1 1 .708-.708L10.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0" />
          </svg>
        }
      </Menu.Button>
      <Menu.Items className="volume-slider-container media-menu" placement="top" offset={40}>
        <div>{roundedValue}</div>
        <VolumeSlider.Root ref={volumeRef} className="media-slider" orientation="vertical">
          <VolumeSlider.Track className="media-slider-track">
            <VolumeSlider.TrackFill className="media-slider-track-fill media-slider-track" />
          </VolumeSlider.Track>
          <VolumeSlider.Thumb className="media-slider-thumb" />
        </VolumeSlider.Root>
      </Menu.Items>
    </Menu.Root>
  )
}

export default VolumeBtn
