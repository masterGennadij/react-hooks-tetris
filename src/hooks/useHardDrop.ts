import { useCallback } from 'react';
import { checkCollision } from '../helpers/gameHelpers';
import type { Player, Board, UpdatePositionArgs } from '../types';

export const useHardDrop = (
  player: Player,
  board: Board,
  updatePlayerPosition: (args: UpdatePositionArgs) => void
): (() => void) =>
  useCallback((): void => {
    let drop = 0;
    while (!checkCollision(player, board, { x: 0, y: drop + 1 })) drop++;
    updatePlayerPosition({ x: 0, y: drop, isCollided: true });
  }, [player, board, updatePlayerPosition]);
