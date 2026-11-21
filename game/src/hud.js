const $ = (id) => document.getElementById(id);

export function renderPips(container, total, found) {
  if (container.childElementCount !== total) {
    container.replaceChildren();
    for (let i = 0; i < total; i++) {
      const pip = document.createElement('span');
      pip.className = 'pip';
      container.appendChild(pip);
    }
  }
  [...container.children].forEach((pip, i) => pip.classList.toggle('filled', i < found));
}

export function updateHud(state) {
  const scene = state.scene;
  if (!scene) return;
  const remaining = scene.differences.length - state.found.size;
  $('hunt-count').textContent = `${remaining} left`;
  $('hunt-count').classList.toggle('urgent', remaining <= 2);
  $('hunt-level').textContent = scene.name;
  $('hunt-score').textContent = state.score.toLocaleString('en-US');
  $('hunt-combo').textContent = state.combo > 1 ? `x${state.combo} combo` : 'find the differences';
  renderPips($('hunt-pips'), scene.differences.length, state.found.size);
  const timer = state.timer;
  if (timer) {
    const fraction = timer.fraction();
    $('time-fill').style.width = `${(fraction * 100).toFixed(2)}%`;
    $('time-label').textContent = `${Math.ceil(timer.remaining)}s`;
    $('time-bar').classList.toggle('danger', timer.remaining < 15);
    $('hud-targets').textContent = `★★★ ≥ ${Math.ceil(timer.max * 0.45)}s & ≤1 miss · ★★ ≥ ${Math.ceil(timer.max * 0.22)}s & ≤4 misses`;
  }
  $('hud-scene-line').textContent = `Scene ${state.levelIndex + 1}/6 · ${scene.differences.length} hidden changes`;
  $('hint-count').textContent = String(state.hintsLeft);
  $('hint-btn').disabled = state.hintsLeft <= 0 || state.hintCooldown > 0 || remaining === 0;
  $('mute-btn').textContent = state.muted ? 'SOUND OFF' : 'SOUND ON';
  $('lens-btn').classList.toggle('active', state.lens);
  $('lens-btn').textContent = state.lens ? 'LENS ON' : 'LENS OFF';
}
