import { useRef, useEffect } from "react";
import Hls from 'hls.js';

interface VideoPlayerProps {
  source: string
}

function VideoPlayer(props: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null); // Holds the Hls instance

  useEffect(() => {
    if (videoRef.current && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(props.source);
      hls.attachMedia(videoRef.current);
      hlsRef.current = hls;

      return () => {
        hlsRef.current && hlsRef.current.destroy();
      };
    }
  }, [props.source]);


  return (
    <video ref={videoRef} controls></video>
  )
}

export default VideoPlayer