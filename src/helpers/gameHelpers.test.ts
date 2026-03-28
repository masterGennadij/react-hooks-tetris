import { describe, it, expect } from 'vitest';
import { createBoard, checkCollision, STAGE_WIDTH, STAGE_HEIGHT } from './gameHelpers';
import type { Board, Player } from '../types';

describe('createBoard', () => {
  it('creates a board with correct dimensions', () => {
    const board = createBoard();
    expect(board).toHaveLength(STAGE_HEIGHT);
    expect(board[0]).toHaveLength(STAGE_WIDTH);
  });

  it('initialises every cell as [0, "clear"]', () => {
    const board = createBoard();
    board.forEach((row) => row.forEach((cell) => {
      expect(cell).toEqual([0, 'clear']);
    }));
  });

  it('each row is an independent array (no shared references)', () => {
    const board = createBoard();
    board[0][0] = ['I', 'merged'];
    expect(board[1][0]).toEqual([0, 'clear']);
  });

  it('each cell is an independent array (no shared references)', () => {
    const board = createBoard();
    board[0][0][0] = 'I';
    expect(board[0][1][0]).toBe(0);
  });
});

const makeBoard = (): Board => createBoard();

const makePlayer = (overrides: Partial<Player> = {}): Player => ({
  position: { x: 0, y: 0 },
  tetromino: [['I']],
  isCollided: false,
  ...overrides,
});

describe('checkCollision', () => {
  it('returns false when piece is within an empty board', () => {
    const board = makeBoard();
    const player = makePlayer({ position: { x: 1, y: 1 } });
    expect(checkCollision(player, board, { x: 0, y: 0 })).toBe(false);
  });

  it('returns true when moving left beyond the board edge', () => {
    const board = makeBoard();
    const player = makePlayer({ position: { x: 0, y: 0 } });
    expect(checkCollision(player, board, { x: -1, y: 0 })).toBe(true);
  });

  it('returns true when moving right beyond the board edge', () => {
    const board = makeBoard();
    const player = makePlayer({ position: { x: STAGE_WIDTH - 1, y: 0 } });
    expect(checkCollision(player, board, { x: 1, y: 0 })).toBe(true);
  });

  it('returns true when moving below the board bottom', () => {
    const board = makeBoard();
    const player = makePlayer({ position: { x: 0, y: STAGE_HEIGHT - 1 } });
    expect(checkCollision(player, board, { x: 0, y: 1 })).toBe(true);
  });

  it('returns true when target cell is merged', () => {
    const board = makeBoard();
    board[1][1] = ['I', 'merged'];
    const player = makePlayer({ position: { x: 1, y: 0 } });
    expect(checkCollision(player, board, { x: 0, y: 1 })).toBe(true);
  });

  it('returns false when target cell is clear even if occupied by active piece', () => {
    const board = makeBoard();
    board[1][1] = ['I', 'clear'];
    const player = makePlayer({ position: { x: 1, y: 0 } });
    expect(checkCollision(player, board, { x: 0, y: 1 })).toBe(false);
  });

  it('skips empty (0) cells in the tetromino shape', () => {
    const board = makeBoard();
    // Piece with a hole: only [0][1] is filled
    const player = makePlayer({
      position: { x: 0, y: 0 },
      tetromino: [[0, 'I']],
    });
    // Moving left would put the 0-cell at x=-1, which is out of bounds —
    // but since it's 0 it should be skipped; only the 'I' at x=1 matters, which is fine.
    expect(checkCollision(player, board, { x: -1, y: 0 })).toBe(false);
  });
});
