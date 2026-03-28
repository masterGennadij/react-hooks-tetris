import { describe, it, expect } from 'vitest';
import { TETROMINOS, getRandomTetromino, CELL_STYLES } from './tetrominos';
import type { TetrominoKey } from '../types';

const KEYS: TetrominoKey[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

describe('TETROMINOS', () => {
  it('defines all 7 tetromino keys plus the empty cell', () => {
    KEYS.forEach((key) => expect(TETROMINOS[key]).toBeDefined());
    expect(TETROMINOS[0]).toBeDefined();
  });

  it('each tetromino shape is a non-empty 2D array', () => {
    KEYS.forEach((key) => {
      const { shape } = TETROMINOS[key];
      expect(shape.length).toBeGreaterThan(0);
      shape.forEach((row) => expect(row.length).toBeGreaterThan(0));
    });
  });

  it('each tetromino shape contains its own key as fill value', () => {
    KEYS.forEach((key) => {
      const hasFill = TETROMINOS[key].shape.some((row) => row.includes(key));
      expect(hasFill, `${key} shape should contain '${key}' cells`).toBe(true);
    });
  });

  it('color is a comma-separated RGB string', () => {
    KEYS.forEach((key) => {
      expect(TETROMINOS[key].color).toMatch(/^\d{1,3},\d{1,3},\d{1,3}$/);
    });
  });
});

describe('getRandomTetromino', () => {
  it('returns a valid tetromino definition', () => {
    const t = getRandomTetromino();
    expect(t).toHaveProperty('shape');
    expect(t).toHaveProperty('color');
  });

  it('returns different pieces over many calls (probabilistic)', () => {
    const keys = new Set(Array.from({ length: 50 }, () => getRandomTetromino().color));
    expect(keys.size).toBeGreaterThan(1);
  });
});

describe('CELL_STYLES', () => {
  it('defines styles for all 7 tetromino keys', () => {
    KEYS.forEach((key) => expect(CELL_STYLES[key]).toBeDefined());
  });

  it('each style has --cell-bg and --cell-border as rgba strings', () => {
    KEYS.forEach((key) => {
      const style = CELL_STYLES[key];
      expect(style['--cell-bg']).toMatch(/^rgba\(/);
      expect(style['--cell-border']).toMatch(/^rgba\(/);
    });
  });

  it('--cell-bg has higher opacity than --cell-border', () => {
    KEYS.forEach((key) => {
      const bg = parseFloat(CELL_STYLES[key]['--cell-bg'].match(/[\d.]+\)$/)![0]);
      const border = parseFloat(CELL_STYLES[key]['--cell-border'].match(/[\d.]+\)$/)![0]);
      expect(bg).toBeGreaterThan(border);
    });
  });
});

// rotate() is not exported, but its behaviour is observable through TETROMINOS shapes.
// We test it indirectly here via a local reimplementation to document the contract,
// and directly via usePlayer tests.
describe('rotate (pure function contract)', () => {
  type Grid = (string | number)[][];

  const rotate = (tetromino: Grid, direction: number): Grid => {
    const rotated = tetromino.map((_, i) => tetromino.map((row) => row[i]));
    return direction > 0 ? rotated.map((row) => [...row].reverse()) : rotated.reverse();
  };

  it('clockwise rotation of a 2x2 is correct', () => {
    const input: Grid = [['a', 'b'], ['c', 'd']];
    expect(rotate(input, 1)).toEqual([['c', 'a'], ['d', 'b']]);
  });

  it('counter-clockwise rotation of a 2x2 is correct', () => {
    const input: Grid = [['a', 'b'], ['c', 'd']];
    expect(rotate(input, -1)).toEqual([['b', 'd'], ['a', 'c']]);
  });

  it('four clockwise rotations return to original shape', () => {
    const input: Grid = [['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i']];
    let result = input;
    for (let i = 0; i < 4; i++) result = rotate(result, 1);
    expect(result).toEqual(input);
  });
});
