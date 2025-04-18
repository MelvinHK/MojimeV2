import { useRef, useEffect } from 'react';

import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import 'videojs-hls-quality-selector';

import 'video.js/dist/video-js.css';
import '../../styles/videojs/video.css';

interface VideoJSProps {
  options: any; // Bruh
  onReady?: (player: Player) => void;
}

function VideoJS({ options, onReady }: VideoJSProps) {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current?.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        if (onReady) {
          onReady(player);
        }
      }));
    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options]);

  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player className="player-wrapper" ref={videoRef} />
  );
};

function VideoPlayer({ m3u8URL }: { m3u8URL: string }) {
  const playerRef = useRef<Player>();

  const options = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: m3u8URL,
      type: "application/x-mpegurl"
    }]
  }

  const handlePlayerReady = (player: Player) => {
    playerRef.current = player;

    player.on('waiting', () => {
      console.log('Player is waiting');
    });

    player.on('dispose', () => {
      console.log('Player will dispose');
    });
  };

  return (
    <VideoJS options={options} onReady={handlePlayerReady} />
  )
}

export default VideoPlayer;