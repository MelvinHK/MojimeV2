import ProgressBar from './ProgressBar';
import PausePlayButton from './PausePlayBtn';
import TimeGroup from './TimeGroup';
import FullscreenBtn from './FullscreenBtn';
import VolumeBtn from './VolumeBtn';
import { Controls } from '@vidstack/react';

function ControlsLayout() {
  return (
    <Controls.Root className="controls-layout">
      <ProgressBar />
      <Controls.Group className="buttons-layout">
        <PausePlayButton />
        <TimeGroup />
        <div className='spacer'></div>
        <VolumeBtn />
        <FullscreenBtn />
      </Controls.Group>
    </Controls.Root>
  )
}

export default ControlsLayout;