import { useMemo } from 'react';
import type { FlavorValues } from '../types';

export interface FlavorInsight {
  message: string;
  isBalanced: boolean;
  dominant: keyof FlavorValues;
}

export function useFlavorBalance(flavor: FlavorValues) {
  const total = useMemo(
    () => Object.values(flavor).reduce((sum, v) => sum + v, 0) || 1,
    [flavor]
  );

  const percentages = useMemo(
    () => ({
      sweet: Math.round((flavor.sweet / total) * 100),
      salty: Math.round((flavor.salty / total) * 100),
      sour: Math.round((flavor.sour / total) * 100),
      bitter: Math.round((flavor.bitter / total) * 100),
      umami: Math.round((flavor.umami / total) * 100),
    }),
    [flavor, total]
  );

  const dominant = useMemo(
    () =>
      (Object.entries(flavor) as [keyof FlavorValues, number][]).reduce((a, b) =>
        b[1] > a[1] ? b : a
      )[0],
    [flavor]
  );

  const insights = useMemo(() => {
    const msgs: string[] = [];
    if (flavor.umami < 3) msgs.push('Add demi-glace, miso, or mushroom to build depth');
    if (flavor.salty > 7) msgs.push('Add acid or sweetness to counter perception');
    if (flavor.salty < 2) msgs.push('Salt amplifies all tastes — increase gradually');
    if (flavor.sour < 2) msgs.push('Add wine, vinegar, or citrus to lift the profile');
    if (flavor.sour > 7) msgs.push('Balance with fat (butter) or sweetness');
    if (flavor.sweet > 7) msgs.push('Counter with more sour and salt');
    if (flavor.bitter > 5) msgs.push('Add fat (butter mount) or a pinch of sugar');
    return msgs;
  }, [flavor]);

  const isBalanced = insights.length === 0;

  const dominantLabel: Record<keyof FlavorValues, string> = {
    sweet: 'Sweet',
    salty: 'Salty',
    sour: 'Sour',
    bitter: 'Bitter',
    umami: 'Umami',
  };

  return { total, percentages, dominant, dominantLabel, insights, isBalanced };
}
