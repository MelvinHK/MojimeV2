import '@vidstack/react/player/styles/base.css';
import '../styles/video/captions.css';
import '../styles/video/video.css';
import { Captions, MediaPlayer, MediaProvider, Track } from '@vidstack/react';
import ControlsLayout from './VideoPlayer/ControlsLayout';

interface VideoPlayerProps {
  m3u8URL: string,
  vttURL: string,
}

function VideoPlayer({ m3u8URL, vttURL }: VideoPlayerProps) {
  return (
    <MediaPlayer src={m3u8URL} className="video-player" playsInline crossOrigin>
      <MediaProvider>
        <Track src={vttURL} kind="subtitles" label="English" type="vtt" default />
      </MediaProvider>
      <Captions className="media-captions" />
      <ControlsLayout />
    </MediaPlayer>
  )
}

export default VideoPlayer