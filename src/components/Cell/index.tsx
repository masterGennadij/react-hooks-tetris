import { memo, type CSSProperties } from 'react';
import { CELL_STYLES } from '../../helpers/tetrominos';
import type { CellValue } from '../../types';
import styles from './Cell.module.css';

interface CellProps {
  type: CellValue;
}

export const Cell = memo(({ type }: CellProps) => (
  <div
    className={type === 0 ? styles.empty : styles.filled}
    style={type !== 0 ? (CELL_STYLES[type] as CSSProperties) : undefined}
  />
));
