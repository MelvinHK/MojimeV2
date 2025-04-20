import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { useGesture } from '@use-gesture/react';
import { useSpring, animated } from '@react-spring/web';

import useWindowSize from './useWindowSize';

const useModal = (modalContent: React.ReactNode, title?: React.ReactNode) => {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));
  const positionRef = useRef<[number, number]>([0, 0]);

  const bindDrag = useGesture(
    {
      onDrag: ({ event, down, offset: [oX, oY], cancel }) => {
        if ((event.target as HTMLElement).closest("button")) {
          cancel();
          return;
        }

        if (down) {
          api.start({ x: oX, y: oY, immediate: true });
        } else {
          positionRef.current = [oX, oY];
        }
      }
    },
    {
      drag: {
        bounds: document.body,
        from: () => positionRef.current,
      },
    }
  );

  // Keep modal within window during window-resize
  const windowSize = useWindowSize();
  useEffect(() => {
    if (modalRef.current) {
      const { width, height } = modalRef.current.getBoundingClientRect();

      const newX = Math.min(Math.max(x.get(), 0), windowSize.width - width);
      const newY = Math.min(Math.max(y.get(), 0), windowSize.height - height);

      api.start({ x: newX, y: newY, immediate: true });
      positionRef.current = [newX, newY];
    }
  }, [windowSize, api, x, y]);

  return {
    modal: createPortal(
      <animated.div ref={modalRef} className="modal" style={{ x, y, visibility: showModal ? "visible" : "hidden" }}>
        <div {...bindDrag()} className="modal-bar" style={{ touchAction: "none" }}>
          {title && <div>{title}</div>}
          <button className="x-btn ml-auto" onClick={() => setShowModal(false)}>
            {"\u2715"}
          </button>
        </div>
        {modalContent}
      </animated.div >,
      document.getElementById("root") || document.body
    ),
    setShowModal,
    showModal
  };
}

export default useModal;