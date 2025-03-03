import ProgressBar from './ProgressBar';
import PausePlayButton from './PausePlayButton';
import TimeGroup from './TimeGroup';

function ControlsLayout() {
  return (
    <div className="controls-layout">
      <ProgressBar />
      <div className="buttons-layout">
        <PausePlayButton />
        <TimeGroup />
      </div>
    </div>
  )
}

export default ControlsLayout;