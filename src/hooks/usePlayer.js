import { useState, useCallback } from "react";
import { getRandomTetromino, TETROMINOS } from "../helpers/tetrominos";
import { STAGE_WIDTH, checkCollision } from "../helpers/gameHelpers";

const usePlayer = () => {
  const [player, setPlayer] = useState({
    position: { x: 0, y: 0 },
    tetromino: TETROMINOS[0].shape,
    isCollided: false,
  });

  const updatePlayerPosition = ({ x, y, isCollided }) => {
    setPlayer((prevPlayer) => ({
      ...prevPlayer,
      position: { x: prevPlayer.position.x + x, y: prevPlayer.position.y + y },
      isCollided,
    }));
  };

  const resetPlayer = useCallback(() => {
    setPlayer({
      position: { x: STAGE_WIDTH / 2 - 2, y: 0 },
      tetromino: getRandomTetromino().shape,
      isCollided: false,
    });
  }, []);

  const rotate = (tetromino, direction) => {
    // Make rows to become coumns
    const rotatedTetromino = tetromino.map((_, index) =>
      tetromino.map((row) => row[index])
    );
    if (direction > 0) {
      return rotatedTetromino.map((row) => row.reverse());
    } else {
      return rotatedTetromino.reverse();
    }
  };

  const rotatePlayer = (stage, direction) => {
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, direction);

    const position = clonedPlayer.position.x;
    let offset = 1;
    while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      clonedPlayer.position.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino[0].length) {
        rotate(clonedPlayer.tetromino, -direction);
        clonedPlayer.position = position;
        return;
      }
    }

    setPlayer(clonedPlayer);
  };

  return [player, updatePlayerPosition, resetPlayer, rotatePlayer];
};

export default usePlayer;
