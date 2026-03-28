import { useRef } from 'react';
import styles from './MobileControls.module.css';

interface MobileControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onSoftDropStart: () => void;
  onSoftDropEnd: () => void;
  onRotate: () => void;
}

export const MobileControls = ({
  onMoveLeft,
  onMoveRight,
  onSoftDropStart,
  onSoftDropEnd,
  onRotate,
}: MobileControlsProps) => {
  const repeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRepeat = (action: () => void): void => {
    action();
    repeatRef.current = setInterval(action, 110);
  };

  const stopRepeat = (): void => {
    if (repeatRef.current !== null) {
      clearInterval(repeatRef.current);
      repeatRef.current = null;
    }
  };

  return (
    <div className={styles.controls}>
      <div className={styles.grid}>
        <span />
        <button className={styles.btn} onPointerDown={onRotate} aria-label="Rotate">
          ↻
        </button>
        <span />
        <button
          className={styles.btn}
          onPointerDown={() => startRepeat(onMoveLeft)}
          onPointerUp={stopRepeat}
          onPointerLeave={stopRepeat}
          onPointerCancel={stopRepeat}
          aria-label="Move left"
        >
          ◀
        </button>
        <button
          className={styles.btn}
          onPointerDown={onSoftDropStart}
          onPointerUp={onSoftDropEnd}
          onPointerLeave={onSoftDropEnd}
          onPointerCancel={onSoftDropEnd}
          aria-label="Soft drop"
        >
          ▼
        </button>
        <button
          className={styles.btn}
          onPointerDown={() => startRepeat(onMoveRight)}
          onPointerUp={stopRepeat}
          onPointerLeave={stopRepeat}
          onPointerCancel={stopRepeat}
          aria-label="Move right"
        >
          ▶
        </button>
      </div>
    </div>
  );
};
