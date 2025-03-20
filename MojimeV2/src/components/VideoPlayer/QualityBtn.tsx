import { useEffect } from 'react';
import '../../styles/video/mediaButton.css'
import '../../styles/video/video.css'

import { Menu, useVideoQualityOptions } from "@vidstack/react";

function QualityBtn() {
  const options = useVideoQualityOptions({ auto: false, sort: 'descending' }),
    currentQualityHeight = options.selectedQuality?.height,
    hint = currentQualityHeight ? `${currentQualityHeight}p` : '';

  useEffect(() => {
    if (options.length === 0) return;

    const preferredQuality = localStorage.getItem("preferredQuality");
    options[preferredQuality ?
      options.findIndex(option => option.label === preferredQuality) : 0
    ].select();
  }, [options])

  const preferQuality = (label: string) => {
    localStorage.setItem("preferredQuality", label);
  }

  return options.length > 0 && (
    <Menu.Root>
      <Menu.Button className="media-button quality-button"><u>{hint}</u></Menu.Button>
      <Menu.Items className="media-menu" placement="top" offset={40}>
        <Menu.RadioGroup value={options.selectedValue}>
          {options.map(({ label, value, select }) => (
            <Menu.Radio
              className="media-radio-button"
              onSelect={() => (
                select(),
                preferQuality(label)
              )}
              value={value}
              key={value}
            >
              <div>{label}</div>
            </Menu.Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Items>
    </Menu.Root>
  )
}

export default QualityBtn