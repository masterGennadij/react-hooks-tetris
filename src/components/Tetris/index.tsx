import { useState, useCallback, useEffect, useRef, type KeyboardEvent } from 'react';
import { createBoard, checkCollision } from '../../helpers/gameHelpers';
import { loadSavedGame, saveGame, clearSavedGame, type SavedGame } from '../../helpers/storage';
import { usePlayer } from '../../hooks/usePlayer';
import { useStage } from '../../hooks/useStage';
import { useInterval } from '../../hooks/useInterval';
import { useGameStatus } from '../../hooks/useGameStatus';
import { Stage } from '../Stage';
import { StartButton } from '../StartButton';
import { Display } from '../Display';
import { MobileControls } from '../MobileControls';
import styles from './Tetris.module.css';

type GameState = 'idle' | 'playing' | 'paused' | 'gameover';

export const Tetris = () => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [speed, setSpeed] = useState<number | null>(null);
  const [savedGame, setSavedGame] = useState<SavedGame | null>(() => loadSavedGame());

  const [player, updatePlayerPosition, resetPlayer, rotatePlayer, restorePlayer] = usePlayer();
  const [board, setBoard, rowsCleared] = useStage(player, resetPlayer);
  const { score, setScore, rows, setRows, level, setLevel } = useGameStatus(rowsCleared);

  const normalSpeed = useCallback((): number => 1000 / (level + 1) + 200, [level]);

  // Show saved board as preview while the resume prompt is visible
  useEffect(() => {
    if (savedGame) setBoard(savedGame.board);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist latest values in a ref so the beforeunload handler never captures stale state
  const stateRef = useRef({ board, player, score, rows, level, gameState });
  useEffect(() => {
    stateRef.current = { board, player, score, rows, level, gameState };
  });

  // Save on page close / refresh
  useEffect(() => {
    const handle = () => {
      const { board, player, score, rows, level, gameState } = stateRef.current;
      if (gameState === 'playing' || gameState === 'paused') {
        saveGame({ board, player, score, rows, level });
      }
    };
    window.addEventListener('beforeunload', handle);
    return () => window.removeEventListener('beforeunload', handle);
  }, []);

  // Clear save when the game ends naturally
  useEffect(() => {
    if (gameState === 'gameover') clearSavedGame();
  }, [gameState]);

  const movePlayer = (direction: number): void => {
    if (gameState !== 'playing') return;
    if (!checkCollision(player, board, { x: direction, y: 0 })) {
      updatePlayerPosition({ x: direction, y: 0 });
    }
  };

  const startGame = (): void => {
    clearSavedGame();
    setSavedGame(null);
    setBoard(createBoard());
    setSpeed(1000);
    resetPlayer();
    setScore(0);
    setLevel(0);
    setRows(0);
    setGameState('playing');
  };

  const continueGame = (): void => {
    if (!savedGame) return;
    setScore(savedGame.score);
    setRows(savedGame.rows);
    setLevel(savedGame.level);
    setSpeed(1000 / (savedGame.level + 1) + 200);
    setBoard(savedGame.board);
    restorePlayer(savedGame.player);
    setGameState('paused');
    setSavedGame(null);
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

  const togglePause = (): void => {
    if (gameState === 'playing') {
      setGameState('paused');
      setSpeed(normalSpeed());
    } else if (gameState === 'paused') {
      setGameState('playing');
    }
  };

  const keyUpHandler = (e: KeyboardEvent): void => {
    if (gameState === 'playing' && e.key === 'ArrowDown') softDropEnd();
  };

  const move = (e: KeyboardEvent): void => {
    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
      if (gameState === 'playing' || gameState === 'paused') togglePause();
      return;
    }
    if (gameState !== 'playing') return;
    if (e.key === 'ArrowLeft') movePlayer(-1);
    else if (e.key === 'ArrowRight') movePlayer(1);
    else if (e.key === 'ArrowDown') softDropStart();
    else if (e.key === 'ArrowUp') rotatePlayer(board, 1);
  };

  useInterval(drop, gameState === 'playing' ? speed : null);

  const hasSavedGame = savedGame !== null && gameState === 'idle';

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
          ) : gameState === 'paused' ? (
            <Display text="Paused" />
          ) : hasSavedGame ? (
            <Display text={`Saved: ${savedGame.score} pts  Lv ${savedGame.level}`} />
          ) : (
            <div className={styles.stats}>
              <Display text={`Score: ${score}`} />
              <Display text={`Rows: ${rows}`} />
              <Display text={`Level: ${level}`} />
            </div>
          )}

          {hasSavedGame ? (
            <>
              <StartButton onClick={continueGame}>Continue</StartButton>
              <button className={styles.secondaryBtn} onClick={startGame}>New Game</button>
            </>
          ) : (
            <StartButton onClick={startGame} />
          )}
        </aside>
      </div>
      <MobileControls
        onMoveLeft={() => movePlayer(-1)}
        onMoveRight={() => movePlayer(1)}
        onSoftDropStart={softDropStart}
        onSoftDropEnd={softDropEnd}
        onRotate={() => gameState === 'playing' && rotatePlayer(board, 1)}
        onPause={togglePause}
      />
    </div>
  );
};
