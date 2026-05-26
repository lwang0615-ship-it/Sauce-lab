import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange: (v: number) => void;
  label: string;
}

export function StarRating({ value, onChange, label }: StarRatingProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-40">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className="transition-transform hover:scale-110"
          >
            <Star
              size={22}
              className={star <= value ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}
            />
          </button>
        ))}
      </div>
      <span className="text-sm font-medium text-gray-400 w-6 text-right">{value}/5</span>
    </div>
  );
}
