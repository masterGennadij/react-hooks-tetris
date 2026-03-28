import type { Cell, Board, Player } from '../types';

export const STAGE_WIDTH = 12;
export const STAGE_HEIGHT = 20;

export const createBoard = (): Board =>
  Array.from({ length: STAGE_HEIGHT }, () =>
    Array.from({ length: STAGE_WIDTH }, (): Cell => [0, 'clear'])
  );

export const checkCollision = (
  player: Player,
  board: Board,
  { x: moveX, y: moveY }: { x: number; y: number }
): boolean => {
  for (let y = 0; y < player.tetromino.length; y++) {
    for (let x = 0; x < player.tetromino[y].length; x++) {
      if (player.tetromino[y][x] !== 0) {
        const newY = y + player.position.y + moveY;
        const newX = x + player.position.x + moveX;
        if (!board[newY] || !board[newY][newX] || board[newY][newX][1] !== 'clear') {
          return true;
        }
      }
    }
  }
  return false;
};
