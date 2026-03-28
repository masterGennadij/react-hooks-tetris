import { useRef, useEffect } from 'react';
import styles from './MobileControls.module.css';

interface MobileControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onSoftDropStart: () => void;
  onSoftDropEnd: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  onPause: () => void;
}

export const MobileControls = ({
  onMoveLeft,
  onMoveRight,
  onSoftDropStart,
  onSoftDropEnd,
  onRotate,
  onHardDrop,
  onPause,
}: MobileControlsProps) => {
  const repeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { clearInterval(repeatRef.current ?? undefined); }, []);

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
        <button className={styles.btn} onPointerDown={onPause} aria-label="Pause">
          ⏸
        </button>
        <button className={styles.btn} onPointerDown={onRotate} aria-label="Rotate">
          ↻
        </button>
        <button className={styles.btn} onPointerDown={onHardDrop} aria-label="Hard drop">
          ⤓
        </button>
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
