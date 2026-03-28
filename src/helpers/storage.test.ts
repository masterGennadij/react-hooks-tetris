import { describe, it, expect, beforeEach } from 'vitest';
import { loadSavedGame, saveGame, clearSavedGame, type SavedGame } from './storage';
import { createBoard } from './gameHelpers';
import { TETROMINOS } from './tetrominos';

const makeSave = (overrides: Partial<SavedGame> = {}): SavedGame => ({
  board: createBoard(),
  player: {
    position: { x: 5, y: 3 },
    tetromino: TETROMINOS.T.shape,
    isCollided: false,
  },
  score: 340,
  rows: 4,
  level: 1,
  ...overrides,
});

beforeEach(() => {
  localStorage.clear();
});

describe('saveGame / loadSavedGame', () => {
  it('returns null when nothing is saved', () => {
    expect(loadSavedGame()).toBeNull();
  });

  it('round-trips a saved game correctly', () => {
    const data = makeSave();
    saveGame(data);
    expect(loadSavedGame()).toEqual(data);
  });

  it('preserves score, rows, and level', () => {
    saveGame(makeSave({ score: 1200, rows: 10, level: 2 }));
    const loaded = loadSavedGame();
    expect(loaded?.score).toBe(1200);
    expect(loaded?.rows).toBe(10);
    expect(loaded?.level).toBe(2);
  });

  it('preserves player position and tetromino shape', () => {
    const player = { position: { x: 3, y: 7 }, tetromino: TETROMINOS.I.shape, isCollided: false };
    saveGame(makeSave({ player }));
    expect(loadSavedGame()?.player).toEqual(player);
  });

  it('overwrites a previous save with the latest state', () => {
    saveGame(makeSave({ score: 100 }));
    saveGame(makeSave({ score: 500 }));
    expect(loadSavedGame()?.score).toBe(500);
  });
});

describe('clearSavedGame', () => {
  it('removes the saved game so loadSavedGame returns null', () => {
    saveGame(makeSave());
    clearSavedGame();
    expect(loadSavedGame()).toBeNull();
  });

  it('is a no-op when nothing is saved', () => {
    expect(() => clearSavedGame()).not.toThrow();
    expect(loadSavedGame()).toBeNull();
  });
});

describe('loadSavedGame error handling', () => {
  it('returns null when localStorage contains malformed JSON', () => {
    localStorage.setItem('tetris-saved-game', '{bad json');
    expect(loadSavedGame()).toBeNull();
  });
});
