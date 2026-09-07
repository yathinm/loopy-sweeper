import type { Board, GameStatus } from './types';

export function checkGameState(board: Board): GameStatus {
  if (
    board.some((row) => row.some((cell) => cell.hasMine && cell.isRevealed))
  ) {
    return 'lost';
  }

  const hasCoveredSafeCell = board.some((row) =>
    row.some((cell) => !cell.hasMine && !cell.isRevealed),
  );

  return hasCoveredSafeCell ? 'playing' : 'won';
}
