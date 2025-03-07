import '@vidstack/react/player/styles/base.css';
import '../styles/video/captions.css';
import '../styles/video/video.css';
import { Captions, MediaPlayer, MediaPlayerInstance, MediaProvider, Track } from '@vidstack/react';
import ControlsLayout from './VideoPlayer/ControlsLayout';
import { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  m3u8URL: string,
  vttURL?: string,
}

function VideoPlayer({ m3u8URL, vttURL }: VideoPlayerProps) {
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
      src={m3u8URL}
      className="video-player"
      playsInline
      autoPlay
      load="eager"
      crossOrigin
    >
      <MediaProvider>
        <Track key={vttURL} src={vttURL} kind="subtitles" label="English" type="vtt" default />
      </MediaProvider>
      <Captions className="media-captions" />
      <ControlsLayout />
    </MediaPlayer>
  )
}

export default VideoPlayer