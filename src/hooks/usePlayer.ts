import { useState, useCallback } from 'react';
import { getRandomTetromino, TETROMINOS } from '../helpers/tetrominos';
import { STAGE_WIDTH, checkCollision } from '../helpers/gameHelpers';
import type { Player, UpdatePositionArgs, Stage, CellValue } from '../types';

type UsePlayerReturn = [
  Player,
  (args: UpdatePositionArgs) => void,
  () => void,
  (stage: Stage, direction: number) => void,
];

export const usePlayer = (): UsePlayerReturn => {
  const [player, setPlayer] = useState<Player>({
    position: { x: 0, y: 0 },
    tetromino: TETROMINOS[0].shape,
    isCollided: false,
  });

  const updatePlayerPosition = ({ x, y, isCollided = false }: UpdatePositionArgs): void => {
    setPlayer((prev) => ({
      ...prev,
      position: { x: prev.position.x + x, y: prev.position.y + y },
      isCollided,
    }));
  };

  const resetPlayer = useCallback((): void => {
    setPlayer({
      position: { x: STAGE_WIDTH / 2 - 2, y: 0 },
      tetromino: getRandomTetromino().shape,
      isCollided: false,
    });
  }, []);

  const rotate = (tetromino: CellValue[][], direction: number): CellValue[][] => {
    const rotated = tetromino.map((_, index) => tetromino.map((row) => row[index]));
    return direction > 0
      ? rotated.map((row) => row.reverse())
      : rotated.reverse();
  };

  const rotatePlayer = (stage: Stage, direction: number): void => {
    const cloned: Player = JSON.parse(JSON.stringify(player));
    cloned.tetromino = rotate(cloned.tetromino, direction);

    const origX = cloned.position.x;
    let offset = 1;
    while (checkCollision(cloned, stage, { x: 0, y: 0 })) {
      cloned.position.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > cloned.tetromino[0].length) {
        rotate(cloned.tetromino, -direction);
        cloned.position.x = origX;
        return;
      }
    }
    setPlayer(cloned);
  };

  return [player, updatePlayerPosition, resetPlayer, rotatePlayer];
};

