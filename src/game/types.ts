export type Difficulty = 'beginner' | 'intermediate' | 'expert';

export type GameStatus = 'ready' | 'playing' | 'won' | 'lost';

export interface Position {
  row: number;
  column: number;
}

export interface Cell extends Position {
  hasMine: boolean;
  adjacentMines: number;
  isRevealed: boolean;
  isFlagged: boolean;
}

export type Board = Cell[][];

export interface DifficultyConfig {
  label: string;
  rows: number;
  columns: number;
  mines: number;
}
