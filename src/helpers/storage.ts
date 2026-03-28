import type { Board, Player } from '../types';

const STORAGE_KEY = 'tetris-saved-game';

export interface SavedGame {
  board: Board;
  player: Player;
  score: number;
  rows: number;
  level: number;
}

export const loadSavedGame = (): SavedGame | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedGame;
  } catch {
    return null;
  }
};

export const saveGame = (data: SavedGame): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable or full — fail silently
  }
};

export const clearSavedGame = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
