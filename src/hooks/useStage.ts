import { useState, useEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import { createBoard, checkCollision, STAGE_HEIGHT } from '../helpers/gameHelpers';
import type { Cell, Board, Player } from '../types';

type UseStageReturn = [Board, Dispatch<SetStateAction<Board>>, number];

export const useStage = (player: Player, resetPlayer: () => void): UseStageReturn => {
  const [board, setBoard] = useState<Board>(createBoard());
  const [rowsCleared, setRowsCleared] = useState(0);

  // Mirror board in a ref so the player-effect can read the latest board
  // without adding `board` to its dependency array (which would cause a loop).
  // We must NOT call setRowsCleared inside the setBoard functional updater —
  // that is a side effect in a render-phase function that Strict Mode calls
  // twice, corrupting the count and causing missed row clears.
  const boardRef = useRef<Board>(board);
  useEffect(() => {
    boardRef.current = board;
  });

  useEffect(() => {
    const sweepRows = (newBoard: Board): [Board, number] => {
      let count = 0;
      const swept = newBoard.reduce<Board>((acc, row) => {
        if (row.every((cell) => cell[1] === 'merged')) {
          count++;
          acc.unshift(Array.from({ length: newBoard[0].length }, (): Cell => [0, 'clear']));
          return acc;
        }
        acc.push(row);
        return acc;
      }, []);
      return [swept, count];
    };

    // Build the updated board from the latest committed board (via ref).
    const newBoard: Board = boardRef.current.map((row) =>
      row.map((cell) => (cell[1] === 'merged' ? cell : [0, 'clear']))
    );

    // Ghost drop distance — capped at STAGE_HEIGHT to guard against all-zero
    // tetrominoes where checkCollision never fires.
    let ghostDrop = 0;
    while (
      ghostDrop < STAGE_HEIGHT &&
      !checkCollision(player, newBoard, { x: 0, y: ghostDrop + 1 })
    ) ghostDrop++;

    // Paint ghost cells (only on empty cells — merged cells take priority).
    player.tetromino.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const ghostY = y + player.position.y + ghostDrop;
          const ghostX = x + player.position.x;
          if (newBoard[ghostY]?.[ghostX]?.[1] === 'clear') {
            newBoard[ghostY][ghostX] = [value, 'ghost'];
          }
        }
      });
    });

    // Paint the active piece on top (overwrites ghost cells where they overlap).
    player.tetromino.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          newBoard[y + player.position.y][x + player.position.x] = [
            value,
            player.isCollided ? 'merged' : 'clear',
          ];
        }
      });
    });

    if (player.isCollided) {
      const [sweptBoard, count] = sweepRows(newBoard);
      setBoard(sweptBoard);
      setRowsCleared(count);
      resetPlayer();
    } else {
      setBoard(newBoard);
      setRowsCleared(0);
    }
  }, [player, resetPlayer]);

  return [board, setBoard, rowsCleared];
};
