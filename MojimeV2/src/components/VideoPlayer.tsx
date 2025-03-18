import '@vidstack/react/player/styles/base.css';
import '../styles/video/captions.css';
import '../styles/video/video.css';
import { MediaPlayer, MediaPlayerInstance } from '@vidstack/react';
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
  }, []);

  return (
    <div className="vp-container">
      <VPContext.Provider value={VPContextValues}>
        <MediaPlayer
          ref={playerRef}
          src={m3u8URL}
          className="video-player"
          load="eager"
          playsInline
          autoPlay
          crossOrigin
        >
          <ControlsLayout />
        </MediaPlayer>
      </VPContext.Provider>
    </div>
  )
}

export default VideoPlayer