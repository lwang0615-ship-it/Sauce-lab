import type { AppState, RDPhase, PhaseState, SauceStyle, TargetTexture } from '../types';
import { Card } from './ui/Card';
import { MetricCard } from './ui/MetricCard';
import { PhaseStepper } from './ui/PhaseStepper';
import { useFlavorBalance } from '../hooks/useFlavorBalance';

const PHASES: RDPhase[] = [
  'Ingredient Research',
  'Formula Development',
  'Sensory Testing',
  'Stability Testing',
  'Final Spec',
];

const SAUCE_STYLES: SauceStyle[] = [
  'Steak & red meat',
  'Fillet & delicate cuts',
  'Asian fusion',
  'Grilled poultry',
  'Dipping sauce',
  'Marinade base',
];

const TEXTURES: TargetTexture[] = ['Glossy jus', 'Demi-glace', 'Thick sauce', 'Emulsified'];

interface OverviewProps {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
}

export function Overview({ state, update }: OverviewProps) {
  const { dominant, dominantLabel } = useFlavorBalance(state.flavor);

  const phasesDone = Object.values(state.phases).filter((p) => p === 'done').length;

  function handlePhaseToggle(phase: RDPhase) {
    const current = state.phases[phase];
    const phaseIdx = PHASES.indexOf(phase);

    const next: Record<RDPhase, PhaseState> = { ...state.phases };
    if (current === 'done') {
      // undo — set back to active or pending
      next[phase] = phaseIdx === 0 ? 'active' : 'pending';
    } else {
      next[phase] = 'done';
      // advance next phase to active if it's pending
      const nextPhase = PHASES[phaseIdx + 1];
      if (nextPhase && next[nextPhase] === 'pending') {
        next[nextPhase] = 'active';
      }
    }
    update({ phases: next });
  }

  const TASTE_COLORS: Record<string, string> = {
    sweet: '#BA7517',
    salty: '#185FA5',
    sour: '#1D9E75',
    bitter: '#993C1D',
    umami: '#534AB7',
  };

  return (
    <div className="space-y-5">
      <Card>
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
          Project Details
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="sm:col-span-3">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              Project Name
            </label>
            <input
              type="text"
              value={state.projectName}
              onChange={(e) => update({ projectName: e.target.value })}
              placeholder="e.g. Black Garlic Jus v3"
              className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              Sauce Style
            </label>
            <select
              value={state.sauceStyle}
              onChange={(e) => update({ sauceStyle: e.target.value as SauceStyle })}
              className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="">Select style…</option>
              {SAUCE_STYLES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              Target Texture
            </label>
            <select
              value={state.targetTexture}
              onChange={(e) => update({ targetTexture: e.target.value as TargetTexture })}
              className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="">Select texture…</option>
              {TEXTURES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              Development Notes
            </label>
            <textarea
              value={state.developmentNotes}
              onChange={(e) => update({ developmentNotes: e.target.value })}
              rows={4}
              placeholder="Process notes, iteration goals, key observations…"
              className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
          R&D Phase Tracker
        </h2>
        <PhaseStepper phases={state.phases} onToggle={handlePhaseToggle} />
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">Click a phase to mark it complete</p>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          label="Total Ingredients"
          value={state.ingredients.length}
        />
        <MetricCard
          label="Tasting Rounds"
          value={state.tastingHistory.length}
        />
        <MetricCard
          label="Phases Done"
          value={`${phasesDone} / 5`}
        />
        <MetricCard
          label="Dominant Taste"
          value={dominantLabel[dominant]}
          accent={TASTE_COLORS[dominant]}
        />
      </div>
    </div>
  );
}
