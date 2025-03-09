import '@vidstack/react/player/styles/base.css';
import '../styles/video/captions.css';
import '../styles/video/video.css';
import { Captions, MediaPlayer, MediaPlayerInstance, MediaProvider, Track } from '@vidstack/react';
import ControlsLayout from './VideoPlayer/ControlsLayout';
import { useState, useEffect, useRef, createContext, RefObject, SetStateAction } from 'react';
import FallbackControlsLayout from './VideoPlayer/FallbackControlsLayout';

interface VideoPlayerProps {
  m3u8URL: string,
  vttURL?: string,
  episodeIndex: {
    currentIndex: number,
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
  }
}

interface VPContextType {
  containerRef: RefObject<HTMLDivElement> | null;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const VPContext = createContext<VPContextType>({
  containerRef: null,
  currentIndex: 0,
  setCurrentIndex: () => 0
});

function VideoPlayer({ m3u8URL, vttURL, episodeIndex: { currentIndex, setCurrentIndex } }: VideoPlayerProps) {
  const playerRef = useRef<MediaPlayerInstance>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isFallbackControls, setIsFallbackControls] = useState(false);

  const VPContextValues = { containerRef, currentIndex, setCurrentIndex };

  // Player configuration
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    player.qualities.switch = "next";
  }, []);

  return (
    <div ref={containerRef} className="vp-container">
      <VPContext.Provider value={VPContextValues}>
        <MediaPlayer
          ref={playerRef}
          key={m3u8URL}
          src={m3u8URL}
          className="video-player"
          load="eager"
          playsInline
          autoPlay
          crossOrigin
          onSourceChange={() => setIsFallbackControls(true)}
          onCanPlay={() => setIsFallbackControls(false)}
        >
          <MediaProvider>
            <Track src={vttURL} kind="subtitles" label="English" type="vtt" default />
          </MediaProvider>
          <Captions className="media-captions" />
          <ControlsLayout />
        </MediaPlayer>
        {isFallbackControls && <FallbackControlsLayout />}
      </VPContext.Provider>
    </div>
  )
}

export default VideoPlayer