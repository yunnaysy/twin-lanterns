const KEY = 'twin-lanterns-save-v1';

const defaults = () => ({ unlocked: 1, bestScore: {}, stars: {} });

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults();
    const data = JSON.parse(raw);
    return {
      unlocked: Math.min(6, Math.max(1, Number(data.unlocked) || 1)),
      bestScore: data.bestScore && typeof data.bestScore === 'object' ? data.bestScore : {},
      stars: data.stars && typeof data.stars === 'object' ? data.stars : {},
    };
  } catch {
    return defaults();
  }
}

export function save(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    return;
  }
}

export function recordLevel(data, levelIndex, score, stars) {
  const key = String(levelIndex + 1);
  data.bestScore[key] = Math.max(Number(data.bestScore[key]) || 0, score);
  data.stars[key] = Math.max(Number(data.stars[key]) || 0, stars);
  data.unlocked = Math.max(data.unlocked, Math.min(6, levelIndex + 2));
  save(data);
  return data;
}
