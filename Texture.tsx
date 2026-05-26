import type { AppState, TextureMechanism, StarchType } from '../types';
import { Card } from './ui/Card';

const MECHANISMS: TextureMechanism[] = ['Reduction', 'Emulsification', 'Starch', 'Natural gel'];

const MECHANISM_DATA: Record<
  TextureMechanism,
  {
    description: string;
    properties: { label: string; value: number }[];
    tips: string[];
    warnings: string[];
  }
> = {
  Reduction: {
    description:
      'Concentrates flavors and thickens the sauce by evaporating water. The natural proteins and sugars condense, creating body and gloss. Most classic French sauces rely on reduction for structure.',
    properties: [
      { label: 'Body', value: 75 },
      { label: 'Gloss', value: 85 },
      { label: 'Cling', value: 70 },
      { label: 'Heat stability', value: 90 },
      { label: 'Mouthcoat', value: 65 },
    ],
    tips: [
      'Reduce at a gentle simmer — boiling too hard can turn bitter',
      'Use a wide-bottomed pan for faster, even evaporation',
      'Finish with cold butter mount for added gloss and body',
    ],
    warnings: [
      'Over-reduction concentrates salt and acid — taste as you go',
      'Gelatin-rich stocks can set firm on cooling',
    ],
  },
  Emulsification: {
    description:
      'Suspends fat droplets in a water-based medium using emulsifiers (lecithin in butter, egg yolk, mustard). Creates creamy, velvety texture. Requires careful heat and agitation control.',
    properties: [
      { label: 'Body', value: 80 },
      { label: 'Gloss', value: 90 },
      { label: 'Cling', value: 85 },
      { label: 'Heat stability', value: 40 },
      { label: 'Mouthcoat', value: 95 },
    ],
    tips: [
      'Add cold butter gradually off the heat or over very low heat',
      'A small amount of Dijon mustard helps stabilize the emulsion',
      'Whisk constantly while mounting butter for best results',
    ],
    warnings: [
      'High heat will break the emulsion — keep below 80°C',
      'Separated sauce can sometimes be rescued by starting with a fresh base',
    ],
  },
  Starch: {
    description:
      'Starch granules swell on heating, trapping water and creating viscosity. Provides consistent, controllable thickness. Different starches give different textures and clarity.',
    properties: [
      { label: 'Body', value: 85 },
      { label: 'Gloss', value: 50 },
      { label: 'Cling', value: 80 },
      { label: 'Heat stability', value: 60 },
      { label: 'Mouthcoat', value: 70 },
    ],
    tips: [
      'Slurry starch in cold liquid before adding to hot sauce',
      'Cook long enough to remove raw starch taste (1–2 min at full simmer)',
      'Use less than you think — add gradually to control thickness',
    ],
    warnings: [
      'Over-thickening is difficult to reverse without diluting flavor',
      'Some starches thin again on extended cooking or freezing',
    ],
  },
  'Natural gel': {
    description:
      'Proteins (gelatin from bones, collagen) or vegetable gums create a gel matrix. Achieves classic jus consistency — coating and body that sets at fridge temp but flows when warm.',
    properties: [
      { label: 'Body', value: 90 },
      { label: 'Gloss', value: 80 },
      { label: 'Cling', value: 88 },
      { label: 'Heat stability', value: 70 },
      { label: 'Mouthcoat', value: 85 },
    ],
    tips: [
      'Use a high-quality veal or chicken stock with good collagen content',
      'Test set: a spoonful on a cold plate should lightly gel when chilled',
      'Skim fat during reduction to clarify the gel structure',
    ],
    warnings: [
      'Gelatin content varies by stock — may need to enrich with leaf gelatin',
      'Aggressive boil can cloud the sauce and weaken gel structure',
    ],
  },
};

const STARCH_INFO: Record<StarchType, string> = {
  Arrowroot: 'Produces a very clear, glossy gel. Ideal for fruit-based or delicate sauces. Does not hold well in dairy-based applications or extended reheating.',
  Cornstarch: 'Most common thickener. Creates a slightly opaque, starchy texture. Good heat stability. Avoid freezing — can turn spongy on thaw.',
  Roux: 'Cooked fat + flour base. Adds body and rich flavor. Used in classic velouté and béchamel. Requires thorough cooking to eliminate raw flour taste.',
  Tapioca: 'Extracted from cassava. Very clear gel, slightly chewy texture. Excellent freeze-thaw stability. Often used in Asian-inspired preparations.',
};

function reductionLabel(pct: number): string {
  if (pct < 30) return 'Thin — needs more reduction';
  if (pct <= 50) return 'Glossy, coating — ideal';
  if (pct <= 70) return 'Light body';
  return 'Syrupy — over-reduced';
}

interface TextureProps {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
}

export function Texture({ state, update }: TextureProps) {
  const { mechanism, reductionPercent, starchType } = state.texture;
  const data = MECHANISM_DATA[mechanism];

  function setMechanism(m: TextureMechanism) {
    update({ texture: { ...state.texture, mechanism: m } });
  }

  return (
    <div className="space-y-5">
      {/* Mechanism tabs */}
      <div className="flex flex-wrap gap-2">
        {MECHANISMS.map((m) => (
          <button
            key={m}
            onClick={() => setMechanism(m)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              mechanism === m
                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <Card>
        <h2 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">{mechanism}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-5">{data.description}</p>

        {/* Properties */}
        <div className="space-y-2.5 mb-5">
          {data.properties.map(({ label, value }) => (
            <div key={label}>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-gray-600 dark:text-gray-400">{label}</span>
                <span className="text-gray-500">{value}%</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gray-800 dark:bg-gray-200 transition-all"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Mechanism-specific controls */}
        {mechanism === 'Reduction' && (
          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Reduction: {reductionPercent}%
              </span>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  reductionPercent >= 30 && reductionPercent <= 50
                    ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400'
                    : reductionPercent < 30
                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                }`}
              >
                {reductionLabel(reductionPercent)}
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={90}
              step={5}
              value={reductionPercent}
              onChange={(e) =>
                update({ texture: { ...state.texture, reductionPercent: Number(e.target.value) } })
              }
              className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-gray-800 dark:accent-gray-200"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>10%</span>
              <span>90%</span>
            </div>
          </div>
        )}

        {mechanism === 'Starch' && (
          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mb-4">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              Starch Type
            </label>
            <select
              value={starchType}
              onChange={(e) =>
                update({ texture: { ...state.texture, starchType: e.target.value as StarchType } })
              }
              className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-400 mb-3"
            >
              {(['Arrowroot', 'Cornstarch', 'Roux', 'Tapioca'] as StarchType[]).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{STARCH_INFO[starchType]}</p>
          </div>
        )}

        {/* Tips & warnings */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Tips
            </h4>
            <ul className="space-y-1.5">
              {data.tips.map((tip, i) => (
                <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex gap-2">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Warnings
            </h4>
            <ul className="space-y-1.5">
              {data.warnings.map((w, i) => (
                <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex gap-2">
                  <span className="text-amber-500 mt-0.5 flex-shrink-0">!</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
