import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { createStage } from '../helpers/gameHelpers';
import type { Cell, Stage, Player } from '../types';

type UseStageReturn = [Stage, Dispatch<SetStateAction<Stage>>, number];

export const useStage = (player: Player, resetPlayer: () => void): UseStageReturn => {
  const [stage, setStage] = useState<Stage>(createStage());
  const [rowsCleared, setRowsCleared] = useState(0);

  useEffect(() => {
    setRowsCleared(0);

    const sweepRows = (newStage: Stage): Stage =>
      newStage.reduce<Stage>((acc, row) => {
        if (!row.find((cell) => cell[0] === 0)) {
          setRowsCleared((prev) => prev + 1);
          acc.unshift(
            new Array(newStage[0].length).fill([0, 'clear'] as Cell)
          );
          return acc;
        }
        acc.push(row);
        return acc;
      }, []);

    const updateStage = (prevStage: Stage): Stage => {
      const newStage: Stage = prevStage.map((row) =>
        row.map((cell) => (cell[1] === 'clear' ? [0, 'clear'] : cell))
      );

      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            newStage[y + player.position.y][x + player.position.x] = [
              value,
              player.isCollided ? 'merged' : 'clear',
            ];
          }
        });
      });

      if (player.isCollided) {
        resetPlayer();
        return sweepRows(newStage);
      }
      return newStage;
    };

    setStage((prev) => updateStage(prev));
  }, [player, resetPlayer]);

  return [stage, setStage, rowsCleared];
};

