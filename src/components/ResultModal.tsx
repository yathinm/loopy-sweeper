'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import type { GameStatus } from '../game/types';

interface ResultModalProps {
  status: GameStatus;
  elapsedSeconds: number;
  bestTime?: number;
  isNewBest: boolean;
  onPlayAgain: () => void;
}

export function ResultModal({
  status,
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
        aria-label={won ? 'Game won' : 'Game lost'}
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
