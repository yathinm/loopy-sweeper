import { getNeighbors, positionKey } from './neighbors';
import type { Board, DifficultyConfig, Position } from './types';

export function createEmptyBoard(rows: number, columns: number): Board {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: columns }, (_, column) => ({
      row,
      column,
      hasMine: false,
      adjacentMines: 0,
      isRevealed: false,
      isFlagged: false,
    })),
  );
}

export function createBoard(
  config: Pick<DifficultyConfig, 'rows' | 'columns' | 'mines'>,
  safePositions: Position[],
  random: () => number = Math.random,
): Board {
  const safeKeys = new Set(safePositions.map(positionKey));
  const eligible: Position[] = [];

  for (let row = 0; row < config.rows; row += 1) {
    for (let column = 0; column < config.columns; column += 1) {
      const position = { row, column };
      if (!safeKeys.has(positionKey(position))) eligible.push(position);
    }
  }

  if (config.mines > eligible.length) {
    throw new Error('Mine count exceeds the available cells.');
  }

  for (let index = eligible.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [eligible[index], eligible[swapIndex]] = [
      eligible[swapIndex],
      eligible[index],
    ];
  }

  const mineKeys = new Set(eligible.slice(0, config.mines).map(positionKey));
  const board = createEmptyBoard(config.rows, config.columns);

  return board.map((boardRow) =>
    boardRow.map((cell) => {
      const hasMine = mineKeys.has(positionKey(cell));
      const adjacentMines = hasMine
        ? 0
        : getNeighbors(cell, config.rows, config.columns).filter((neighbor) =>
            mineKeys.has(positionKey(neighbor)),
          ).length;
      return { ...cell, hasMine, adjacentMines };
    }),
  );
}

export function getSafeOpening(
  position: Position,
  rows: number,
  columns: number,
  mines: number,
): Position[] {
  const preferred = [position, ...getNeighbors(position, rows, columns)];
  return rows * columns - preferred.length >= mines ? preferred : [position];
}
