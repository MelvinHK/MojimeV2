import { useGesture } from "@use-gesture/react";
import { useSpring } from "@react-spring/web";

interface MobileGestureProps {
  onTap?: () => void,
  onRightDragRelease?: () => void,
  onLeftDragRelease?: () => void,
  onUpDragRelease?: () => void,
  onDownDragRelease?: () => void,
  onRelease?: () => void,
  options?: {
    dragReleaseThreshold?: number,
    bounds?: {
      top: number, bottom: number, left: number, right: number
    }
  }
}

/**
 * Returns a `use-gesture` bind to attach to an element/component, enabling mobile gestures for it.
 */
function useMobileGesture({
  onTap = () => { },
  onRightDragRelease = () => { },
  onLeftDragRelease = () => { },
  onUpDragRelease = () => { },
  onDownDragRelease = () => { },
  options = {}
}: MobileGestureProps = {}) {
  const {
    dragReleaseThreshold = 70,
    bounds = {
      top: -dragReleaseThreshold,
      bottom: dragReleaseThreshold,
      left: -dragReleaseThreshold,
      right: dragReleaseThreshold
    }
  } = options;

  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  const bindMobileGesture = useGesture(
    {
      onDrag: ({ down, movement: [mX, mY], tap, last }) => {
        const clampedX = Math.min(Math.max(mX, bounds.left), bounds.right);
        const clampedY = Math.min(Math.max(mY, bounds.top), bounds.bottom);

        if (tap) {
          onTap();
          return;
        }

        if (down) {
          api.start({ x: clampedX, y: clampedY, immediate: true });
        }

        if (!down && last) {
          if (Math.abs(mX) > Math.abs(mY) && Math.abs(mX) >= dragReleaseThreshold) {
            mX > 0 ? onRightDragRelease() : onLeftDragRelease();
          } else if (Math.abs(mY) >= dragReleaseThreshold) {
            mY > 0 ? onDownDragRelease() : onUpDragRelease();
          }

          api.start({ x: 0, y: 0 });
        }
      }
    },
    {
      drag: {
        threshold: 10,
        axis: "lock",
        filterTaps: true,
      },
    }
  );

  return { bindMobileGesture, x, y } as const;
}

export default useMobileGesture;