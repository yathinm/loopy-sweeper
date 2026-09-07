import type { Position } from './types';

export function getNeighbors(
  position: Position,
  rows: number,
  columns: number,
): Position[] {
  const neighbors: Position[] = [];

  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
      if (rowOffset === 0 && columnOffset === 0) continue;

      const row = position.row + rowOffset;
      const column = position.column + columnOffset;
      if (row >= 0 && row < rows && column >= 0 && column < columns) {
        neighbors.push({ row, column });
      }
    }
  }

  return neighbors;
}

export const positionKey = ({ row, column }: Position) => `${row}:${column}`;
