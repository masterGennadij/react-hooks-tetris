import { TETROMINOS, type TetrominoDefinition } from './tetrominos';
import type { TetrominoKey } from '../types';

const PIECE_KEYS: TetrominoKey[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

const shuffle = (arr: TetrominoKey[]): TetrominoKey[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * Draws the next piece from the 7-bag. If the bag is empty a fresh shuffled
 * bag is created first, guaranteeing all 7 pieces appear before any repeats.
 * Returns [piece, remainingBag] — pure, no mutation.
 */
export const nextFromBag = (bag: TetrominoKey[]): [TetrominoDefinition, TetrominoKey[]] => {
  const filled = bag.length > 0 ? bag : shuffle(PIECE_KEYS);
  const [key, ...rest] = filled;
  return [TETROMINOS[key], rest];
};
