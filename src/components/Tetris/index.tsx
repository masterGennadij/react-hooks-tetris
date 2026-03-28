import { useCallback, useEffect, useRef } from 'react';
import { createBoard, checkCollision } from '../../helpers/gameHelpers';
import { saveGame, clearSavedGame } from '../../helpers/storage';
import { sounds } from '../../helpers/audio';
import { usePlayer } from '../../hooks/usePlayer';
import { useStage } from '../../hooks/useStage';
import { useInterval } from '../../hooks/useInterval';
import { useGameReducer } from '../../hooks/useGameReducer';
import { useHardDrop } from '../../hooks/useHardDrop';
import { useKeyboard } from '../../hooks/useKeyboard';
import { Stage } from '../Stage';
import { StartButton } from '../StartButton';
import { Display } from '../Display';
import { MobileControls } from '../MobileControls';
import { NextPiece } from '../NextPiece';
import styles from './Tetris.module.css';

export const Tetris = () => {
  const [state, dispatch] = useGameReducer();
  const { phase, speed, savedGame, score, rows, level, muted } = state;

  const { player, nextPiece, updatePlayerPosition, resetPlayer, rotatePlayer, restorePlayer, moveHorizontal } =
    usePlayer();
  const [board, setBoard, rowsCleared] = useStage(player, resetPlayer);

  // Score / level update driven by cleared rows
  const dispatchRef = useRef(dispatch);
  useEffect(() => { dispatchRef.current = dispatch; });

  const prevLevelRef = useRef(level);
  useEffect(() => {
    if (rowsCleared > 0) {
      dispatchRef.current({ type: 'ROWS_CLEARED', count: rowsCleared });
      if (!muted) sounds.lineClear();
    }
  }, [rowsCleared]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (level > prevLevelRef.current && !muted) sounds.levelUp();
    prevLevelRef.current = level;
  }, [level, muted]);

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
    if (phase === 'gameover') {
      clearSavedGame();
      if (!muted) sounds.gameOver();
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const softDropStart = useCallback((): void => {
    dispatch({ type: 'SOFT_DROP' });
    if (!muted) sounds.softDrop();
  }, [dispatch, muted]);

  const softDropEnd = useCallback((): void => { dispatch({ type: 'SOFT_DROP_CANCEL' }); }, [dispatch]);

  const togglePause = useCallback((): void => {
    dispatch({ type: phase === 'paused' ? 'RESUME' : 'PAUSE' });
  }, [phase, dispatch]);

  const hardDrop = useHardDrop(player, board, updatePlayerPosition);
  const hardDropWithSound = useCallback((): void => {
    if (phase !== 'playing') return;
    hardDrop();
    if (!muted) sounds.hardDrop();
  }, [phase, hardDrop, muted]);

  const rotatePiece = useCallback((): void => {
    if (phase !== 'playing') return;
    rotatePlayer(board, 1);
    if (!muted) sounds.rotate();
  }, [phase, board, rotatePlayer, muted]);

  const movePiece = useCallback((direction: number): void => {
    moveHorizontal(board, direction);
    if (!muted) sounds.move();
  }, [board, moveHorizontal, muted]);

  const { onKeyDown, onKeyUp } = useKeyboard({
    phase,
    moveLeft: () => movePiece(-1),
    moveRight: () => movePiece(1),
    softDropStart,
    softDropEnd,
    hardDrop: hardDropWithSound,
    rotate: rotatePiece,
    togglePause,
  });

  useInterval(drop, phase === 'playing' ? speed : null);

  const hasSavedGame = savedGame !== null && phase === 'idle';

  return (
    <div
      className={styles.wrapper}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
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

          {phase === 'playing' || phase === 'paused' ? (
            <NextPiece next={nextPiece} />
          ) : null}

          {hasSavedGame ? (
            <>
              <StartButton onClick={continueGame}>Continue</StartButton>
              <button className={styles.secondaryBtn} onClick={startGame}>New Game</button>
            </>
          ) : (
            <StartButton onClick={startGame} />
          )}

          <button
            className={styles.secondaryBtn}
            onClick={() => dispatch({ type: 'TOGGLE_MUTE' })}
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? '🔇 Muted' : '🔊 Sound'}
          </button>
        </aside>
      </div>
      <MobileControls
        onMoveLeft={() => movePiece(-1)}
        onMoveRight={() => movePiece(1)}
        onSoftDropStart={softDropStart}
        onSoftDropEnd={softDropEnd}
        onRotate={rotatePiece}
        onHardDrop={hardDropWithSound}
        onPause={togglePause}
      />
    </div>
  );
};
