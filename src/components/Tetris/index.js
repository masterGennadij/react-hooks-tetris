import React, { useState } from "react";
import PropTypes from "prop-types";

// Helpers
import { createStage, checkCollision } from "../../helpers/gameHelpers";

// Hooks
import usePlayer from "../../hooks/usePlayer";
import useStage from "../../hooks/useStage";
import useInterval from "../../hooks/useInterval";
import useGameStatus from "../../hooks/useGameStatus";

// Components
import Stage from "../Stage";
import StartButton from "../StartButton";
import Display from "../Display";

// Styles
import { TetrisContainer, TetrisWrapper } from "./style";

const Tetris = () => {
  const [speed, setSpeed] = useState(null);
  const [isGameOver, setGameOver] = useState(false);

  const [player, updatePlayerPosition, resetPlayer, rotatePlayer] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(
    rowsCleared
  );

  console.log("rerender");

  const movePlayer = (direction) => {
    if (!checkCollision(player, stage, { x: direction, y: 0 })) {
      updatePlayerPosition({ x: direction, y: 0 });
    }
  };

  const startGame = () => {
    setStage(createStage());
    setSpeed(1000);
    resetPlayer();
    setScore(0);
    setLevel(0);
    setRows(0);
    setGameOver(false);
  };

  const drop = () => {
    if (rows > (level + 1) * 10) {
      setLevel((prevLevel) => prevLevel + 1);
      setSpeed(1000 / (level + 1) + 200);
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

  const dropPlayer = () => {
    setSpeed(null);
    drop();
  };

  const keyUpHandler = ({ keyCode }) => {
    if (!isGameOver) {
      if (keyCode === 40) {
        setSpeed(1000 / (level + 1) + 200);
      }
    }
  };

  const move = ({ keyCode }) => {
    if (isGameOver) return;

    if (keyCode === 37) {
      movePlayer(-1);
    } else if (keyCode === 39) {
      movePlayer(1);
    } else if (keyCode === 40) {
      dropPlayer();
    } else if (keyCode === 38) {
      rotatePlayer(stage, 1);
    }
  };

  useInterval(() => {
    drop();
  }, speed);

  return (
    <TetrisWrapper
      onKeyUp={keyUpHandler}
      onKeyDown={(event) => move(event)}
      tabindex="0"
      role="button"
    >
      <TetrisContainer>
        <Stage stage={stage} />
        <aside>
          {isGameOver ? (
            <Display text="Game over" isGameOver={isGameOver} />
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
    </TetrisWrapper>
  );
};

Tetris.propTypes = {};

export default Tetris;
