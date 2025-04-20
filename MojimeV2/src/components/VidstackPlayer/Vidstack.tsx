import '@vidstack/react/player/styles/base.css';
import '../../styles/vidstack/video.css';
import '../../styles/vidstack/gestures.css';

import { MediaPlayer, MediaPlayerInstance, MediaProvider, MediaTimeUpdateEventDetail, useMediaRemote } from '@vidstack/react';
import { createContext, MutableRefObject, useContext, useEffect, useRef } from 'react';
import { throttle } from 'lodash-es';
import { animated } from '@react-spring/web';

import { PREFERRED_VOLUME_KEY } from './controls/VolumeBtn';
import { AnimeContext, IndexNavigation } from '../Providers/AnimeProvider';

import ControlsLayout from './controls/ControlsLayout';
import useMobileGesture from '../../lib/hooks/useMobileGesture';
import useIsMobile from '../../lib/hooks/useIsMobile';

interface VideoPlayerContextType {
  isTapGesture: MutableRefObject<Boolean>
}

export const VideoPlayerContext = createContext<VideoPlayerContextType>({
  isTapGesture: { current: false }
});

export const CONTROLS_DELAY = 2000;

const AnimatedMediaProvider = animated(MediaProvider);

function VideoPlayer({ m3u8URL }: { m3u8URL: string }) {
  const {
    anime, episode, currentIndex,
    hasNext, hasPrevious,
    prefetchEpisode, handleNavigate
  } = useContext(AnimeContext);

  const prefetchAllowed = useRef<boolean>(true);
  const playerRef = useRef<MediaPlayerInstance>(null);
  const isCoarse = useIsMobile(["coarse", "no-hover"]);

  // Player configuration
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    player.qualities.switch = "next";
  }, [playerRef]);

  const initVolume = () => {
    const preferredVolume = localStorage.getItem(PREFERRED_VOLUME_KEY);
    return preferredVolume ? Number(preferredVolume) * 0.01 : 1;
  }

  const handleTime = (e: MediaTimeUpdateEventDetail) => {
    const duration = playerRef.current?.duration;
    const time = e.currentTime;

    if (!duration || time === 0 || duration === 0) return;

    if ((time / duration) >= 0.75 && prefetchAllowed.current) {
      prefetchAllowed.current = false;
      if (anime && hasNext) {
        prefetchEpisode(anime.episodes[currentIndex + 1]);
      }
    }
  }

  const remote = useMediaRemote(playerRef);
  const isTapGesture = useRef(false);

  const { bindMobileGesture, x, y } = useMobileGesture({
    onTap: () => { isTapGesture.current = true },
    onRightDragRelease: () => {
      if (hasPrevious) handleNavigate(IndexNavigation.PREVIOUS);
    },
    onLeftDragRelease: () => {
      if (hasNext) handleNavigate(IndexNavigation.NEXT);
    },
    onDownDragRelease: () => remote.toggleFullscreen(),
    onUpDragRelease: () => remote.toggleFullscreen()
  });

  return (
    <MediaPlayer
      ref={playerRef}
      className="video-player"
      src={{
        src: m3u8URL,
        type: 'application/vnd.apple.mpegurl'
      }}
      volume={initVolume()}
      streamType='on-demand'
      onCanPlay={() => prefetchAllowed.current = true}
      onTimeUpdate={throttle(handleTime, 1000)}
      controlsDelay={CONTROLS_DELAY}
      playsInline
      autoPlay
      crossOrigin
    >
      <AnimatedMediaProvider
        {...(isCoarse ? bindMobileGesture() : {})}
        style={{ touchAction: "none", x, y }}
      />
      {anime && episode &&
        <div className='video-title'>
          {anime.title} - Episode {episode.number}
        </div>
      }
      <VideoPlayerContext.Provider value={{ isTapGesture }}>
        <ControlsLayout />
      </VideoPlayerContext.Provider>
    </MediaPlayer>
  )
}

export default VideoPlayer