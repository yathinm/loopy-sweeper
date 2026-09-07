import { describe, expect, it } from 'vitest';
import { createBoard, createEmptyBoard, getSafeOpening } from './createBoard';
import { DIFFICULTIES } from './difficulties';
import { positionKey } from './neighbors';

describe('createBoard', () => {
  it.each(Object.values(DIFFICULTIES))(
    'creates a $rows x $columns board with exactly $mines mines',
    (config) => {
      const board = createBoard(config, [{ row: 0, column: 0 }], () => 0.42);
      expect(board).toHaveLength(config.rows);
      expect(board.every((row) => row.length === config.columns)).toBe(true);
      expect(board.flat().filter((cell) => cell.hasMine)).toHaveLength(
        config.mines,
      );
      expect(board[0][0].hasMine).toBe(false);
    },
  );

  it('protects the complete opening around the first reveal', () => {
    const config = DIFFICULTIES.beginner;
    const safe = getSafeOpening(
      { row: 4, column: 4 },
      config.rows,
      config.columns,
      config.mines,
    );
    const safeKeys = new Set(safe.map(positionKey));
    const board = createBoard(config, safe, () => 0);
    expect(safe).toHaveLength(9);
    expect(
      board
        .flat()
        .filter((cell) => safeKeys.has(positionKey(cell)))
        .every((cell) => !cell.hasMine),
    ).toBe(true);
  });

  it('calculates adjacency at corners, edges, and centers', () => {
    const board = createBoard(
      { rows: 3, columns: 3, mines: 1 },
      [{ row: 2, column: 2 }],
      () => 0,
    );
    const mine = board.flat().find((cell) => cell.hasMine)!;
    const neighbors = board
      .flat()
      .filter(
        (cell) =>
          Math.abs(cell.row - mine.row) <= 1 &&
          Math.abs(cell.column - mine.column) <= 1 &&
          !cell.hasMine,
      );
    expect(neighbors.every((cell) => cell.adjacentMines === 1)).toBe(true);
  });
});

describe('createEmptyBoard', () => {
  it('creates covered, safe cells', () => {
    expect(createEmptyBoard(2, 2).flat()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          hasMine: false,
          isRevealed: false,
          isFlagged: false,
        }),
      ]),
    );
  });
});
