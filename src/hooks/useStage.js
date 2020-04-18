import { useState, useEffect } from "react";
import { createStage } from "../helpers/gameHelpers";

const useStage = (player, resetPlayer) => {
  const [stage, setStage] = useState(createStage());
  const [rowsCleared, setRowsCleared] = useState(0);

  useEffect(() => {
    setRowsCleared(0);

    const sweepRows = (newStage) =>
      newStage.reduce((acc, row) => {
        if (!row.find((cell) => cell[0] === 0)) {
          setRowsCleared((prevState) => prevState + 1);
          acc.unshift(new Array(newStage[0].length).fill([0, "clear"]));
          return acc;
        }
        acc.push(row);
        return acc;
      }, []);

    const updateStage = (prevStage) => {
      const newStage = prevStage.map((row) =>
        row.map((cell) => (cell[1] === "clear" ? [0, "clear"] : cell))
      );

      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            newStage[y + player.position.y][x + player.position.x] = [
              value,
              `${player.isCollided ? "merged" : "clear"}`,
            ];
          }
        });
      });

      // Check if we collided

      if (player.isCollided) {
        resetPlayer();
        return sweepRows(newStage);
      }

      return newStage;
    };
    setStage((prevStage) => updateStage(prevStage));
  }, [player, resetPlayer]);

  return [stage, setStage, rowsCleared];
};

export default useStage;
