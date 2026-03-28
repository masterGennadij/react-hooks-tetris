import { useState, useCallback, type KeyboardEvent } from 'react';
import { createBoard, checkCollision } from '../../helpers/gameHelpers';
import { usePlayer } from '../../hooks/usePlayer';
import { useStage } from '../../hooks/useStage';
import { useInterval } from '../../hooks/useInterval';
import { useGameStatus } from '../../hooks/useGameStatus';
import { Stage } from '../Stage';
import { StartButton } from '../StartButton';
import { Display } from '../Display';
import { MobileControls } from '../MobileControls';
import styles from './Tetris.module.css';

type GameState = 'idle' | 'playing' | 'gameover';

export const Tetris = () => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [speed, setSpeed] = useState<number | null>(null);

  const [player, updatePlayerPosition, resetPlayer, rotatePlayer] = usePlayer();
  const [board, setBoard, rowsCleared] = useStage(player, resetPlayer);
  const { score, setScore, rows, setRows, level, setLevel } = useGameStatus(rowsCleared);

  const normalSpeed = useCallback((): number => 1000 / (level + 1) + 200, [level]);

  const movePlayer = (direction: number): void => {
    if (gameState !== 'playing') return;
    if (!checkCollision(player, board, { x: direction, y: 0 })) {
      updatePlayerPosition({ x: direction, y: 0 });
    }
  };

  const startGame = (): void => {
    setBoard(createBoard());
    setSpeed(1000);
    resetPlayer();
    setScore(0);
    setLevel(0);
    setRows(0);
    setGameState('playing');
  };

  const drop = (): void => {
    if (rows > (level + 1) * 10) {
      setLevel((prev) => prev + 1);
      setSpeed(normalSpeed());
    }
    if (!checkCollision(player, board, { x: 0, y: 1 })) {
      updatePlayerPosition({ x: 0, y: 1, isCollided: false });
    } else {
      if (player.position.y < 1) {
        setGameState('gameover');
        setSpeed(null);
      }
      updatePlayerPosition({ x: 0, y: 0, isCollided: true });
    }
  };

  const softDropStart = (): void => {
    if (gameState !== 'playing') return;
    setSpeed(50);
  };

  const softDropEnd = (): void => {
    if (gameState !== 'playing') return;
    setSpeed((prev) => (prev !== null ? normalSpeed() : null));
  };

  const keyUpHandler = (e: KeyboardEvent): void => {
    if (gameState === 'playing' && e.key === 'ArrowDown') softDropEnd();
  };

  const move = (e: KeyboardEvent): void => {
    if (gameState !== 'playing') return;
    if (e.key === 'ArrowLeft') movePlayer(-1);
    else if (e.key === 'ArrowRight') movePlayer(1);
    else if (e.key === 'ArrowDown') softDropStart();
    else if (e.key === 'ArrowUp') rotatePlayer(board, 1);
  };

  useInterval(drop, speed);

  return (
    <div
      className={styles.wrapper}
      onKeyUp={keyUpHandler}
      onKeyDown={move}
      tabIndex={0}
      role="region"
      aria-label="Tetris game"
    >
      <div className={styles.container}>
        <Stage board={board} />
        <aside className={styles.sidebar}>
          {gameState === 'gameover' ? (
            <Display isGameOver text="Game Over" />
          ) : (
            <div className={styles.stats}>
              <Display text={`Score: ${score}`} />
              <Display text={`Rows: ${rows}`} />
              <Display text={`Level: ${level}`} />
            </div>
          )}
          <StartButton onClick={startGame} />
        </aside>
      </div>
      <MobileControls
        onMoveLeft={() => movePlayer(-1)}
        onMoveRight={() => movePlayer(1)}
        onSoftDropStart={softDropStart}
        onSoftDropEnd={softDropEnd}
        onRotate={() => gameState === 'playing' && rotatePlayer(board, 1)}
      />
    </div>
  );
};
