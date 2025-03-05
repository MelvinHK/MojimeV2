import { useEffect } from 'react';
import '../../styles/video/mediaButton.css'
import '../../styles/video/video.css'

import { Menu, useVideoQualityOptions, useMediaRemote } from "@vidstack/react";

function QualityBtn() {
  const remote = useMediaRemote();

  const options = useVideoQualityOptions({ auto: false, sort: 'descending' }),
    currentQualityHeight = options.selectedQuality?.height,
    hint = currentQualityHeight ? `${currentQualityHeight}p` : '';

  useEffect(() => {
    if (!options) return;
    
    remote.changeQuality(options.length - 1);
  }, [options]);

  return (options.length > 0 &&
    <Menu.Root>
      <Menu.Button className="media-button quality-button"><u>{hint}</u></Menu.Button>
      <Menu.Items className="media-menu" placement="top" offset={40}>
        <Menu.RadioGroup value={options.selectedValue}>
          {options.map(({ label, value, select }) => (
            <Menu.Radio className="media-radio-button" onSelect={select} value={value} key={value}>
              <div>{label}</div>
            </Menu.Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Items>
    </Menu.Root>
  )
}

export default QualityBtn