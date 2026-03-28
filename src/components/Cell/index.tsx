import { memo, type CSSProperties } from 'react';
import { TETROMINOS } from '../../helpers/tetrominos';
import type { CellValue } from '../../types';
import styles from './Cell.module.css';

interface CellProps {
  type: CellValue;
}

export const Cell = memo(({ type }: CellProps) => {
  const color = TETROMINOS[type]?.color;
  return (
    <div
      className={type === 0 ? styles.empty : styles.filled}
      style={
        type !== 0
          ? ({
              '--cell-bg': `rgba(${color}, 0.88)`,
              '--cell-border': `rgba(${color}, 0.45)`,
            } as CSSProperties)
          : undefined
      }
    />
  );
});
