import { LEVELS } from './scenes/index.js';
import { defs, backdrop, moon, star, starField, cloud, mountain, waves, reflection, house, lantern, lanternString, boat, bridge, W, H } from './sceneKit.js';

const $ = (id) => document.getElementById(id);

export function setScreen(name) {
  for (const id of ['title', 'select', 'hunt']) $(id).classList.toggle('hidden', id !== name);
}

export function setStatus(text) {
  $('status').textContent = text;
}

export function renderTitleArt(container) {
  let markup = `<svg class="title-art-svg" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">`;
  markup += defs();
  markup += backdrop('#05091e', '#17215c', '#552d70');
  markup += starField(77, 42, 6, 150);
  markup += moon(508, 66, 30);
  markup += cloud(180, 52, 130, 0.13) + cloud(400, 104, 100, 0.1);
  markup += mountain(90, 218, 220, 70, '#101941') + mountain(380, 220, 280, 64, '#111841');
  markup += house(60, 176, 66, 62, { color: '#141232', roof: '#291a4f' });
  markup += house(142, 184, 54, 54, { color: '#18143a', windows: 1 });
  markup += house(440, 178, 62, 60, { color: '#131132', roof: '#2c1a52' });
  markup += house(572, 174, 72, 64, { color: '#111131', windows: 2 });
  markup += bridge(320, 232, 150, 7);
  markup += lanternString(8, 104, 322, 116, 8, ['#ffb24b', '#ff4d9d', '#ff8a3d']);
  markup += lanternString(344, 116, 636, 104, 8, ['#35d8cf', '#ffb24b', '#ff86b4']);
  const spots = [[82, 152], [208, 140], [300, 166], [386, 148], [472, 160], [586, 144]];
  spots.forEach(([x, y], i) => {
    markup += `<g class="float-lantern" style="animation-delay:${i * -0.7}s">${lantern(x, y, 0.6 + (i % 3) * 0.12, [ '#ffb24b', '#ff4d9d', '#ff8a3d', '#ff86b4' ][i % 4])}</g>`;
  });
  markup += waves(88, 24, 250, 356);
  markup += reflection(508, 252, 36, 96, '#fff0c2', 0.32);
  markup += reflection(208, 296, 40, 56, '#ff9b52', 0.24);
  markup += reflection(472, 300, 34, 52, '#ff5ca8', 0.24);
  markup += boat(196, 306, 0.62, { sail: '#ff7a9e' }) + boat(480, 320, 0.56, { sail: '#ffb24b', flag: '#35d8cf' });
  markup += `<path d="M0 352H640" stroke="#35d8cf" stroke-width="1" opacity="0.3"/>`;
  markup += '</svg>';
  container.innerHTML = markup;
}

function starRow(count) {
  return `<span class="stars">${'★'.repeat(count)}${'☆'.repeat(3 - count)}</span>`;
}

export function renderSelect(container, save, onPick, onBack) {
  const cards = LEVELS.map((level, i) => {
    const locked = i + 1 > save.unlocked;
    const stars = Number(save.stars[String(i + 1)]) || 0;
    const best = Number(save.bestScore[String(i + 1)]) || 0;
    return `<button class="level-card${locked ? ' locked' : ''}" data-level="${i}" ${locked ? 'disabled' : ''}>
      <span class="level-num">0${i + 1}</span>
      <span class="level-card-name">${level.name}</span>
      <span class="level-card-sub">${level.subtitle}</span>
      <span class="level-card-meta">${locked ? 'LOCKED' : `${level.differences.length} differences`}</span>
      <span class="level-card-bottom">${starRow(stars)}<span class="best">${best ? best.toLocaleString('en-US') : '—'}</span></span>
    </button>`;
  }).join('');
  container.innerHTML = `<div class="select-inner">
    <div class="section-kicker">Choose a scene</div>
    <h1>Lantern Trail</h1>
    <p class="select-help">Every scene hides changes. Find them all before the lantern light fades.</p>
    <div class="level-grid">${cards}</div>
    <button class="text-btn" id="select-back">← Back to title</button>
  </div>`;
  container.querySelectorAll('.level-card:not(.locked)').forEach((card) => {
    card.addEventListener('click', () => onPick(Number(card.dataset.level)));
  });
  $('select-back').addEventListener('click', onBack);
}

function modalShell(inner, extraClass = '') {
  return `<div class="modal-backdrop ${extraClass}"><div class="modal-card">${inner}</div></div>`;
}

export function renderModal(container, kind, data = {}) {
  if (kind === 'complete') {
    const level = LEVELS[data.levelIndex];
    const next = data.levelIndex + 1 < LEVELS.length;
    container.innerHTML = modalShell(`<div class="section-kicker">Scene cleared</div>
      <h2>${level.name}</h2>
      <div class="modal-stars">${starRow(data.stars)}</div>
      <p class="modal-line">${data.differences} differences found · ${data.misses} misses</p>
      <div class="modal-score"><span>Score</span><strong>${data.score.toLocaleString('en-US')}</strong></div>
      <div class="modal-score"><span>Time bonus</span><strong>+${data.timeBonus.toLocaleString('en-US')}</strong></div>
      <div class="modal-actions">
        ${next ? '<button class="primary-btn" data-action="next">Next scene →</button>' : '<button class="primary-btn" data-action="finale">See the festival →</button>'}
        <button class="ghost-btn" data-action="select">Scene select</button>
      </div>`, 'complete-modal');
  } else if (kind === 'gameover') {
    container.innerHTML = modalShell(`<div class="section-kicker danger-text">The lanterns went out</div>
      <h2>Time's up</h2>
      <p class="modal-line">${data.remaining} difference${data.remaining === 1 ? '' : 's'} still hidden. The dashed rings show where.</p>
      <div class="modal-actions">
        <button class="primary-btn" data-action="retry">Try again</button>
        <button class="ghost-btn" data-action="select">Scene select</button>
      </div>`, 'gameover-modal');
  } else if (kind === 'finale') {
    container.innerHTML = modalShell(`<div class="section-kicker">The festival is yours</div>
      <h2>Twin Lanterns</h2>
      <p class="modal-line">You studied every lantern, kite and reflection along the river. Six scenes, all alight.</p>
      <div class="finale-stars">${starRow(data.totalStars)} <span>${data.totalStars} / 18</span></div>
      <div class="modal-score"><span>Final score</span><strong>${data.finalScore.toLocaleString('en-US')}</strong></div>
      <div class="modal-actions">
        <button class="primary-btn" data-action="select">Play again</button>
      </div>`, 'finale-modal');
  } else if (kind === 'pause') {
    container.innerHTML = modalShell(`<div class="section-kicker">A quiet moment</div>
      <h2>Paused</h2>
      <div class="controls-list">
        <span>Click / Enter</span><span>mark a difference</span>
        <span>Arrows / Tab</span><span>move the crosshair</span>
        <span>H</span><span>use a hint</span>
        <span>Z</span><span>toggle the 2× lens</span>
        <span>M</span><span>mute or unmute</span>
      </div>
      <div class="modal-actions">
        <button class="primary-btn" data-action="resume">Resume</button>
        <button class="ghost-btn" data-action="retry">Restart scene</button>
        <button class="ghost-btn" data-action="select">Scene select</button>
      </div>`, 'pause-modal');
  }
  container.classList.remove('hidden');
}

export function hideModal(container) {
  container.classList.add('hidden');
  container.replaceChildren();
}

export function modalAction(event) {
  const button = event.target.closest('[data-action]');
  return button ? button.dataset.action : null;
}

export { W, H };
