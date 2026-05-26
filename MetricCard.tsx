interface MetricCardProps {
  label: string;
  value: string | number;
  accent?: string;
}

export function MetricCard({ label, value, accent }: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </span>
      <span
        className="text-2xl font-medium"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </span>
    </div>
  );
}
