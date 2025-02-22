const MAX_STAMINA = 5;
const RECOVERY_MINUTES = 10;

export function calculateCurrentStamina(currentStamina: number, lastUpdate: string): number {
  const minutesPassed = (Date.now() - new Date(lastUpdate).getTime()) / (1000 * 60);
  const recovered = Math.floor(minutesPassed / RECOVERY_MINUTES);
  return Math.min(MAX_STAMINA, currentStamina + recovered);
}

export function getNextRecoveryTime(currentStamina: number, lastUpdate: string): Date | null {
  if (currentStamina >= MAX_STAMINA) return null;

  const minutesPassed = (Date.now() - new Date(lastUpdate).getTime()) / (1000 * 60);
  const minutesUntilNext = RECOVERY_MINUTES - (minutesPassed % RECOVERY_MINUTES);

  return new Date(Date.now() + minutesUntilNext * 60 * 1000);
}