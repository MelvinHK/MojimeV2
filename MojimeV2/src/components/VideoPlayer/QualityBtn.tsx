import { useEffect } from 'react';
import '../../styles/video/mediaButton.css'
import '../../styles/video/video.css'

import { Menu, useVideoQualityOptions } from "@vidstack/react";

const PREFERRED_QUALITY_KEY = "preferredQuality";

function QualityBtn() {
  const options = useVideoQualityOptions({ auto: false, sort: 'descending' }),
    currentQualityHeight = options.selectedQuality?.height,
    hint = currentQualityHeight ? `${currentQualityHeight}p` : '';

  useEffect(() => {
    if (options.length === 0) return;

    const preferredQuality = localStorage.getItem(PREFERRED_QUALITY_KEY);
    const pqIndex = options.findIndex(option => option.label === preferredQuality);

    options[pqIndex !== -1 ? pqIndex : 0].select();
  }, [options])

  const preferQuality = (label: string) => {
    localStorage.setItem(PREFERRED_QUALITY_KEY, label);
  }

  return options.length > 0 && (
    <Menu.Root>
      <Menu.Button className="media-button quality-button" title="Quality"><u>{hint}</u></Menu.Button>
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