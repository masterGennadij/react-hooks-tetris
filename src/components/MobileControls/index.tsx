import React, { useRef } from 'react';
import { ControlsWrapper, ControlGrid, ControlBtn } from './styles';

interface MobileControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onSoftDropStart: () => void;
  onSoftDropEnd: () => void;
  onRotate: () => void;
}

const MobileControls = ({
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
    <ControlsWrapper>
      <ControlGrid>
        <span />
        <ControlBtn onPointerDown={onRotate} aria-label="Rotate">
          ↻
        </ControlBtn>
        <span />
        <ControlBtn
          onPointerDown={() => startRepeat(onMoveLeft)}
          onPointerUp={stopRepeat}
          onPointerLeave={stopRepeat}
          onPointerCancel={stopRepeat}
          aria-label="Move left"
        >
          ◀
        </ControlBtn>
        <ControlBtn
          onPointerDown={onSoftDropStart}
          onPointerUp={onSoftDropEnd}
          onPointerLeave={onSoftDropEnd}
          onPointerCancel={onSoftDropEnd}
          aria-label="Soft drop"
        >
          ▼
        </ControlBtn>
        <ControlBtn
          onPointerDown={() => startRepeat(onMoveRight)}
          onPointerUp={stopRepeat}
          onPointerLeave={stopRepeat}
          onPointerCancel={stopRepeat}
          aria-label="Move right"
        >
          ▶
        </ControlBtn>
      </ControlGrid>
    </ControlsWrapper>
  );
};

export default MobileControls;
