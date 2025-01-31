import { useEffect } from "react"

interface VideoPlayerProps {
  source: string
}

function VideoPlayer(props: VideoPlayerProps) {
  useEffect(() => {
    console.log(props.source);
  }, [])

  return (
    <video></video>
  )
}

export default VideoPlayer