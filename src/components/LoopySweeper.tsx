'use client';

import Image from 'next/image';
import { Board } from './Board';
import { GameHeader } from './GameHeader';
import { ResultModal } from './ResultModal';
import { useMinesweeper } from '../hooks/useMinesweeper';
import { useGameTool } from '../hooks/useGameTool';

export function LoopySweeper() {
  const game = useMinesweeper();
  useGameTool(game.changeDifficulty);

  return (
    <main className="game-page">
      <div className="cloud cloud-one" aria-hidden="true" />
      <div className="cloud cloud-two" aria-hidden="true" />
      <div className="flower-field" aria-hidden="true" />

      <section className="game-shell" aria-labelledby="game-title">
        <div className="title-row">
          <div>
            <p className="eyebrow">Porong Porong Forest</p>
            <h1 id="game-title">Loopy Sweeper</h1>
          </div>
          <Image
            className="loopy-mascot"
            src="/assets/loopy/loopy-neutral.png"
            alt="Loopy waves hello"
            width={400}
            height={400}
            priority
          />
        </div>

        <div className="game-panel" data-difficulty={game.difficulty}>
          <GameHeader
            difficulty={game.difficulty}
            status={game.status}
            remainingMines={game.remainingMines}
            elapsedSeconds={game.elapsedSeconds}
            onDifficultyChange={game.changeDifficulty}
            onRestart={() => game.restart()}
          />

          <div className="instructions" aria-label="How to play">
            <span>
              <strong>Tap</strong> to reveal
            </span>
            <span aria-hidden="true">•</span>
            <span>
              <strong>Hold</strong> to flag
            </span>
            <span className="desktop-instruction">Right-click also flags</span>
          </div>

          {game.hydrated ? (
            <Board
              board={game.board}
              explodedCell={game.explodedCell}
              locked={game.status === 'won' || game.status === 'lost'}
              onReveal={game.reveal}
              onFlag={game.toggleFlag}
            />
          ) : (
            <div className="board-loading" aria-label="Loading game" />
          )}

          <p className="best-time-display">
            Best {game.config.label}:{' '}
            <strong>
              {game.bestTime === undefined
                ? '—'
                : `${formatBest(game.bestTime)}s`}
            </strong>
          </p>
        </div>
      </section>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {game.status === 'won'
          ? 'You won the game.'
          : game.status === 'lost'
            ? 'You lost the game.'
            : ''}
      </div>
      <ResultModal
        status={game.status}
        elapsedSeconds={game.elapsedSeconds}
        bestTime={game.bestTime}
        isNewBest={game.isNewBest}
        onPlayAgain={() => game.restart()}
      />
    </main>
  );
}

const formatBest = (seconds: number) =>
  String(Math.min(seconds, 999)).padStart(3, '0');
