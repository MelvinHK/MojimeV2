import ProgressBar from './ProgressBar';
import PausePlayButton from './PausePlayBtn';
import TimeGroup from './TimeGroup';
import FullscreenBtn from './FullscreenBtn';

function ControlsLayout() {
  return (
    <div className="controls-layout">
      <ProgressBar />
      <div className="buttons-layout">
        <PausePlayButton />
        <TimeGroup />
        <FullscreenBtn />
      </div>
    </div>
  )
}

export default ControlsLayout;