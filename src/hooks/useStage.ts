import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';
import { createBoard } from '../helpers/gameHelpers';
import type { Cell, Board, Player } from '../types';

type UseStageReturn = [Board, Dispatch<SetStateAction<Board>>, number];

export const useStage = (player: Player, resetPlayer: () => void): UseStageReturn => {
  const [board, setBoard] = useState<Board>(createBoard());
  const [rowsCleared, setRowsCleared] = useState(0);

  useEffect(() => {
    setRowsCleared(0);

    const sweepRows = (newBoard: Board): Board =>
      newBoard.reduce<Board>((acc, row) => {
        if (!row.find((cell) => cell[0] === 0)) {
          setRowsCleared((prev) => prev + 1);
          acc.unshift(Array.from({ length: newBoard[0].length }, (): Cell => [0, 'clear']));
          return acc;
        }
        acc.push(row);
        return acc;
      }, []);

    const updateBoard = (prevBoard: Board): Board => {
      const newBoard: Board = prevBoard.map((row) =>
        row.map((cell) => (cell[1] === 'clear' ? [0, 'clear'] : cell))
      );

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
        return sweepRows(newBoard);
      }
      return newBoard;
    };

    setBoard((prev) => updateBoard(prev));
    if (player.isCollided) {
      resetPlayer();
    }
  }, [player, resetPlayer]);

  return [board, setBoard, rowsCleared];
};
