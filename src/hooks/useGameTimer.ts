import { useEffect, useState } from 'react';
import type { GameStatus } from '../game/types';

export function useGameTimer(status: GameStatus, gameId: number) {
  const [timer, setTimer] = useState({ gameId, seconds: 0 });

  useEffect(() => {
    if (status !== 'playing') return;
    const interval = window.setInterval(
      () =>
        setTimer((current) => ({
          gameId,
          seconds: current.gameId === gameId ? current.seconds + 1 : 1,
        })),
      1000,
    );
    return () => window.clearInterval(interval);
  }, [gameId, status]);

  return timer.gameId === gameId ? timer.seconds : 0;
}
