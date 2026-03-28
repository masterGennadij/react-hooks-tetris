import type { Cell, Stage, Player } from '../types';

export const STAGE_WIDTH = 12;
export const STAGE_HEIGHT = 20;

export const createStage = (): Stage =>
  Array.from(Array(STAGE_HEIGHT), () =>
    new Array(STAGE_WIDTH).fill([0, 'clear'] as Cell)
  );

export const checkCollision = (
  player: Player,
  stage: Stage,
  { x: moveX, y: moveY }: { x: number; y: number }
): boolean => {
  for (let y = 0; y < player.tetromino.length; y++) {
    for (let x = 0; x < player.tetromino[y].length; x++) {
      if (player.tetromino[y][x] !== 0) {
        const newY = y + player.position.y + moveY;
        const newX = x + player.position.x + moveX;
        if (!stage[newY] || !stage[newY][newX] || stage[newY][newX][1] !== 'clear') {
          return true;
        }
      }
    }
  }
  return false;
};
