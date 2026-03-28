import { memo, type CSSProperties } from 'react';
import { CELL_STYLES } from '../../helpers/tetrominos';
import type { CellStatus, CellValue } from '../../types';
import styles from './Cell.module.css';

interface CellProps {
  type: CellValue;
  status?: CellStatus;
}

export const Cell = memo(({ type, status }: CellProps) => {
  const isGhost = status === 'ghost';
  return (
    <div
      className={type === 0 ? styles.empty : isGhost ? styles.ghost : styles.filled}
      style={type !== 0 ? (CELL_STYLES[type] as CSSProperties) : undefined}
    />
  );
});
