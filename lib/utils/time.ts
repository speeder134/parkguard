// lib/utils/time.ts
export function formatDuration({ hours, minutes, seconds }: { hours?: number; minutes: number; seconds: number }): string {
  // Si on a des heures, on affiche HH:MM:SS
  if (hours && hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  // Sinon, on affiche MM:SS
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
