import styles from './Display.module.css';

interface DisplayProps {
  text: string;
  isGameOver?: boolean;
}

export const Display = ({ isGameOver, text }: DisplayProps) => (
  <div className={`${styles.display}${isGameOver ? ` ${styles.gameOver}` : ''}`}>
    {text}
  </div>
);
