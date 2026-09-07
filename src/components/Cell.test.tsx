import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Cell } from './Cell';
import type { Cell as CellData } from '../game/types';

const coveredCell: CellData = {
  row: 1,
  column: 2,
  hasMine: false,
  adjacentMines: 0,
  isRevealed: false,
  isFlagged: false,
};

function setup(cell = coveredCell) {
  const onReveal = vi.fn();
  const onFlag = vi.fn();
  render(
    <Cell
      cell={cell}
      isExploded={false}
      tabIndex={0}
      onReveal={onReveal}
      onFlag={onFlag}
      onFocus={vi.fn()}
      onNavigate={vi.fn()}
    />,
  );
  return { button: screen.getByRole('button'), onReveal, onFlag };
}

describe('Cell', () => {
  it('reveals on a primary mouse action', () => {
    const { button, onReveal } = setup();
    fireEvent.pointerUp(button, { pointerType: 'mouse', button: 0 });
    expect(onReveal).toHaveBeenCalledWith({ row: 1, column: 2 });
  });

  it('flags on right-click and prevents the context menu', () => {
    const { button, onFlag } = setup();
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
    });
    button.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(onFlag).toHaveBeenCalledWith({ row: 1, column: 2 });
  });

  it('supports reveal, flag, and navigation from the keyboard', () => {
    const onNavigate = vi.fn();
    const onReveal = vi.fn();
    const onFlag = vi.fn();
    render(
      <Cell
        cell={coveredCell}
        isExploded={false}
        tabIndex={0}
        onReveal={onReveal}
        onFlag={onFlag}
        onFocus={vi.fn()}
        onNavigate={onNavigate}
      />,
    );
    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });
    fireEvent.keyDown(button, { key: 'f' });
    fireEvent.keyDown(button, { key: 'ArrowRight' });
    expect(onReveal).toHaveBeenCalledOnce();
    expect(onFlag).toHaveBeenCalledOnce();
    expect(onNavigate).toHaveBeenCalledWith(
      { row: 1, column: 2 },
      'ArrowRight',
    );
  });

  it('provides a state-specific accessible label', () => {
    setup({ ...coveredCell, isRevealed: true, adjacentMines: 3 });
    expect(screen.getByRole('button')).toHaveAccessibleName(
      'Row 2, column 3, revealed, 3 adjacent mines',
    );
  });
});
