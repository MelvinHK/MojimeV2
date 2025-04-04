import { useContext } from 'react';
import { Controls } from '@vidstack/react';

import ProgressBar from './ProgressBar';
import PausePlayButton from './PausePlayBtn';
import TimeGroup from './TimeGroup';
import FullscreenBtn from './FullscreenBtn';
import VolumeBtn from './VolumeBtn';
import QualityBtn from './QualityBtn';
import NavigateBtn from './NavigateBtn';
import SeekBtn from './SeekBtn';
import Gestures from './Gestures';

import useIsMobile from '../../../lib/hooks/useIsMobile';
import { AnimeContext, IndexNavigation } from '../../AnimeProvider';

function ControlsLayout() {
  const { isFetchingEpisode } = useContext(AnimeContext);
  const isMobile = useIsMobile();

  return (<>
    <Controls.Root className="controls-layout">
      <div className='m-auto' />
      {isFetchingEpisode ?
        <div className='video-status'>Loading Episode...</div>
        :
        <div className='video-status buffer'>Buffering...</div>
      }
      {isMobile &&
        <Controls.Group className='mobile-playback-container'>
          <NavigateBtn type={IndexNavigation.PREVIOUS} />
          <PausePlayButton />
          <NavigateBtn type={IndexNavigation.NEXT} />
        </Controls.Group>
      }
      <Controls.Group className="controls-container">
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
          <SeekBtn time={85} />
          <SeekBtn time={25} />
          <div className='m-auto' />
          <QualityBtn />
          {!isMobile && <VolumeBtn />}
          <FullscreenBtn />
        </div>
      </Controls.Group>
    </Controls.Root>
    <Gestures />
  </>)
}

export default ControlsLayout;