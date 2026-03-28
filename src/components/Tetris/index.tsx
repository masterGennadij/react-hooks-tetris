import { useCallback, useEffect, useRef, type KeyboardEvent } from 'react';
import { createBoard, checkCollision } from '../../helpers/gameHelpers';
import { saveGame, clearSavedGame } from '../../helpers/storage';
import { usePlayer } from '../../hooks/usePlayer';
import { useStage } from '../../hooks/useStage';
import { useInterval } from '../../hooks/useInterval';
import { useGameReducer } from '../../hooks/useGameReducer';
import { Stage } from '../Stage';
import { StartButton } from '../StartButton';
import { Display } from '../Display';
import { MobileControls } from '../MobileControls';
import styles from './Tetris.module.css';

export const Tetris = () => {
  const [state, dispatch] = useGameReducer();
  const { phase, speed, savedGame, score, rows, level } = state;

  const { player, updatePlayerPosition, resetPlayer, rotatePlayer, restorePlayer, moveHorizontal } =
    usePlayer();
  const [board, setBoard, rowsCleared] = useStage(player, resetPlayer);

  // Score / level update driven by cleared rows
  const dispatchRef = useRef(dispatch);
  useEffect(() => { dispatchRef.current = dispatch; });

  useEffect(() => {
    if (rowsCleared > 0) dispatchRef.current({ type: 'ROWS_CLEARED', count: rowsCleared });
  }, [rowsCleared]);

  // Persist latest values via ref so beforeunload never captures stale state
  const stateRef = useRef({ board, player, score, rows, level, phase });
  useEffect(() => {
    stateRef.current = { board, player, score, rows, level, phase };
  });

  // Save on page close / refresh
  useEffect(() => {
    const handle = () => {
      const { board, player, score, rows, level, phase } = stateRef.current;
      if (phase === 'playing' || phase === 'paused') {
        saveGame({ board, player, score, rows, level });
      }
    };
    window.addEventListener('beforeunload', handle);
    return () => window.removeEventListener('beforeunload', handle);
  }, []);

  // Clear save when game ends
  useEffect(() => {
    if (phase === 'gameover') clearSavedGame();
  }, [phase]);

  // Auto-pause when tab is hidden or window loses focus
  useEffect(() => {
    const pauseIfPlaying = () => {
      if (stateRef.current.phase === 'playing') dispatchRef.current({ type: 'PAUSE' });
    };
    const onVisibilityChange = () => { if (document.hidden) pauseIfPlaying(); };
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', pauseIfPlaying);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', pauseIfPlaying);
    };
  }, []);

  // Show saved board as preview while resume prompt is visible
  useEffect(() => {
    if (savedGame) setBoard(savedGame.board);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── game actions ─────────────────────────────────────────────────────────
  const startGame = useCallback((): void => {
    clearSavedGame();
    setBoard(createBoard());
    resetPlayer();
    dispatch({ type: 'START' });
  }, [resetPlayer, setBoard, dispatch]);

  const continueGame = useCallback((): void => {
    if (!savedGame) return;
    setBoard(savedGame.board);
    restorePlayer(savedGame.player);
    dispatch({ type: 'CONTINUE', saved: savedGame });
  }, [savedGame, setBoard, restorePlayer, dispatch]);

  const drop = useCallback((): void => {
    if (!checkCollision(player, board, { x: 0, y: 1 })) {
      updatePlayerPosition({ x: 0, y: 1, isCollided: false });
    } else {
      if (player.position.y < 1) dispatch({ type: 'GAME_OVER' });
      updatePlayerPosition({ x: 0, y: 0, isCollided: true });
    }
  }, [player, board, updatePlayerPosition, dispatch]);

  const softDropStart = useCallback((): void => { dispatch({ type: 'SOFT_DROP' }); }, [dispatch]);
  const softDropEnd = useCallback((): void => { dispatch({ type: 'SOFT_DROP_CANCEL' }); }, [dispatch]);

  const togglePause = useCallback((): void => {
    dispatch({ type: phase === 'paused' ? 'RESUME' : 'PAUSE' });
  }, [phase, dispatch]);

  const keyUpHandler = (e: KeyboardEvent): void => {
    if (phase === 'playing' && e.key === 'ArrowDown') softDropEnd();
  };

  const move = (e: KeyboardEvent): void => {
    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
      if (phase === 'playing' || phase === 'paused') togglePause();
      return;
    }
    if (phase !== 'playing') return;
    if (e.key === 'ArrowLeft') moveHorizontal(board, -1);
    else if (e.key === 'ArrowRight') moveHorizontal(board, 1);
    else if (e.key === 'ArrowDown') softDropStart();
    else if (e.key === 'ArrowUp') rotatePlayer(board, 1);
  };

  useInterval(drop, phase === 'playing' ? speed : null);

  const hasSavedGame = savedGame !== null && phase === 'idle';

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
          {phase === 'gameover' ? (
            <Display isGameOver text="Game Over" />
          ) : phase === 'paused' ? (
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
        onMoveLeft={() => moveHorizontal(board, -1)}
        onMoveRight={() => moveHorizontal(board, 1)}
        onSoftDropStart={softDropStart}
        onSoftDropEnd={softDropEnd}
        onRotate={() => phase === 'playing' && rotatePlayer(board, 1)}
        onPause={togglePause}
      />
    </div>
  );
};
