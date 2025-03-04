import ProgressBar from './ProgressBar';
import PausePlayButton from './PausePlayBtn';
import TimeGroup from './TimeGroup';
import FullscreenBtn from './FullscreenBtn';
import VolumeBtn from './VolumeBtn';

function ControlsLayout() {
  return (
    <div className="controls-layout">
      <ProgressBar />
      <div className="buttons-layout">
        <PausePlayButton />
        <TimeGroup />
        <div className='spacer'></div>
        <VolumeBtn />
        <FullscreenBtn />
      </div>
    </div>
  )
}

export default ControlsLayout;