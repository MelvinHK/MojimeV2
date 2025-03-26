import '@vidstack/react/player/styles/base.css';
import '../styles/video/video.css';
import '../styles/video/gestures.css';
import { MediaPlayer, MediaPlayerInstance, MediaProvider } from '@vidstack/react';
import ControlsLayout from './VideoPlayer/ControlsLayout';
import { useContext, useEffect, useRef } from 'react';
import { AnimeContext } from '../routes/$animeId';
import { PREFERRED_VOLUME_KEY } from './VideoPlayer/VolumeBtn';
import Gestures from './VideoPlayer/Gestures';

interface VideoPlayerProps {
  m3u8URL: string,
}

export const CONTROLS_DELAY = 2000;

function VideoPlayer({ m3u8URL }: VideoPlayerProps) {
  const { anime, episode } = useContext(AnimeContext);

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
      playsInline
      autoPlay
      crossOrigin
      controlsDelay={CONTROLS_DELAY}
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