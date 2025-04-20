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
import { IndexNavigation, useAnime } from '../../Providers/AnimeProvider';

function ControlsLayout() {
  const { isFetchingEpisode } = useAnime();
  const isMobileWidth = useIsMobile(["width"]);
  const isCoarse = useIsMobile(["coarse", "no-hover"]);

  return (<>
    <Controls.Root className="controls-layout">
      <div className='m-auto' />
      {isFetchingEpisode ?
        <div className='video-status'>Loading Episode...</div>
        :
        <div className='video-status buffer'>Buffering...</div>
      }
      {(isMobileWidth || isCoarse) &&
        <Controls.Group className='mobile-playback-container'>
          <NavigateBtn type={IndexNavigation.PREVIOUS} />
          <PausePlayButton />
          <NavigateBtn type={IndexNavigation.NEXT} />
        </Controls.Group>
      }
      <Controls.Group className="controls-container">
        <ProgressBar />
        <div className="flex a-center gap-1">
          {(!isMobileWidth && !isCoarse) &&
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
          {!isMobileWidth && <VolumeBtn />}
          <FullscreenBtn />
        </div>
      </Controls.Group>
    </Controls.Root>
    <Gestures />
  </>)
}

export default ControlsLayout;