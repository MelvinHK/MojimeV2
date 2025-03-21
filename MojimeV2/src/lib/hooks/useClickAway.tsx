import { useEffect } from 'react';

const useClickAway = (
  options: {
    onClick: () => void;
    onAway: () => void
  },
  ref: React.RefObject<HTMLElement>
) => {
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        options.onAway();
      } else {
        options.onClick();
      }
    };

    document.addEventListener('click', handleDocumentClick);

    return () => document.removeEventListener('click', handleDocumentClick);
  }, [ref, options]);
};

export default useClickAway;