import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { AppState, Ingredient } from '../types';
import { Card } from './ui/Card';
import { ProportionBar } from './ui/ProportionBar';

interface IngredientsProps {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export function Ingredients({ state, update }: IngredientsProps) {
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newRole, setNewRole] = useState('');

  const totalWeight = state.ingredients.reduce((s, i) => s + i.amount, 0);
  const coverage = state.batchSize > 0 ? Math.round((totalWeight / state.batchSize) * 100) : 0;

  function addIngredient() {
    if (!newName.trim() || !newAmount) return;
    const ingredient: Ingredient = {
      id: generateId(),
      name: newName.trim(),
      amount: Number(newAmount),
      role: newRole.trim() || 'Other',
    };
    update({ ingredients: [...state.ingredients, ingredient] });
    setNewName('');
    setNewAmount('');
    setNewRole('');
  }

  function removeIngredient(id: string) {
    update({ ingredients: state.ingredients.filter((i) => i.id !== id) });
  }

  function updateIngredient(id: string, patch: Partial<Ingredient>) {
    update({
      ingredients: state.ingredients.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    });
  }

  return (
    <div className="space-y-5">
      {/* Batch size + summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="col-span-2 sm:col-span-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Batch Size
          </span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={state.batchSize}
              onChange={(e) => update({ batchSize: Number(e.target.value) })}
              className="w-24 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg px-2 py-1.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <span className="text-sm text-gray-500">g</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Total Weight
          </span>
          <span className="text-2xl font-medium text-gray-900 dark:text-gray-100">{totalWeight}g</span>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Batch Coverage
          </span>
          <span className={`text-2xl font-medium ${coverage > 100 ? 'text-red-500' : coverage > 90 ? 'text-green-600' : 'text-gray-900 dark:text-gray-100'}`}>
            {coverage}%
          </span>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Ingredients
          </span>
          <span className="text-2xl font-medium text-gray-900 dark:text-gray-100">{state.ingredients.length}</span>
        </div>
      </div>

      {/* Ingredient list */}
      <Card>
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
          Ingredient List
        </h2>
        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-[1fr_80px_120px_36px] gap-2 px-1">
            <span className="text-xs font-medium text-gray-400">Name</span>
            <span className="text-xs font-medium text-gray-400">Grams</span>
            <span className="text-xs font-medium text-gray-400">Role</span>
            <span />
          </div>

          {state.ingredients.map((ing) => (
            <div key={ing.id} className="grid grid-cols-[1fr_80px_120px_36px] gap-2 items-center">
              <input
                type="text"
                value={ing.name}
                onChange={(e) => updateIngredient(ing.id, { name: e.target.value })}
                className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg px-2.5 py-1.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <input
                type="number"
                value={ing.amount}
                onChange={(e) => updateIngredient(ing.id, { amount: Number(e.target.value) })}
                className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg px-2.5 py-1.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <input
                type="text"
                value={ing.role}
                onChange={(e) => updateIngredient(ing.id, { role: e.target.value })}
                className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg px-2.5 py-1.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                onClick={() => removeIngredient(ing.id)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}

          {/* Add row */}
          <div className="grid grid-cols-[1fr_80px_120px_36px] gap-2 items-center pt-2 border-t border-gray-100 dark:border-gray-800">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
              placeholder="Ingredient name"
              className="border border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-lg px-2.5 py-1.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-solid"
            />
            <input
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
              placeholder="0"
              className="border border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-lg px-2.5 py-1.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-solid"
            />
            <input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
              placeholder="Role"
              className="border border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-lg px-2.5 py-1.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-solid"
            />
            <button
              onClick={addIngredient}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950 border border-amber-300 dark:border-amber-800 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </Card>

      {/* Proportion bars */}
      {state.ingredients.length > 0 && (
        <Card>
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
            Visual Proportions
          </h2>
          <div className="space-y-3">
            {[...state.ingredients]
              .sort((a, b) => b.amount - a.amount)
              .map((ing) => (
                <ProportionBar
                  key={ing.id}
                  name={ing.name}
                  amount={ing.amount}
                  total={totalWeight}
                  role={ing.role}
                />
              ))}
          </div>
        </Card>
      )}
    </div>
  );
}
