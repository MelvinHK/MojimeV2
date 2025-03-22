import ProgressBar from './ProgressBar';
import PausePlayButton from './PausePlayBtn';
import TimeGroup from './TimeGroup';
import FullscreenBtn from './FullscreenBtn';
import VolumeBtn from './VolumeBtn';
import { Controls } from '@vidstack/react';
import QualityBtn from './QualityBtn';
import NavigateBtn from './NavigateBtn';
import { IndexNavigation } from '../../routes/$animeId';

function ControlsLayout() {
  return (
    <Controls.Root className="controls-layout">
      <ProgressBar />
      <Controls.Group className="buttons-layout">
        <NavigateBtn type={IndexNavigation.PREVIOUS} />
        <PausePlayButton />
        <NavigateBtn type={IndexNavigation.NEXT} />
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