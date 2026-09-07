import { describe, expect, it } from 'vitest';
import { createEmptyBoard } from './createBoard';
import { revealCells } from './revealCells';
import { toggleFlag } from './toggleFlag';

describe('revealCells', () => {
  it('reveals connected empty cells and their numbered boundary', () => {
    const board = createEmptyBoard(3, 3);
    board[0][0] = { ...board[0][0], hasMine: true };
    board[0][1] = { ...board[0][1], adjacentMines: 1 };
    board[1][0] = { ...board[1][0], adjacentMines: 1 };
    board[1][1] = { ...board[1][1], adjacentMines: 1 };
    const result = revealCells(board, { row: 2, column: 2 });
    expect(result.flat().filter((cell) => cell.isRevealed)).toHaveLength(8);
    expect(result[0][0].isRevealed).toBe(false);
    expect(board[2][2].isRevealed).toBe(false);
  });

  it('does not reveal a flagged cell', () => {
    const board = toggleFlag(createEmptyBoard(2, 2), { row: 0, column: 0 });
    expect(revealCells(board, { row: 0, column: 0 })).toBe(board);
  });
});

describe('toggleFlag', () => {
  it('toggles covered cells without mutating the input', () => {
    const board = createEmptyBoard(2, 2);
    const flagged = toggleFlag(board, { row: 0, column: 0 });
    expect(flagged[0][0].isFlagged).toBe(true);
    expect(board[0][0].isFlagged).toBe(false);
    expect(toggleFlag(flagged, { row: 0, column: 0 })[0][0].isFlagged).toBe(
      false,
    );
  });

  it('ignores revealed cells', () => {
    const board = createEmptyBoard(1, 1);
    board[0][0].isRevealed = true;
    expect(toggleFlag(board, { row: 0, column: 0 })).toBe(board);
  });
});
