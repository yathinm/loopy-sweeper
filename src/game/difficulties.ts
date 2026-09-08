import type { Difficulty, DifficultyConfig } from './types';

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  beginner: { label: 'Beginner', rows: 9, columns: 9, mines: 10 },
  intermediate: { label: 'Intermediate', rows: 16, columns: 16, mines: 40 },
  expert: { label: 'Loopy', rows: 16, columns: 30, mines: 99 },
};

export const isDifficulty = (value: unknown): value is Difficulty =>
  typeof value === 'string' && value in DIFFICULTIES;
