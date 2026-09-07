import { useEffect } from 'react';
import { isDifficulty } from '../game/difficulties';
import type { Difficulty } from '../game/types';

export function useGameTool(startGame: (difficulty: Difficulty) => void) {
  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;

    const lifecycle = new AbortController();
    const registration = context.registerTool(
      {
        name: 'start_new_minesweeper_game',
        title: 'Start a new Minesweeper game',
        description:
          'Start a fresh Loopy Sweeper game at the selected difficulty.',
        inputSchema: {
          type: 'object',
          properties: {
            difficulty: {
              type: 'string',
              enum: ['beginner', 'intermediate', 'expert'],
            },
          },
          required: ['difficulty'],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          const difficulty = (input as { difficulty?: unknown } | null)
            ?.difficulty;
          if (!isDifficulty(difficulty)) {
            throw new Error(
              'Difficulty must be beginner, intermediate, or expert.',
            );
          }
          startGame(difficulty);
          return { status: 'ready', difficulty };
        },
      },
      { signal: lifecycle.signal },
    );

    void Promise.resolve(registration).catch(() => {
      // Tool registration is an enhancement in supported browsers.
    });
    return () => lifecycle.abort();
  }, [startGame]);
}
