import { useState, useCallback } from 'react';
import { getRandomTetromino, TETROMINOS } from '../helpers/tetrominos';
import { STAGE_WIDTH, checkCollision } from '../helpers/gameHelpers';
import type { Player, UpdatePositionArgs, Board, CellValue } from '../types';

export interface UsePlayerReturn {
  player: Player;
  updatePlayerPosition: (args: UpdatePositionArgs) => void;
  resetPlayer: () => void;
  rotatePlayer: (board: Board, direction: number) => void;
  restorePlayer: (saved: Player) => void;
  /** Atomic left/right move: collision check runs inside the state updater so
   *  rapid-fire calls (key-repeat, mobile interval) can never skip a wall check. */
  moveHorizontal: (board: Board, direction: number) => void;
}

const rotate = (tetromino: CellValue[][], direction: number): CellValue[][] => {
  const rotated = tetromino.map((_, index) => tetromino.map((row) => row[index]));
  return direction > 0 ? rotated.map((row) => row.reverse()) : rotated.reverse();
};

export const usePlayer = (): UsePlayerReturn => {
  const [player, setPlayer] = useState<Player>({
    position: { x: 0, y: 0 },
    tetromino: TETROMINOS[0].shape,
    isCollided: false,
  });

  const updatePlayerPosition = useCallback(({ x, y, isCollided = false }: UpdatePositionArgs): void => {
    setPlayer((prev) => ({
      ...prev,
      position: { x: prev.position.x + x, y: prev.position.y + y },
      isCollided,
    }));
  }, []);

  const resetPlayer = useCallback((): void => {
    setPlayer({
      position: { x: STAGE_WIDTH / 2 - 2, y: 0 },
      tetromino: getRandomTetromino().shape,
      isCollided: false,
    });
  }, []);

  const rotatePlayer = useCallback((board: Board, direction: number): void => {
    const cloned = structuredClone(player);
    cloned.tetromino = rotate(cloned.tetromino, direction);

    const origX = cloned.position.x;
    let offset = 1;
    while (checkCollision(cloned, board, { x: 0, y: 0 })) {
      cloned.position.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (Math.abs(offset) > cloned.tetromino[0].length) {
        cloned.position.x = origX;
        return;
      }
    }
    setPlayer(cloned);
  }, [player]);

  const restorePlayer = useCallback((saved: Player): void => {
    setPlayer(saved);
  }, []);

  // The board argument is captured from the caller's closure. For horizontal
  // movement the board does not change between rapid ticks, so a slightly stale
  // board is safe. What matters is that `prev` is always the latest player
  // state — which functional updates guarantee — so back-to-back calls chain
  // the check correctly and can never skip a wall.
  const moveHorizontal = useCallback((board: Board, direction: number): void => {
    setPlayer((prev) => {
      if (checkCollision(prev, board, { x: direction, y: 0 })) return prev;
      return { ...prev, position: { x: prev.position.x + direction, y: prev.position.y } };
    });
  }, []);

  return { player, updatePlayerPosition, resetPlayer, rotatePlayer, restorePlayer, moveHorizontal };
};
