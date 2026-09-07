'use client';

import { Flag, Timer } from 'lucide-react';
import Image from 'next/image';
import { DIFFICULTIES } from '../game/difficulties';
import type { Difficulty, GameStatus } from '../game/types';

interface GameHeaderProps {
  difficulty: Difficulty;
  status: GameStatus;
  remainingMines: number;
  elapsedSeconds: number;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onRestart: () => void;
}

export const formatTime = (seconds: number) =>
  String(Math.min(999, seconds)).padStart(3, '0');

export function GameHeader({
  difficulty,
  status,
  remainingMines,
  elapsedSeconds,
  onDifficultyChange,
  onRestart,
}: GameHeaderProps) {
  const face =
    status === 'lost'
      ? '/assets/loopy/loopy-surprised.webp'
      : '/assets/loopy/loopy-neutral.png';

  return (
    <header className="game-header">
      <div className="difficulty-group" aria-label="Difficulty">
        {(
          Object.entries(DIFFICULTIES) as [
            Difficulty,
            (typeof DIFFICULTIES)[Difficulty],
          ][]
        ).map(([key, option]) => (
          <button
            type="button"
            key={key}
            className="difficulty-button"
            data-active={difficulty === key}
            aria-pressed={difficulty === key}
            onClick={() => onDifficultyChange(key)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="status-strip">
        <div
          className="counter"
          aria-label={`${remainingMines} mines remaining`}
        >
          <Flag aria-hidden="true" fill="currentColor" />
          <output>{String(remainingMines).padStart(3, '0')}</output>
        </div>
        <button
          type="button"
          className="restart-button"
          onClick={onRestart}
          aria-label="Restart game"
        >
          <Image
            className="restart-face"
            src={face}
            alt=""
            width={400}
            height={400}
          />
        </button>
        <div
          className="counter"
          aria-label={`${elapsedSeconds} seconds elapsed`}
        >
          <Timer aria-hidden="true" />
          <output>{formatTime(elapsedSeconds)}</output>
        </div>
      </div>
    </header>
  );
}
