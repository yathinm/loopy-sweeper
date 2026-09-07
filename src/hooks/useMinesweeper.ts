import { useCallback, useEffect, useMemo, useState } from 'react';
import { checkGameState } from '../game/checkGameState';
import {
  createBoard,
  createEmptyBoard,
  getSafeOpening,
} from '../game/createBoard';
import { DIFFICULTIES } from '../game/difficulties';
import { revealAllMines, revealCells } from '../game/revealCells';
import { toggleFlag as toggleBoardFlag } from '../game/toggleFlag';
import type { Board, Difficulty, GameStatus, Position } from '../game/types';
import {
  loadBestTimes,
  loadPreferences,
  saveBestTimes,
  savePreferences,
  type BestTimes,
} from '../storage/preferences';
import { useGameTimer } from './useGameTimer';

export function useMinesweeper() {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [board, setBoard] = useState<Board>(() => createEmptyBoard(9, 9));
  const [status, setStatus] = useState<GameStatus>('ready');
  const [gameId, setGameId] = useState(0);
  const [explodedCell, setExplodedCell] = useState<Position | null>(null);
  const [bestTimes, setBestTimes] = useState<BestTimes>({});
  const [isNewBest, setIsNewBest] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const elapsedSeconds = useGameTimer(status, gameId);
  const config = DIFFICULTIES[difficulty];

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const storedDifficulty = loadPreferences().difficulty;
      setDifficulty(storedDifficulty);
      const storedConfig = DIFFICULTIES[storedDifficulty];
      setBoard(createEmptyBoard(storedConfig.rows, storedConfig.columns));
      setBestTimes(loadBestTimes());
      setHydrated(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const restart = useCallback(
    (nextDifficulty: Difficulty = difficulty) => {
      const nextConfig = DIFFICULTIES[nextDifficulty];
      setDifficulty(nextDifficulty);
      setBoard(createEmptyBoard(nextConfig.rows, nextConfig.columns));
      setStatus('ready');
      setExplodedCell(null);
      setIsNewBest(false);
      setGameId((id) => id + 1);
      savePreferences({ difficulty: nextDifficulty });
    },
    [difficulty],
  );

  const reveal = useCallback(
    (position: Position) => {
      if (status === 'won' || status === 'lost') return;
      const currentCell = board[position.row]?.[position.column];
      if (!currentCell || currentCell.isFlagged || currentCell.isRevealed)
        return;

      const populatedBoard =
        status === 'ready'
          ? createBoard(
              config,
              getSafeOpening(
                position,
                config.rows,
                config.columns,
                config.mines,
              ),
            ).map((row, rowIndex) =>
              row.map((cell, columnIndex) => ({
                ...cell,
                isFlagged: board[rowIndex][columnIndex].isFlagged,
              })),
            )
          : board;
      const revealedBoard = revealCells(populatedBoard, position);
      const nextStatus = checkGameState(revealedBoard);

      if (nextStatus === 'lost') {
        setExplodedCell(position);
        setBoard(revealAllMines(revealedBoard));
      } else {
        setBoard(revealedBoard);
      }
      if (nextStatus === 'won') {
        const currentBest = bestTimes[difficulty];
        if (currentBest === undefined || elapsedSeconds < currentBest) {
          const nextBest = { ...bestTimes, [difficulty]: elapsedSeconds };
          setBestTimes(nextBest);
          saveBestTimes(nextBest);
          setIsNewBest(true);
        }
      }
      setStatus(nextStatus);
    },
    [bestTimes, board, config, difficulty, elapsedSeconds, status],
  );

  const toggleFlag = useCallback(
    (position: Position) => {
      if (status === 'won' || status === 'lost') return;
      setBoard((currentBoard) => toggleBoardFlag(currentBoard, position));
    },
    [status],
  );

  const flagCount = useMemo(
    () =>
      board.reduce(
        (total, row) => total + row.filter((cell) => cell.isFlagged).length,
        0,
      ),
    [board],
  );

  return {
    board,
    difficulty,
    config,
    status,
    elapsedSeconds,
    remainingMines: config.mines - flagCount,
    explodedCell,
    bestTime: bestTimes[difficulty],
    isNewBest,
    hydrated,
    reveal,
    toggleFlag,
    restart,
    changeDifficulty: restart,
  };
}
