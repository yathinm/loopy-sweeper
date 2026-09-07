import { getNeighbors, positionKey } from './neighbors';
import type { Board, Position } from './types';

export function revealCells(board: Board, start: Position): Board {
  const startCell = board[start.row]?.[start.column];
  if (!startCell || startCell.isFlagged || startCell.isRevealed) return board;

  const next = board.map((row) => row.map((cell) => ({ ...cell })));
  const queue: Position[] = [start];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const position = queue.shift()!;
    const key = positionKey(position);
    if (visited.has(key)) continue;
    visited.add(key);

    const cell = next[position.row][position.column];
    if (cell.isFlagged || cell.isRevealed) continue;
    cell.isRevealed = true;

    if (!cell.hasMine && cell.adjacentMines === 0) {
      for (const neighbor of getNeighbors(
        position,
        next.length,
        next[0].length,
      )) {
        const neighborCell = next[neighbor.row][neighbor.column];
        if (
          !neighborCell.hasMine &&
          !neighborCell.isFlagged &&
          !neighborCell.isRevealed
        ) {
          queue.push(neighbor);
        }
      }
    }
  }

  return next;
}

export function revealAllMines(board: Board): Board {
  return board.map((row) =>
    row.map((cell) =>
      cell.hasMine ? { ...cell, isRevealed: true } : { ...cell },
    ),
  );
}
