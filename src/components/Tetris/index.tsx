import { useState, type KeyboardEvent } from 'react';
import { createStage, checkCollision } from '../../helpers/gameHelpers';
import usePlayer from '../../hooks/usePlayer';
import useStage from '../../hooks/useStage';
import useInterval from '../../hooks/useInterval';
import useGameStatus from '../../hooks/useGameStatus';
import StageComponent from '../Stage';
import StartButton from '../StartButton';
import Display from '../Display';
import MobileControls from '../MobileControls';
import { TetrisContainer, TetrisWrapper } from './style';

const Tetris = () => {
  const [speed, setSpeed] = useState<number | null>(null);
  const [isGameOver, setGameOver] = useState(false);

  const [player, updatePlayerPosition, resetPlayer, rotatePlayer] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

  const normalSpeed = (): number => 1000 / (level + 1) + 200;

  const movePlayer = (direction: number): void => {
    if (!checkCollision(player, stage, { x: direction, y: 0 })) {
      updatePlayerPosition({ x: direction, y: 0 });
    }
  };

  const startGame = (): void => {
    setStage(createStage());
    setSpeed(1000);
    resetPlayer();
    setScore(0);
    setLevel(0);
    setRows(0);
    setGameOver(false);
  };

  const drop = (): void => {
    if (rows > (level + 1) * 10) {
      setLevel((prev) => prev + 1);
      setSpeed(normalSpeed());
    }
    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPosition({ x: 0, y: 1, isCollided: false });
    } else {
      if (player.position.y < 1) {
        setGameOver(true);
        setSpeed(null);
      }
      updatePlayerPosition({ x: 0, y: 0, isCollided: true });
    }
  };

  const softDropStart = (): void => {
    if (isGameOver) return;
    setSpeed(50);
  };

  const softDropEnd = (): void => {
    if (isGameOver) return;
    setSpeed((prev) => (prev !== null ? normalSpeed() : null));
  };

  const keyUpHandler = (e: KeyboardEvent): void => {
    if (!isGameOver && e.key === 'ArrowDown') softDropEnd();
  };

  const move = (e: KeyboardEvent): void => {
    if (isGameOver) return;
    if (e.key === 'ArrowLeft') movePlayer(-1);
    else if (e.key === 'ArrowRight') movePlayer(1);
    else if (e.key === 'ArrowDown') softDropStart();
    else if (e.key === 'ArrowUp') rotatePlayer(stage, 1);
  };

  useInterval(drop, speed);

  return (
    <TetrisWrapper
      onKeyUp={keyUpHandler}
      onKeyDown={move}
      tabIndex={0}
      role="region"
      aria-label="Tetris game"
    >
      <TetrisContainer>
        <StageComponent stage={stage} />
        <aside>
          {isGameOver ? (
            <Display isGameOver text="Game Over" />
          ) : (
            <div>
              <Display text={`Score: ${score}`} />
              <Display text={`Rows: ${rows}`} />
              <Display text={`Level: ${level}`} />
            </div>
          )}
          <StartButton onClick={startGame} />
        </aside>
      </TetrisContainer>
      <MobileControls
        onMoveLeft={() => movePlayer(-1)}
        onMoveRight={() => movePlayer(1)}
        onSoftDropStart={softDropStart}
        onSoftDropEnd={softDropEnd}
        onRotate={() => rotatePlayer(stage, 1)}
      />
    </TetrisWrapper>
  );
};

export default Tetris;
