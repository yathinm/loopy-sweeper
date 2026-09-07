'use client';

import { useEffect, useRef } from 'react';
import { Trophy } from 'lucide-react';
import Image from 'next/image';
import type { GameStatus } from '../game/types';
import { formatTime } from './GameHeader';

interface ResultModalProps {
  status: GameStatus;
  elapsedSeconds: number;
  bestTime?: number;
  onPlayAgain: () => void;
}

export function ResultModal({
  status,
  elapsedSeconds,
  bestTime,
  onPlayAgain,
}: ResultModalProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isOpen = status === 'won' || status === 'lost';

  useEffect(() => {
    if (isOpen) buttonRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;
  const won = status === 'won';

  return (
    <div className="modal-backdrop">
      <section
        className="result-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="result-title"
        aria-describedby="result-description"
      >
        <div className={`result-art ${won ? 'happy' : 'surprised'}`}>
          <Image
            src={
              won
                ? '/assets/loopy/loopy-neutral.png'
                : '/assets/loopy/loopy-surprised.webp'
            }
            alt=""
            width={512}
            height={512}
          />
        </div>
        <p className="result-kicker">
          {won ? 'Sweet victory!' : 'Oh, crumbs!'}
        </p>
        <h2 id="result-title">
          {won ? 'You cleared the garden!' : 'A mine found you'}
        </h2>
        <p id="result-description">
          {won
            ? `Finished in ${formatTime(elapsedSeconds)} seconds.`
            : 'That was a tricky one. Ready for another try?'}
        </p>
        {won && bestTime === elapsedSeconds ? (
          <p className="best-time">
            <Trophy aria-hidden="true" /> New best time
          </p>
        ) : null}
        <button
          ref={buttonRef}
          type="button"
          className="play-again-button"
          onClick={onPlayAgain}
        >
          Play again
        </button>
      </section>
    </div>
  );
}
