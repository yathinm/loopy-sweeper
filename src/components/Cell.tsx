'use client';

import { Bomb, Flag } from 'lucide-react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { useLongPress } from '../hooks/useLongPress';
import type { Cell as CellData, Position } from '../game/types';

interface CellProps {
  cell: CellData;
  isExploded: boolean;
  tabIndex: number;
  onReveal: (position: Position) => void;
  onFlag: (position: Position) => void;
  onFocus: (position: Position) => void;
  onNavigate: (position: Position, key: string) => void;
}

function getCellLabel(cell: CellData, isExploded: boolean) {
  const position = `Row ${cell.row + 1}, column ${cell.column + 1}`;
  if (isExploded) return `${position}, exploded mine`;
  if (cell.isFlagged && cell.isRevealed && !cell.hasMine)
    return `${position}, incorrect flag`;
  if (cell.isFlagged) return `${position}, flagged`;
  if (!cell.isRevealed) return `${position}, covered`;
  if (cell.hasMine) return `${position}, mine`;
  if (cell.adjacentMines === 0) return `${position}, revealed, empty`;
  return `${position}, revealed, ${cell.adjacentMines} adjacent mines`;
}

export function Cell({
  cell,
  isExploded,
  tabIndex,
  onReveal,
  onFlag,
  onFocus,
  onNavigate,
}: CellProps) {
  const position = { row: cell.row, column: cell.column };
  const longPress = useLongPress({
    onPress: () => onReveal(position),
    onLongPress: () => onFlag(position),
  });

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse' && event.button === 0) onReveal(position);
    longPress.onPointerUp(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onReveal(position);
      return;
    }
    if (event.key.toLowerCase() === 'f') {
      event.preventDefault();
      onFlag(position);
      return;
    }
    if (
      [
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'Home',
        'End',
      ].includes(event.key)
    ) {
      event.preventDefault();
      onNavigate(position, event.key);
    }
  };

  const state = isExploded
    ? 'exploded'
    : cell.isRevealed
      ? cell.hasMine
        ? 'mine'
        : 'revealed'
      : cell.isFlagged
        ? 'flagged'
        : 'covered';

  return (
    <button
      type="button"
      className="mine-cell"
      data-state={state}
      data-number={
        cell.isRevealed && !cell.hasMine ? cell.adjacentMines : undefined
      }
      aria-label={getCellLabel(cell, isExploded)}
      aria-pressed={cell.isFlagged}
      tabIndex={tabIndex}
      onFocus={() => onFocus(position)}
      onContextMenu={(event) => {
        event.preventDefault();
        onFlag(position);
      }}
      onPointerDown={longPress.onPointerDown}
      onPointerMove={longPress.onPointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={longPress.onPointerCancel}
      onKeyDown={handleKeyDown}
    >
      {cell.isFlagged && !cell.isRevealed ? (
        <Flag
          className="cell-icon flag-icon"
          aria-hidden="true"
          fill="currentColor"
        />
      ) : null}
      {cell.isRevealed && cell.hasMine ? (
        <Bomb
          className="cell-icon mine-icon"
          aria-hidden="true"
          fill="currentColor"
        />
      ) : null}
      {cell.isRevealed && !cell.hasMine && cell.adjacentMines > 0 ? (
        <span aria-hidden="true">{cell.adjacentMines}</span>
      ) : null}
    </button>
  );
}
