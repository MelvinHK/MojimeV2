import '@vidstack/react/player/styles/base.css';
import '../styles/video/captions.css';
import '../styles/video/video.css';
import { MediaPlayer, MediaPlayerInstance, MediaProvider } from '@vidstack/react';
import ControlsLayout from './VideoPlayer/ControlsLayout';
import { useEffect, useRef, createContext } from 'react';

interface VideoPlayerProps {
  m3u8URL: string,
  episodeIndex: {
    currentIndex: number,
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
  }
}

interface VPContextType {
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const VPContext = createContext<VPContextType>({
  currentIndex: 0,
  setCurrentIndex: () => 0
});

function VideoPlayer({ m3u8URL, episodeIndex: { currentIndex, setCurrentIndex } }: VideoPlayerProps) {
  const playerRef = useRef<MediaPlayerInstance>(null);

  const VPContextValues = { currentIndex, setCurrentIndex };

  // Player configuration
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    player.qualities.switch = "next";

    console.log(m3u8URL)
  }, []);

  return (
    <VPContext.Provider value={VPContextValues}>
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
    </VPContext.Provider>
  )
}

export default VideoPlayer