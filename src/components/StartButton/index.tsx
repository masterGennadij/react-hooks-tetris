import type { ReactNode } from 'react';
import styles from './StartButton.module.css';

interface StartButtonProps {
  onClick: () => void;
  children?: ReactNode;
}

export const StartButton = ({ onClick, children = 'Start Game' }: StartButtonProps) => (
  <button className={styles.button} onClick={onClick}>
    {children}
  </button>
);
