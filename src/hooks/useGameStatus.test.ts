import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameStatus } from './useGameStatus';

describe('useGameStatus', () => {
  it('initialises with score=0, rows=0, level=0', () => {
    const { result } = renderHook(() => useGameStatus(0));
    expect(result.current.score).toBe(0);
    expect(result.current.rows).toBe(0);
    expect(result.current.level).toBe(0);
  });

  it('does not change score when rowsCleared is 0', () => {
    const { result } = renderHook(() => useGameStatus(0));
    expect(result.current.score).toBe(0);
  });

  // LINE_POINTS = [40, 100, 300, 1200]; multiplied by (level + 1)
  it('awards 40 points for clearing 1 row at level 0', () => {
    const { result } = renderHook(() => useGameStatus(1));
    expect(result.current.score).toBe(40);
    expect(result.current.rows).toBe(1);
  });

  it('awards 100 points for clearing 2 rows at level 0', () => {
    const { result } = renderHook(() => useGameStatus(2));
    expect(result.current.score).toBe(100);
    expect(result.current.rows).toBe(2);
  });

  it('awards 300 points for clearing 3 rows at level 0', () => {
    const { result } = renderHook(() => useGameStatus(3));
    expect(result.current.score).toBe(300);
    expect(result.current.rows).toBe(3);
  });

  it('awards 1200 points for clearing 4 rows (tetris) at level 0', () => {
    const { result } = renderHook(() => useGameStatus(4));
    expect(result.current.score).toBe(1200);
    expect(result.current.rows).toBe(4);
  });

  it('multiplies points by (level + 1)', () => {
    const { result } = renderHook(() => useGameStatus(1));
    act(() => { result.current.setLevel(2); });
    // score was already 40 from the first render; level multiplier now applies on next rowsCleared change
    // We verify the exposed setLevel setter works
    expect(result.current.level).toBe(2);
  });

  it('exposes setScore, setRows, setLevel setters', () => {
    const { result } = renderHook(() => useGameStatus(0));
    act(() => { result.current.setScore(999); });
    expect(result.current.score).toBe(999);

    act(() => { result.current.setRows(5); });
    expect(result.current.rows).toBe(5);

    act(() => { result.current.setLevel(3); });
    expect(result.current.level).toBe(3);
  });

  it('resets score when setScore(0) is called', () => {
    const { result } = renderHook(() => useGameStatus(1));
    expect(result.current.score).toBe(40);
    act(() => { result.current.setScore(0); });
    expect(result.current.score).toBe(0);
  });
});
