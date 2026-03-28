import { useCallback } from 'react';
import type { KeyboardEvent } from 'react';
import type { GamePhase } from './useGameReducer';

interface UseKeyboardProps {
  phase: GamePhase;
  moveLeft: () => void;
  moveRight: () => void;
  softDropStart: () => void;
  softDropEnd: () => void;
  hardDrop: () => void;
  rotate: () => void;
  togglePause: () => void;
}

export const useKeyboard = ({
  phase,
  moveLeft,
  moveRight,
  softDropStart,
  softDropEnd,
  hardDrop,
  rotate,
  togglePause,
}: UseKeyboardProps) => {
  const onKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        if (phase === 'playing' || phase === 'paused') togglePause();
        return;
      }
      if (phase !== 'playing') return;
      if (e.key === 'ArrowLeft') moveLeft();
      else if (e.key === 'ArrowRight') moveRight();
      else if (e.key === 'ArrowDown') softDropStart();
      else if (e.key === 'ArrowUp') rotate();
      else if (e.key === ' ') {
        e.preventDefault();
        hardDrop();
      }
    },
    [phase, moveLeft, moveRight, softDropStart, hardDrop, rotate, togglePause]
  );

  const onKeyUp = useCallback(
    (e: KeyboardEvent): void => {
      if (phase === 'playing' && e.key === 'ArrowDown') softDropEnd();
    },
    [phase, softDropEnd]
  );

  return { onKeyDown, onKeyUp };
};
