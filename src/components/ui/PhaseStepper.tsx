import { Check } from 'lucide-react';
import type { RDPhase, PhaseState } from '../../types';

const PHASES: RDPhase[] = [
  'Ingredient Research',
  'Formula Development',
  'Sensory Testing',
  'Stability Testing',
  'Final Spec',
];

interface PhaseStepperProps {
  phases: Record<RDPhase, PhaseState>;
  onToggle: (phase: RDPhase) => void;
}

export function PhaseStepper({ phases, onToggle }: PhaseStepperProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
      {PHASES.map((phase, idx) => {
        const state = phases[phase];
        const isLast = idx === PHASES.length - 1;

        return (
          <div key={phase} className="flex sm:flex-1 items-center gap-2 sm:gap-0">
            <button
              onClick={() => onToggle(phase)}
              className={`
                flex-1 sm:flex-none w-full sm:w-auto flex flex-col items-center gap-1.5 p-3 rounded-lg border cursor-pointer transition-all
                ${state === 'done'
                  ? 'bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-800'
                  : state === 'active'
                  ? 'bg-amber-50 dark:bg-amber-950 border-amber-300 dark:border-amber-800'
                  : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800'
                }
              `}
            >
              <div
                className={`
                  w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium
                  ${state === 'done'
                    ? 'bg-green-500 text-white'
                    : state === 'active'
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }
                `}
              >
                {state === 'done' ? <Check size={14} /> : idx + 1}
              </div>
              <span
                className={`text-xs font-medium text-center leading-tight
                  ${state === 'done'
                    ? 'text-green-700 dark:text-green-400'
                    : state === 'active'
                    ? 'text-amber-700 dark:text-amber-400'
                    : 'text-gray-500 dark:text-gray-400'
                  }
                `}
              >
                {phase}
              </span>
            </button>
            {!isLast && (
              <div className="hidden sm:block h-px flex-1 bg-gray-200 dark:bg-gray-700 mx-1" />
            )}
          </div>
        );
      })}
    </div>
  );
}
