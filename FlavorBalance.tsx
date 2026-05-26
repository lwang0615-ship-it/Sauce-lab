import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import type { FlavorValues, AppState } from '../types';
import { Card } from './ui/Card';
import { useFlavorBalance } from '../hooks/useFlavorBalance';

const TASTE_CONFIG: {
  key: keyof FlavorValues;
  label: string;
  color: string;
  examples: string;
}[] = [
  { key: 'sweet', label: 'Sweet', color: '#BA7517', examples: 'black garlic · mirin · caramel' },
  { key: 'salty', label: 'Salty', color: '#185FA5', examples: 'salt · soy · fish sauce' },
  { key: 'sour', label: 'Sour', color: '#1D9E75', examples: 'wine · vinegar · citrus' },
  { key: 'bitter', label: 'Bitter', color: '#993C1D', examples: 'tannins · roasted notes' },
  { key: 'umami', label: 'Umami', color: '#534AB7', examples: 'demi-glace · mushroom · black garlic' },
];

const PRESETS: { label: string; values: FlavorValues }[] = [
  { label: 'Black garlic', values: { sweet: 5, salty: 4, sour: 3, bitter: 2, umami: 8 } },
  { label: 'Classic steak', values: { sweet: 3, salty: 5, sour: 4, bitter: 2, umami: 7 } },
  { label: 'Asian fusion', values: { sweet: 5, salty: 7, sour: 5, bitter: 1, umami: 6 } },
  { label: 'BBQ', values: { sweet: 8, salty: 5, sour: 4, bitter: 2, umami: 4 } },
];

interface FlavorBalanceProps {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
}

export function FlavorBalance({ state, update }: FlavorBalanceProps) {
  const { percentages, dominant, dominantLabel, insights, isBalanced } = useFlavorBalance(
    state.flavor
  );

  function setFlavor(key: keyof FlavorValues, val: number) {
    update({ flavor: { ...state.flavor, [key]: val } });
  }

  const radarData = TASTE_CONFIG.map(({ key, label }) => ({
    subject: label,
    value: state.flavor[key],
    fullMark: 10,
  }));

  const dominantColor = TASTE_CONFIG.find((t) => t.key === dominant)?.color ?? '#BA7517';

  return (
    <div className="space-y-5">
      {/* Presets */}
      <Card>
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Presets
        </h2>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => update({ flavor: p.values })}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-950 hover:border-amber-300 dark:hover:border-amber-800 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 gap-5">
        {/* Sliders */}
        <Card>
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
            Taste Sliders
          </h2>
          <div className="space-y-5">
            {TASTE_CONFIG.map(({ key, label, color, examples }) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium" style={{ color }}>
                    {label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
                      style={{ backgroundColor: color }}
                    >
                      {percentages[key]}%
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-4 text-right">
                      {state.flavor[key]}
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={state.flavor[key]}
                  onChange={(e) => setFlavor(key, Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={
                    {
                      background: `linear-gradient(to right, ${color} 0%, ${color} ${state.flavor[key] * 10}%, #e5e7eb ${state.flavor[key] * 10}%, #e5e7eb 100%)`,
                      '--thumb-color': color,
                    } as React.CSSProperties
                  }
                />
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{examples}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Radar chart */}
        <div className="space-y-5">
          <Card className="flex flex-col items-center">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 w-full">
              Flavor Profile
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <Radar
                  name="Flavor"
                  dataKey="value"
                  stroke={dominantColor}
                  fill={dominantColor}
                  fillOpacity={0.18}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>

            {/* Balance pills */}
            <div className="flex flex-wrap gap-2 mt-2 w-full justify-center">
              {TASTE_CONFIG.map(({ key, label, color }) => (
                <span
                  key={key}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium border transition-all ${
                    key === dominant ? 'text-white' : 'bg-transparent'
                  }`}
                  style={
                    key === dominant
                      ? { backgroundColor: color, borderColor: color, color: '#fff' }
                      : { borderColor: color, color }
                  }
                >
                  {label} {percentages[key]}%
                </span>
              ))}
            </div>
          </Card>

          {/* Insight box */}
          <Card
            className={isBalanced
              ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950'
              : 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950'
            }
          >
            <h3 className={`text-xs font-medium uppercase tracking-wide mb-2 ${
              isBalanced ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
            }`}>
              {isBalanced ? 'Balance' : 'Insights'}
            </h3>
            {isBalanced ? (
              <p className="text-sm text-green-800 dark:text-green-300">
                Well balanced. Dominant note: <strong>{dominantLabel[dominant]}</strong>
              </p>
            ) : (
              <ul className="space-y-1.5">
                {insights.map((msg, i) => (
                  <li key={i} className="text-sm text-amber-800 dark:text-amber-300 flex gap-2">
                    <span className="text-amber-500 mt-0.5">→</span>
                    <span>{msg}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
