interface ProportionBarProps {
  name: string;
  amount: number;
  total: number;
  role: string;
}

export function ProportionBar({ name, amount, total, role }: ProportionBarProps) {
  const pct = total > 0 ? Math.round((amount / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-800 dark:text-gray-200">{name}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
            {role}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <span>{amount}g</span>
          <span className="text-xs w-9 text-right">{pct}%</span>
        </div>
      </div>
      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 dark:bg-amber-600 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
