import { type CSSProperties } from 'react';
import { Cell } from '../Cell';
import type { Stage } from '../../types';
import styles from './Stage.module.css';

interface StageProps {
  stage: Stage;
}

export const StageComponent = ({ stage }: StageProps) => (
  <div
    className={styles.stage}
    style={
      {
        '--cols': stage[0]?.length,
        '--rows': stage.length,
      } as CSSProperties
    }
  >
    {stage.map((row) =>
      row.map(([type], index) => <Cell key={index} type={type} />)
    )}
  </div>
);
