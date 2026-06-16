/**
 * Calculate karma points from session duration in minutes:
 * - 30 min = 2 karma
 * - 45 min = 3 karma
 * - 60 min = 4 karma (also default fallback for other durations)
 */
export function getKarmaForDuration(duration: number | string): number {
  const mins = typeof duration === 'string' ? parseInt(duration, 10) : duration;
  if (isNaN(mins)) return 4; // safe default
  if (mins <= 30) return 2;
  if (mins <= 45) return 3;
  return 4;
}
