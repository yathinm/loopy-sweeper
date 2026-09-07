import type { Board, Position } from './types';

export function toggleFlag(board: Board, position: Position): Board {
  const cell = board[position.row]?.[position.column];
  if (!cell || cell.isRevealed) return board;

  return board.map((row, rowIndex) =>
    row.map((current, columnIndex) =>
      rowIndex === position.row && columnIndex === position.column
        ? { ...current, isFlagged: !current.isFlagged }
        : current,
    ),
  );
}
