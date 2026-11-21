export function applyShot(query, api) {
  const shot = query.get('shot');
  const level = Math.max(1, Math.min(6, Number(query.get('level')) || 1));
  const index = level - 1;

  if (shot === 'title') return;

  if (shot === 'select') {
    api.goSelect();
    return;
  }

  if (shot === 'hunt' || shot === 'hint') {
    api.startLevel(index);
    const diffs = api.levels[index].differences;
    const foundCount = Math.ceil(diffs.length / 2);
    diffs.slice(0, foundCount).forEach((diff) => api.markFound(diff.id));
    api.setTime(api.state.timeMax * 0.62);
    if (shot === 'hint') api.hint(true);
    return;
  }

  if (shot === 'complete') {
    api.startLevel(index);
    api.levels[index].differences.forEach((diff) => api.markFound(diff.id));
    api.setTime(api.state.timeMax * 0.48);
    api.finishLevel(true);
    return;
  }

  if (shot === 'gameover') {
    api.startLevel(index);
    const diffs = api.levels[index].differences;
    diffs.slice(0, Math.ceil(diffs.length / 2)).forEach((diff) => api.markFound(diff.id));
    api.setTime(0);
    return;
  }
}
