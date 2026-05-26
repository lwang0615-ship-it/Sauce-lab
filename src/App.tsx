import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Nav } from './components/Nav';
import { Overview } from './components/Overview';
import { FlavorBalance } from './components/FlavorBalance';
import { Ingredients } from './components/Ingredients';
import { Texture } from './components/Texture';
import { TastingPanel } from './components/TastingPanel';
import { RecipeCard } from './components/RecipeCard';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { AppState } from './types';
import { DEFAULT_STATE } from './types';

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg pointer-events-none">
      {message}
    </div>
  );
}

export default function App() {
  const [state, setState] = useLocalStorage<AppState>('sauce-lab-v1', DEFAULT_STATE);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode);
  }, [state.darkMode]);

  const update = useCallback(
    (patch: Partial<AppState>) => setState((prev) => ({ ...prev, ...patch })),
    [setState]
  );

  const showToast = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Nav
          darkMode={state.darkMode}
          onToggleDark={() => update({ darkMode: !state.darkMode })}
        />

        <main className="max-w-4xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Overview state={state} update={update} />} />
            <Route path="/flavor" element={<FlavorBalance state={state} update={update} />} />
            <Route path="/ingredients" element={<Ingredients state={state} update={update} />} />
            <Route path="/texture" element={<Texture state={state} update={update} />} />
            <Route
              path="/tasting"
              element={<TastingPanel state={state} update={update} showToast={showToast} />}
            />
            <Route path="/recipe" element={<RecipeCard state={state} showToast={showToast} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      </div>
    </BrowserRouter>
  );
}
