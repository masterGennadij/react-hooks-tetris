import { useReducer } from 'react';
import { loadSavedGame, type SavedGame } from '../helpers/storage';

export type GamePhase = 'idle' | 'playing' | 'paused' | 'gameover';

export interface GameState {
  phase: GamePhase;
  speed: number | null;
  savedGame: SavedGame | null;
  score: number;
  rows: number;
  level: number;
}

export type GameAction =
  | { type: 'START' }
  | { type: 'CONTINUE'; saved: SavedGame }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'GAME_OVER' }
  | { type: 'SOFT_DROP' }
  | { type: 'SOFT_DROP_CANCEL' }
  | { type: 'ROWS_CLEARED'; count: number }
  | { type: 'DISMISS_SAVE' };

const LINE_POINTS = [40, 100, 300, 1200] as const;

export const normalSpeed = (level: number): number => 1000 / (level + 1) + 200;

const initialState: GameState = {
  phase: 'idle',
  speed: null,
  savedGame: loadSavedGame(),
  score: 0,
  rows: 0,
  level: 0,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START':
      return { phase: 'playing', speed: 1000, savedGame: null, score: 0, rows: 0, level: 0 };

    case 'CONTINUE': {
      const { score, rows, level } = action.saved;
      return { phase: 'playing', speed: normalSpeed(level), savedGame: null, score, rows, level };
    }

    case 'PAUSE':
      return state.phase === 'playing'
        ? { ...state, phase: 'paused', speed: normalSpeed(state.level) }
        : state;

    case 'RESUME':
      return state.phase === 'paused' ? { ...state, phase: 'playing' } : state;

    case 'GAME_OVER':
      return { ...state, phase: 'gameover', speed: null };

    case 'SOFT_DROP':
      return state.phase === 'playing' ? { ...state, speed: 50 } : state;

    case 'SOFT_DROP_CANCEL':
      return state.phase === 'playing'
        ? { ...state, speed: normalSpeed(state.level) }
        : state;

    case 'ROWS_CLEARED': {
      if (action.count <= 0 || state.phase !== 'playing') return state;
      const points = LINE_POINTS[Math.min(action.count, 4) - 1];
      const newScore = state.score + points * (state.level + 1);
      const newRows = state.rows + action.count;
      const newLevel = newRows > (state.level + 1) * 10 ? state.level + 1 : state.level;
      return {
        ...state,
        score: newScore,
        rows: newRows,
        level: newLevel,
        speed: normalSpeed(newLevel),
      };
    }

    case 'DISMISS_SAVE':
      return { ...state, savedGame: null };

    default:
      return state;
  }
}

export const useGameReducer = () => useReducer(gameReducer, initialState);
