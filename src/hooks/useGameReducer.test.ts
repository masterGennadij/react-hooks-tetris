import { describe, it, expect } from 'vitest';
import { gameReducer, normalSpeed, type GameState, type GameAction } from './useGameReducer';

const base: GameState = {
  phase: 'idle',
  speed: null,
  savedGame: null,
  score: 0,
  rows: 0,
  level: 0,
};

const playing: GameState = { ...base, phase: 'playing', speed: 1000 };

const dispatch = (state: GameState, action: GameAction) => gameReducer(state, action);

describe('normalSpeed', () => {
  it('returns 1200 at level 0', () => expect(normalSpeed(0)).toBe(1200));
  it('decreases as level increases', () => expect(normalSpeed(1)).toBeLessThan(normalSpeed(0)));
});

describe('START', () => {
  it('sets phase to playing and resets score/rows/level', () => {
    const s = dispatch({ ...base, score: 500, rows: 10, level: 2 }, { type: 'START' });
    expect(s.phase).toBe('playing');
    expect(s.score).toBe(0);
    expect(s.rows).toBe(0);
    expect(s.level).toBe(0);
    expect(s.speed).toBe(1000);
    expect(s.savedGame).toBeNull();
  });
});

describe('CONTINUE', () => {
  const saved = { board: [], player: {} as never, score: 340, rows: 4, level: 1 };

  it('restores score, rows, level', () => {
    const s = dispatch(base, { type: 'CONTINUE', saved });
    expect(s.score).toBe(340);
    expect(s.rows).toBe(4);
    expect(s.level).toBe(1);
  });

  it('sets phase to playing (not paused)', () => {
    expect(dispatch(base, { type: 'CONTINUE', saved }).phase).toBe('playing');
  });

  it('derives speed from saved level', () => {
    const s = dispatch(base, { type: 'CONTINUE', saved });
    expect(s.speed).toBe(normalSpeed(1));
  });

  it('clears savedGame from state', () => {
    expect(dispatch({ ...base, savedGame: saved }, { type: 'CONTINUE', saved }).savedGame).toBeNull();
  });
});

describe('PAUSE / RESUME', () => {
  it('pauses a playing game', () => {
    expect(dispatch(playing, { type: 'PAUSE' }).phase).toBe('paused');
  });

  it('resets speed to normalSpeed on pause (clears soft-drop)', () => {
    const softDropping = { ...playing, speed: 50 };
    const s = dispatch(softDropping, { type: 'PAUSE' });
    expect(s.speed).toBe(normalSpeed(s.level));
  });

  it('is a no-op when already paused', () => {
    const paused = { ...playing, phase: 'paused' as const };
    expect(dispatch(paused, { type: 'PAUSE' })).toBe(paused);
  });

  it('resumes a paused game', () => {
    const paused = { ...playing, phase: 'paused' as const };
    expect(dispatch(paused, { type: 'RESUME' }).phase).toBe('playing');
  });

  it('is a no-op when not paused', () => {
    expect(dispatch(playing, { type: 'RESUME' })).toBe(playing);
  });
});

describe('GAME_OVER', () => {
  it('sets phase to gameover and nulls speed', () => {
    const s = dispatch(playing, { type: 'GAME_OVER' });
    expect(s.phase).toBe('gameover');
    expect(s.speed).toBeNull();
  });
});

describe('SOFT_DROP / SOFT_DROP_CANCEL', () => {
  it('sets speed to 50 while playing', () => {
    expect(dispatch(playing, { type: 'SOFT_DROP' }).speed).toBe(50);
  });

  it('is a no-op when not playing', () => {
    const idle = { ...base };
    expect(dispatch(idle, { type: 'SOFT_DROP' })).toBe(idle);
  });

  it('restores normal speed on cancel', () => {
    const fast = { ...playing, speed: 50 };
    expect(dispatch(fast, { type: 'SOFT_DROP_CANCEL' }).speed).toBe(normalSpeed(0));
  });
});

describe('ROWS_CLEARED', () => {
  // LINE_POINTS = [40, 100, 300, 1200]
  it('awards 40 pts for 1 row at level 0', () => {
    expect(dispatch(playing, { type: 'ROWS_CLEARED', count: 1 }).score).toBe(40);
  });

  it('awards 100 pts for 2 rows at level 0', () => {
    expect(dispatch(playing, { type: 'ROWS_CLEARED', count: 2 }).score).toBe(100);
  });

  it('awards 300 pts for 3 rows at level 0', () => {
    expect(dispatch(playing, { type: 'ROWS_CLEARED', count: 3 }).score).toBe(300);
  });

  it('awards 1200 pts for 4 rows (tetris) at level 0', () => {
    expect(dispatch(playing, { type: 'ROWS_CLEARED', count: 4 }).score).toBe(1200);
  });

  it('multiplies points by (level + 1)', () => {
    const lv2 = { ...playing, level: 2 };
    expect(dispatch(lv2, { type: 'ROWS_CLEARED', count: 1 }).score).toBe(40 * 3);
  });

  it('accumulates rows', () => {
    const s = dispatch({ ...playing, rows: 3 }, { type: 'ROWS_CLEARED', count: 2 });
    expect(s.rows).toBe(5);
  });

  it('levels up when rows cross the threshold', () => {
    const nearThreshold = { ...playing, rows: 9 };
    const s = dispatch(nearThreshold, { type: 'ROWS_CLEARED', count: 2 });
    expect(s.level).toBe(1);
    expect(s.speed).toBe(normalSpeed(1));
  });

  it('does not level up before the threshold', () => {
    const s = dispatch({ ...playing, rows: 5 }, { type: 'ROWS_CLEARED', count: 2 });
    expect(s.level).toBe(0);
  });

  it('is a no-op when count is 0', () => {
    expect(dispatch(playing, { type: 'ROWS_CLEARED', count: 0 })).toBe(playing);
  });

  it('is a no-op when not playing', () => {
    const paused = { ...playing, phase: 'paused' as const };
    expect(dispatch(paused, { type: 'ROWS_CLEARED', count: 2 })).toBe(paused);
  });
});
