import { useRef } from "react";
import { useMediaStore, MediaPlayerInstance } from "@vidstack/react";

function QualityBtn() {
  const player = useRef<MediaPlayerInstance>(null);

  const { qualities, quality } = useMediaStore(player);

  return (qualities.length > 0 &&
    <div>{quality ? `${quality.height}p` : "X_x"}</div>
  )
}

export default QualityBtn