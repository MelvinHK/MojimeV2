import '@vidstack/react/player/styles/base.css';
import '../styles/video/captions.css';
import { Captions, MediaPlayer, MediaProvider, Track } from '@vidstack/react';

interface VideoPlayerProps {
  source: string,
  subtitles: string,
}

function VideoPlayer(props: VideoPlayerProps) {
  return (
    <MediaPlayer src={props.source} playsInline crossOrigin>
      <MediaProvider>
        <Track src={props.subtitles} kind="subtitles" label="English" type="vtt" default />
      </MediaProvider>
      <Captions className="media-captions" />
    </MediaPlayer>
  )
}

export default VideoPlayer