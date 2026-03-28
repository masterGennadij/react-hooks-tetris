import { type CSSProperties } from 'react';
import { Cell } from '../Cell';
import type { Board } from '../../types';
import styles from './Stage.module.css';

interface StageProps {
  board: Board;
}

export const Stage = ({ board }: StageProps) => (
  <div
    className={styles.stage}
    style={
      {
        '--cols': board[0]?.length,
        '--rows': board.length,
      } as CSSProperties
    }
  >
    {board.map((row) =>
      row.map(([type], index) => <Cell key={index} type={type} />)
    )}
  </div>
);
