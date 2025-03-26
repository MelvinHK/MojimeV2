import '@vidstack/react/player/styles/base.css';
import '../styles/video/video.css';
import '../styles/video/gestures.css';
import { MediaPlayer, MediaPlayerInstance, MediaProvider, MediaTimeUpdateEventDetail } from '@vidstack/react';
import ControlsLayout from './VideoPlayer/ControlsLayout';
import { useContext, useEffect, useRef } from 'react';
import { AnimeContext } from '../routes/$animeId';
import { PREFERRED_VOLUME_KEY } from './VideoPlayer/VolumeBtn';
import Gestures from './VideoPlayer/Gestures';
import { throttle } from 'lodash-es';

interface VideoPlayerProps {
  m3u8URL: string,
}

export const CONTROLS_DELAY = 2000;

function VideoPlayer({ m3u8URL }: VideoPlayerProps) {
  const { anime, episode, currentIndex, prefetchEpisode } = useContext(AnimeContext);
  const prefetchAllowed = useRef<boolean>(true);

  const playerRef = useRef<MediaPlayerInstance>(null);

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
      const nextEpisode = anime?.episodes[currentIndex + 1];
      if (nextEpisode) {
        prefetchEpisode(nextEpisode);
      }
    }
  }

  return (
    <MediaPlayer
      ref={playerRef}
      className="video-player"
      src={{
        src: m3u8URL,
        type: 'application/x-mpegurl'
      }}
      volume={initVolume()}
      load="eager"
      onCanPlay={() => prefetchAllowed.current = true}
      onTimeUpdate={throttle(handleTime, 1000)}
      controlsDelay={CONTROLS_DELAY}
      playsInline
      autoPlay
      crossOrigin
    >
      <MediaProvider />
      {anime && episode &&
        <div className='video-title'>
          {anime.title} - Episode {episode.number}
        </div>
      }
      <ControlsLayout />
      <Gestures playerRef={playerRef} />
    </MediaPlayer>
  )
}

export default VideoPlayer