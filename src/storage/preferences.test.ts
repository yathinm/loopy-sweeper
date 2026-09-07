import { beforeEach, describe, expect, it } from 'vitest';
import {
  loadBestTimes,
  loadPreferences,
  saveBestTimes,
  savePreferences,
} from './preferences';

describe('local preferences', () => {
  beforeEach(() => window.localStorage.clear());

  it('round-trips the selected difficulty', () => {
    savePreferences({ difficulty: 'expert' });
    expect(loadPreferences()).toEqual({ difficulty: 'expert' });
  });

  it('falls back when preferences are malformed', () => {
    window.localStorage.setItem('loopy-sweeper:preferences', '{not-json');
    expect(loadPreferences()).toEqual({ difficulty: 'beginner' });
  });

  it('keeps only valid best times', () => {
    saveBestTimes({ beginner: 18, expert: 140 });
    expect(loadBestTimes()).toEqual({ beginner: 18, expert: 140 });
    window.localStorage.setItem(
      'loopy-sweeper:best-times',
      JSON.stringify({ beginner: -4, intermediate: 72, mystery: 10 }),
    );
    expect(loadBestTimes()).toEqual({ intermediate: 72 });
  });
});
