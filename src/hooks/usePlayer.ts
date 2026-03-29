import { useState, useCallback, useRef } from 'react';
import { TETROMINOS, type TetrominoDefinition } from '../helpers/tetrominos';
import { nextFromBag } from '../helpers/bag';
import { STAGE_WIDTH, checkCollision } from '../helpers/gameHelpers';
import type { TetrominoKey, Player, UpdatePositionArgs, Board, CellValue } from '../types';

export interface UsePlayerReturn {
  player: Player;
  nextPiece: TetrominoDefinition;
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
  // 7-bag state held in refs so resetPlayer callback never goes stale
  const bagRef = useRef<TetrominoKey[]>([]);
  const nextPieceRef = useRef<TetrominoDefinition>(TETROMINOS['I']);

  // Draw the first "next" piece lazily on mount
  const [nextPiece, setNextPiece] = useState<TetrominoDefinition>(() => {
    const [piece, bag] = nextFromBag([]);
    bagRef.current = bag;
    nextPieceRef.current = piece;
    return piece;
  });

  const [player, setPlayer] = useState<Player>(() => {
    // Draw the first active piece from the bag initialised above so the player
    // never holds the all-zero placeholder shape.
    const [activePiece, newBag] = nextFromBag(bagRef.current);
    bagRef.current = newBag;
    return {
      position: { x: STAGE_WIDTH / 2 - 2, y: 0 },
      tetromino: activePiece.shape,
      isCollided: false,
    };
  });

  const updatePlayerPosition = useCallback(({ x, y, isCollided = false }: UpdatePositionArgs): void => {
    setPlayer((prev) => ({
      ...prev,
      position: { x: prev.position.x + x, y: prev.position.y + y },
      isCollided,
    }));
  }, []);

  const resetPlayer = useCallback((): void => {
    // Current nextPiece becomes the active piece; draw a new nextPiece from the bag
    const [newNext, newBag] = nextFromBag(bagRef.current);
    bagRef.current = newBag;
    const activeTetromino = nextPieceRef.current;
    nextPieceRef.current = newNext;

    setPlayer({
      position: { x: STAGE_WIDTH / 2 - 2, y: 0 },
      tetromino: activeTetromino.shape,
      isCollided: false,
    });
    setNextPiece(newNext);
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

  return { player, nextPiece, updatePlayerPosition, resetPlayer, rotatePlayer, restorePlayer, moveHorizontal };
};
