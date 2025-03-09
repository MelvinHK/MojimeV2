import ProgressBar from './ProgressBar';
import PausePlayButton from './PausePlayBtn';
import TimeGroup from './TimeGroup';
import FullscreenBtn from './FullscreenBtn';
import VolumeBtn from './VolumeBtn';
import { Controls } from '@vidstack/react';
import QualityBtn from './QualityBtn';
import NavigateBtn from './NavigateBtn';

function ControlsLayout() {
  return (
    <Controls.Root className="controls-layout">
      <ProgressBar />
      <Controls.Group className="buttons-layout">
        <NavigateBtn type="previous" />
        <PausePlayButton />
        <NavigateBtn type="next" />
        <TimeGroup />
        <div className='spacer'></div>
        <QualityBtn />
        <VolumeBtn />
        <FullscreenBtn />
      </Controls.Group>
    </Controls.Root>
  )
}

export default ControlsLayout;