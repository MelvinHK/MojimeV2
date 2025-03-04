import '../../styles/video/video.css'
import { Time } from "@vidstack/react";

function TimeGroup() {
  return (
    <div className="media-time-group">
      <Time className="media-time" type="current" />
      <div className="media-time-divider">/</div>
      <Time className="media-time" type="duration" />
    </div>
  );
}

export default TimeGroup;