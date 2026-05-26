import { useState, useEffect, useCallback } from 'react';
import type { AppState, TastingRound } from '../types';
import { Card } from './ui/Card';
import { StarRating } from './ui/StarRating';

const SCORE_LABELS: { key: keyof TastingRound['scores']; label: string }[] = [
  { key: 'aroma', label: 'Aroma intensity' },
  { key: 'initialFlavor', label: 'Initial flavor' },
  { key: 'balance', label: 'Balance' },
  { key: 'texturebody', label: 'Texture / body' },
  { key: 'finishLength', label: 'Finish length' },
  { key: 'pairingOnProtein', label: 'Pairing on protein' },
];

const EMPTY_SCORES: TastingRound['scores'] = {
  aroma: 3,
  initialFlavor: 3,
  balance: 3,
  texturebody: 3,
  finishLength: 3,
  pairingOnProtein: 3,
};

interface TastingPanelProps {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  showToast: (msg: string) => void;
}

function avg(scores: TastingRound['scores']): number {
  const vals = Object.values(scores);
  return Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 10) / 10;
}

export function TastingPanel({ state, update, showToast }: TastingPanelProps) {
  const [scores, setScores] = useState<TastingRound['scores']>(EMPTY_SCORES);
  const [notes, setNotes] = useState('');

  const nextRound = state.tastingHistory.length + 1;

  const saveRound = useCallback(() => {
    const round: TastingRound = {
      id: Math.random().toString(36).slice(2, 9),
      round: nextRound,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      scores,
      notes,
    };
    update({ tastingHistory: [...state.tastingHistory, round] });
    setScores(EMPTY_SCORES);
    setNotes('');
    showToast('Round saved!');
  }, [scores, notes, nextRound, state.tastingHistory, update, showToast]);

  // Cmd/Ctrl+S shortcut
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        saveRound();
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [saveRound]);

  function setScore(key: keyof TastingRound['scores'], val: number) {
    setScores((prev) => ({ ...prev, [key]: val }));
  }

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Round {nextRound} Scorecard
          </h2>
          <span className="text-xs text-gray-400">Avg: {avg(scores)}/5</span>
        </div>

        <div className="space-y-4 mb-5">
          {SCORE_LABELS.map(({ key, label }) => (
            <StarRating
              key={key}
              label={label}
              value={scores[key]}
              onChange={(v) => setScore(key, v)}
            />
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Observations, adjustments to try, pairing notes…"
            className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">⌘S to save</span>
          <button
            onClick={saveRound}
            className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
          >
            Save Round {nextRound}
          </button>
        </div>
      </Card>

      {/* History */}
      {state.tastingHistory.length > 0 && (
        <Card>
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
            Tasting History
          </h2>
          <div className="space-y-3">
            {[...state.tastingHistory].reverse().map((round) => (
              <div
                key={round.id}
                className="border border-gray-100 dark:border-gray-800 rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Round {round.round}
                    </span>
                    <span className="text-xs text-gray-400">{round.date}</span>
                  </div>
                  <span className="text-sm font-medium text-amber-600 dark:text-amber-500">
                    {avg(round.scores)}/5
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2">
                  {SCORE_LABELS.map(({ key, label }) => (
                    <span key={key} className="text-xs text-gray-500 dark:text-gray-400">
                      {label.split(' ')[0]}: {round.scores[key]}
                    </span>
                  ))}
                </div>
                {round.notes && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">{round.notes}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
