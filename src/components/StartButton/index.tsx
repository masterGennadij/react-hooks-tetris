import styles from './StartButton.module.css';

interface StartButtonProps {
  onClick: () => void;
}

export const StartButton = ({ onClick }: StartButtonProps) => (
  <button className={styles.button} onClick={onClick}>
    Start Game
  </button>
);
