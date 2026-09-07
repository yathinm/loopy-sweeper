import { useRef } from 'react';
import type { PointerEventHandler } from 'react';

interface LongPressOptions {
  onPress: () => void;
  onLongPress: () => void;
  delay?: number;
}

export function useLongPress({
  onPress,
  onLongPress,
  delay = 500,
}: LongPressOptions) {
  const timer = useRef<number | null>(null);
  const start = useRef({ x: 0, y: 0 });
  const didLongPress = useRef(false);

  const cancel = () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
  };

  const onPointerDown: PointerEventHandler = (event) => {
    if (event.pointerType === 'mouse') return;
    start.current = { x: event.clientX, y: event.clientY };
    didLongPress.current = false;
    timer.current = window.setTimeout(() => {
      didLongPress.current = true;
      onLongPress();
      navigator.vibrate?.(25);
    }, delay);
  };

  const onPointerMove: PointerEventHandler = (event) => {
    if (
      Math.abs(event.clientX - start.current.x) > 10 ||
      Math.abs(event.clientY - start.current.y) > 10
    ) {
      cancel();
    }
  };

  const onPointerUp: PointerEventHandler = (event) => {
    if (event.pointerType === 'mouse') return;
    cancel();
    if (!didLongPress.current) onPress();
  };

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: cancel };
}
