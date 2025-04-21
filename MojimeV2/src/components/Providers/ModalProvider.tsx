import { useState, useEffect, useRef, createContext, useContext, ReactNode, MutableRefObject } from 'react';
import { createPortal } from 'react-dom';

import { useGesture } from '@use-gesture/react';
import { useSpring, animated } from '@react-spring/web';

import useWindowSize from '../../lib/hooks/useWindowSize';

const MODAL_POSITIONS_KEY = "modalPositions";

type ModalData = {
  content: ReactNode;
  title: string;
};

type ModalPositions = {
  [id: string]: [number, number];
}

const ModalContext = createContext<{
  /** @important Title must be unique as it acts as the modal's ID. */
  openModal: (content: ReactNode, title: string) => void;
  closeModal: (id: string) => void;
}>({
  openModal: () => { },
  closeModal: () => { },
});

const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modals, setModals] = useState<ModalData[]>([]);
  const modalPositions = useRef<ModalPositions>((() => {
    const stored = localStorage.getItem(MODAL_POSITIONS_KEY);
    return stored ? JSON.parse(stored) : {};
  })());

  const openModal = (content: ReactNode, title: string) => {
    if (modals.some(m => m.title === title)) return;
    setModals(prev => [...prev, { content, title }]);
  };

  const closeModal = (title: string) => {
    setModals(prev => prev.filter(modal => modal.title !== title));
  };

  const bringToFront = (title: string) => {
    setModals(prev => {
      const focused = prev.find((modal) => modal.title === title);
      return focused
        ? [...prev.filter((modal) => modal.title !== title), focused]
        : prev;
    });
  }

  const storePositions = () => {
    localStorage.setItem(MODAL_POSITIONS_KEY, JSON.stringify(modalPositions.current));
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modals.map((m, index) => (
        <DraggableModal
          key={m.title}
          title={m.title}
          position={modalPositions.current[m.title]}
          zIndex={1000 + index}
          onClose={() => closeModal(m.title)}
          onMoved={p => (
            modalPositions.current[m.title] = p.current,
            storePositions()
          )}
          onInteract={() => bringToFront(m.title)}
        >
          {m.content}
        </DraggableModal>
      ))}
    </ModalContext.Provider>
  );
};

export default ModalProvider;

export const useModal = () => useContext(ModalContext);

const DraggableModal = ({
  title,
  children,
  position,
  zIndex,
  onClose,
  onMoved,
  onInteract
}: {
  title: string;
  children: ReactNode;
  position: [number, number];
  zIndex: number;
  onClose: () => void;
  onMoved: (positionRef: MutableRefObject<[number, number]>) => void;
  onInteract: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(position ?? [0, 0]);

  const [{ x, y }, api] = useSpring(() => ({ x: position?.[0] ?? 0, y: position?.[1] ?? 0 }));
  const windowSize = useWindowSize();

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
          handlePositionData(oX, oY);
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

  useEffect(() => {
    if (modalRef.current) {
      const { width, height } = modalRef.current.getBoundingClientRect();

      const newX = Math.min(Math.max(x.get(), 0), windowSize.width - width);
      const newY = Math.min(Math.max(y.get(), 0), windowSize.height - height);

      api.start({ x: newX, y: newY, immediate: true });
      handlePositionData(newX, newY);
    }
  }, [windowSize]);

  const handlePositionData = (x: number, y: number) => {
    positionRef.current = [x, y];
    onMoved(positionRef);
  }

  return createPortal(
    <animated.div
      ref={modalRef}
      id={title}
      className="modal"
      style={{ x, y, zIndex }}
      onFocus={onInteract}
      onGotPointerCapture={onInteract}
      onClick={onInteract}
    >
      <div {...bindDrag()} className="modal-bar" style={{ touchAction: "none" }}>
        <div>{title}</div>
        <button className="x-btn ml-auto" onClick={onClose}>{"\u2715"}</button>
      </div>
      {children}
    </animated.div>,
    document.getElementById("root") || document.body
  );
};