import ProgressBar from './ProgressBar';
import PausePlayButton from './PausePlayBtn';
import TimeGroup from './TimeGroup';
import FullscreenBtn from './FullscreenBtn';
import VolumeBtn from './VolumeBtn';
import { Controls } from '@vidstack/react';
import QualityBtn from './QualityBtn';
import NavigateBtn from './NavigateBtn';
import { IndexNavigation } from '../../routes/$animeId';
import useIsMobile from '../../lib/hooks/useIsMobile';

function ControlsLayout() {
  const isMobile = useIsMobile();

  return (
    <Controls.Root className="controls-layout">
      <div className='m-auto'></div>
      {isMobile &&
        <Controls.Group className='mobile-playback-container'>
          <NavigateBtn type={IndexNavigation.PREVIOUS} />
          <PausePlayButton />
          <NavigateBtn type={IndexNavigation.NEXT} />
        </Controls.Group>
      }
      <Controls.Group className="playback-container">
        <ProgressBar />
        <div className="flex a-center gap-1">
          {!isMobile &&
            <div className='flex a-center gap-1p5'>
              <NavigateBtn type={IndexNavigation.PREVIOUS} />
              <PausePlayButton />
              <NavigateBtn type={IndexNavigation.NEXT} />
            </div>
          }
          <TimeGroup />
          <div className='m-auto'></div>
          <QualityBtn />
          {!isMobile && <VolumeBtn />}
          <FullscreenBtn />
        </div>
      </Controls.Group>
    </Controls.Root>
  )
}

export default ControlsLayout;