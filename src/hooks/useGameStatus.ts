import { useCallback, useState, useEffect, type Dispatch, type SetStateAction } from 'react';

const LINE_POINTS = [40, 100, 300, 1200] as const;

interface GameStatus {
  score: number;
  rows: number;
  level: number;
  setScore: Dispatch<SetStateAction<number>>;
  setRows: Dispatch<SetStateAction<number>>;
  setLevel: Dispatch<SetStateAction<number>>;
}

export const useGameStatus = (rowsCleared: number): GameStatus => {
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(0);

  const calculateScore = useCallback(() => {
    if (rowsCleared > 0) {
      setScore((prev) => prev + LINE_POINTS[rowsCleared - 1] * (level + 1));
      setRows((prev) => prev + rowsCleared);
    }
  }, [level, rowsCleared]);

  useEffect(() => {
    calculateScore();
  }, [calculateScore]);

  return { score, setScore, rows, setRows, level, setLevel };
};
