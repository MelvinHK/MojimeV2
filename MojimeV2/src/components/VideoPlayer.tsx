import '@vidstack/react/player/styles/base.css';
import '../styles/video/captions.css';
import '../styles/video/video.css';
import { Captions, MediaPlayer, MediaPlayerInstance, MediaProvider, Track } from '@vidstack/react';
import ControlsLayout from './VideoPlayer/ControlsLayout';
import { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  m3u8URL: string,
  vttURL?: string,
  episodeIndex: {
    currentIndex: number,
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
  }
}

function VideoPlayer({ m3u8URL, vttURL, episodeIndex: { currentIndex, setCurrentIndex } }: VideoPlayerProps) {
  const playerRef = useRef<MediaPlayerInstance>(null);
  const initialLoad = useRef(true);

  // Player configuration
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    player.qualities.switch = "next";
    initialLoad.current = false;
  }, []);

  return (
    <MediaPlayer
      ref={playerRef}
      key={m3u8URL}
      src={m3u8URL}
      className="video-player"
      playsInline
      autoPlay
      load="eager"
      crossOrigin
    >
      <MediaProvider>
        <Track src={vttURL} kind="subtitles" label="English" type="vtt" default />
      </MediaProvider>
      <Captions className="media-captions" />
      <button onClick={() => setCurrentIndex(currentIndex + 1)}>Next</button>
      <button onClick={() => setCurrentIndex(currentIndex - 1)}>Prev</button>
      <ControlsLayout />
    </MediaPlayer>
  )
}

export default VideoPlayer