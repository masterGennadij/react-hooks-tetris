import { memo, type CSSProperties } from 'react';
import { Cell } from '../Cell';
import type { TetrominoDefinition } from '../../helpers/tetrominos';
import type { CellValue } from '../../types';
import styles from './NextPiece.module.css';

interface NextPieceProps {
  next: TetrominoDefinition;
}

const PREVIEW_SIZE = 4;

/** Pads the tetromino shape into a fixed PREVIEW_SIZE × PREVIEW_SIZE grid. */
const toPreviewGrid = (shape: CellValue[][]): CellValue[][] =>
  Array.from({ length: PREVIEW_SIZE }, (_, r) =>
    Array.from({ length: PREVIEW_SIZE }, (_, c) => shape[r]?.[c] ?? 0)
  );

export const NextPiece = memo(({ next }: NextPieceProps) => {
  const grid = toPreviewGrid(next.shape);
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Next</span>
      <div
        className={styles.grid}
        style={{ '--size': PREVIEW_SIZE } as CSSProperties}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => <Cell key={`${r}-${c}`} type={cell} />)
        )}
      </div>
    </div>
  );
});
