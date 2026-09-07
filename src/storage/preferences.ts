import { isDifficulty } from '../game/difficulties';
import type { Difficulty } from '../game/types';

const PREFERENCES_KEY = 'loopy-sweeper:preferences';
const BEST_TIMES_KEY = 'loopy-sweeper:best-times';

export interface Preferences {
  difficulty: Difficulty;
}

export type BestTimes = Partial<Record<Difficulty, number>>;

const canUseStorage = () =>
  typeof window !== 'undefined' && 'localStorage' in window;

export function loadPreferences(): Preferences {
  if (!canUseStorage()) return { difficulty: 'beginner' };
  try {
    const value = JSON.parse(
      window.localStorage.getItem(PREFERENCES_KEY) ?? '{}',
    ) as {
      difficulty?: unknown;
    };
    return {
      difficulty: isDifficulty(value.difficulty)
        ? value.difficulty
        : 'beginner',
    };
  } catch {
    return { difficulty: 'beginner' };
  }
}

export function savePreferences(preferences: Preferences): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch {
    // The game remains playable when storage is blocked or full.
  }
}

export function loadBestTimes(): BestTimes {
  if (!canUseStorage()) return {};
  try {
    const value = JSON.parse(
      window.localStorage.getItem(BEST_TIMES_KEY) ?? '{}',
    ) as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(value).filter(
        ([difficulty, time]) =>
          isDifficulty(difficulty) &&
          Number.isInteger(time) &&
          Number(time) >= 0,
      ),
    ) as BestTimes;
  } catch {
    return {};
  }
}

export function saveBestTimes(bestTimes: BestTimes): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(BEST_TIMES_KEY, JSON.stringify(bestTimes));
  } catch {
    // Best times are an enhancement, never a prerequisite for play.
  }
}
