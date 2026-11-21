export function comboMultiplier(combo) {
  return Math.min(4, 1 + Math.floor(combo / 2) * 0.5);
}

export function findPoints(combo) {
  return Math.round(120 * comboMultiplier(combo));
}

export function timeBonus(seconds) {
  return Math.round(Math.max(0, seconds) * 8);
}

export function starsFor(timeLeft, timeMax, misses) {
  const ratio = timeLeft / timeMax;
  if (ratio >= 0.45 && misses <= 1) return 3;
  if (ratio >= 0.22 && misses <= 4) return 2;
  return 1;
}
