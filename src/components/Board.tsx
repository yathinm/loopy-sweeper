'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Board as BoardData, Position } from '../game/types';
import { Cell } from './Cell';

interface BoardProps {
  board: BoardData;
  explodedCell: Position | null;
  locked: boolean;
  onReveal: (position: Position) => void;
  onFlag: (position: Position) => void;
}

export function Board({
  board,
  explodedCell,
  locked,
  onReveal,
  onFlag,
}: BoardProps) {
  const [focused, setFocused] = useState<Position>({ row: 0, column: 0 });
  const rows = board.length;
  const columns = board[0]?.length ?? 0;

  const navigate = (position: Position, key: string) => {
    let row = position.row;
    let column = position.column;
    if (key === 'ArrowUp') row = Math.max(0, row - 1);
    if (key === 'ArrowDown') row = Math.min(rows - 1, row + 1);
    if (key === 'ArrowLeft') column = Math.max(0, column - 1);
    if (key === 'ArrowRight') column = Math.min(columns - 1, column + 1);
    if (key === 'Home') column = 0;
    if (key === 'End') column = columns - 1;
    setFocused({ row, column });
    document
      .querySelector<HTMLButtonElement>(
        `[data-cell="${row}-${column}"] .mine-cell`,
      )
      ?.focus();
  };

  return (
    <div className="board-scroll" aria-label="Minesweeper board area">
      <div
        className="mine-board"
        role="grid"
        aria-label={`${rows} by ${columns} Minesweeper board`}
        aria-rowcount={rows}
        aria-colcount={columns}
        aria-disabled={locked}
        style={{ '--columns': columns } as CSSProperties}
      >
        {board.flatMap((row) =>
          row.map((cell) => (
            <div
              key={`${cell.row}-${cell.column}`}
              data-cell={`${cell.row}-${cell.column}`}
              className="grid-cell"
            >
              <Cell
                cell={cell}
                isExploded={
                  explodedCell?.row === cell.row &&
                  explodedCell.column === cell.column
                }
                tabIndex={
                  focused.row === cell.row && focused.column === cell.column
                    ? 0
                    : -1
                }
                onReveal={onReveal}
                onFlag={onFlag}
                onFocus={setFocused}
                onNavigate={navigate}
              />
            </div>
          )),
        )}
      </div>
    </div>
  );
}
