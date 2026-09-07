import { describe, expect, it } from 'vitest';
import { checkGameState } from './checkGameState';
import { createEmptyBoard } from './createBoard';

describe('checkGameState', () => {
  it('detects playing, winning, and losing states', () => {
    const playing = createEmptyBoard(1, 2);
    expect(checkGameState(playing)).toBe('playing');
    playing[0][0].isRevealed = true;
    playing[0][1].hasMine = true;
    expect(checkGameState(playing)).toBe('won');
    playing[0][1].isRevealed = true;
    expect(checkGameState(playing)).toBe('lost');
  });
});
