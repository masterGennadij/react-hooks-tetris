export type TetrominoKey = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';
export type CellValue = 0 | TetrominoKey;
export type CellStatus = 'clear' | 'merged';
export type Cell = [CellValue, CellStatus];
export type Stage = Cell[][];

export interface Player {
  position: { x: number; y: number };
  tetromino: CellValue[][];
  isCollided: boolean;
}

export interface UpdatePositionArgs {
  x: number;
  y: number;
  isCollided?: boolean;
}
