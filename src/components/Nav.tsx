import { NavLink } from 'react-router-dom';
import { FlaskConical, Moon, Sun } from 'lucide-react';

const TABS = [
  { to: '/', label: 'Overview' },
  { to: '/flavor', label: 'Flavor' },
  { to: '/ingredients', label: 'Ingredients' },
  { to: '/texture', label: 'Texture' },
  { to: '/tasting', label: 'Tasting' },
  { to: '/recipe', label: 'Recipe' },
];

interface NavProps {
  darkMode: boolean;
  onToggleDark: () => void;
}

export function Nav({ darkMode, onToggleDark }: NavProps) {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <FlaskConical size={20} className="text-amber-600 dark:text-amber-500" />
            <span className="font-medium text-gray-900 dark:text-gray-100 text-sm tracking-tight">
              Sauce Lab
            </span>
          </div>

          <nav className="hidden sm:flex items-center gap-0.5">
            {TABS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={onToggleDark}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Mobile nav */}
        <div className="sm:hidden flex gap-0.5 pb-2 overflow-x-auto">
          {TABS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
}
