import '@vidstack/react/player/styles/base.css';
import '../styles/video/video.css';
import { MediaPlayer, MediaPlayerInstance, MediaProvider } from '@vidstack/react';
import ControlsLayout from './VideoPlayer/ControlsLayout';
import { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  m3u8URL: string,
}

function VideoPlayer({ m3u8URL }: VideoPlayerProps) {
  const playerRef = useRef<MediaPlayerInstance>(null);

  // Player configuration
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    player.qualities.switch = "next";
  }, []);

  return (
    <MediaPlayer
      ref={playerRef}
      className="video-player"
      src={{
        src: m3u8URL,
        type: 'application/x-mpegurl'
      }}
      load="eager"
      playsInline
      autoPlay
      crossOrigin
    >
      <MediaProvider />
      <ControlsLayout />
    </MediaPlayer>
  )
}

export default VideoPlayer