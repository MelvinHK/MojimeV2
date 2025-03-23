import '@vidstack/react/player/styles/base.css';
import '../styles/video/video.css';
import { MediaPlayer, MediaPlayerInstance, MediaProvider } from '@vidstack/react';
import ControlsLayout from './VideoPlayer/ControlsLayout';
import { useContext, useEffect, useRef } from 'react';
import { AnimeContext } from '../routes/$animeId';
import { PREFERRED_VOLUME_KEY } from './VideoPlayer/VolumeBtn';

interface VideoPlayerProps {
  m3u8URL: string,
}

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
    >
      <MediaProvider />
      <div className='video-title'>
        {anime?.title ?? ""} - Episode {episode?.number}
      </div>
      <ControlsLayout />
    </MediaPlayer>
  )
}

export default VideoPlayer