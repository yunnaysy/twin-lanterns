import { LEVELS } from './scenes/index.js';
import { applyDifferences } from './differences.js';
import { findHit, clampCrosshair } from './hitTest.js';
import { createTimer } from './timer.js';
import { findPoints, timeBonus, starsFor } from './scoring.js';
import * as audio from './audio.js';
import * as storage from './storage.js';
import { updateHud } from './hud.js';
import { clearFx, foundMarker, missMarker, hintMarker, debugOutline, revealMarker } from './markers.js';
import { initMagnifier, refreshMagnifier, setMagnifierEnabled, magnifierEnabled, updateMagnifier } from './magnifier.js';
import { setScreen, setStatus, renderTitleArt, renderSelect, renderModal, hideModal, modalAction } from './screens.js';
import { initInput } from './input.js';
import { applyShot } from './shot.js';
import { W, H } from './sceneKit.js';

const $ = (id) => document.getElementById(id);
const panels = [$('panel-a'), $('panel-b')];
const fx = [$('fx-a'), $('fx-b')];
const crosses = [$('cross-a'), $('cross-b')];
const lenses = [$('lens-a'), $('lens-b')];
const modal = $('modal');
const query = new URLSearchParams(location.search);
const debug = query.get('debug') === '1';

const state = {
  screen: 'title',
  levelIndex: 0,
  scene: null,
  found: new Set(),
  score: 0,
  levelScore: 0,
  combo: 0,
  lastFind: 0,
  misses: 0,
  missTimes: [],
  hintsLeft: 3,
  hintCooldown: 0,
  timer: null,
  paused: false,
  muted: false,
  lens: false,
  crosshair: { x: 320, y: 280 },
  inputMode: 'mouse',
  lockUntil: 0,
  save: storage.load(),
  shotMode: false,
  earnedStars: {},
};

function showScreen(name) {
  state.screen = name;
  setScreen(name);
  if (name !== 'hunt') hideModal(modal);
}

function renderPanels() {
  if (!state.scene) return;
  const { markup } = applyDifferences(state.scene, state.found);
  for (const panel of panels) panel.innerHTML = `<svg class="scene" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">${markup}</svg>`;
  refreshMagnifier();
}

function updateCrosshairs() {
  const visible = state.inputMode === 'keyboard' && state.screen === 'hunt';
  for (const cross of crosses) {
    cross.classList.toggle('visible', visible);
    cross.style.left = `${(state.crosshair.x / W) * 100}%`;
    cross.style.top = `${(state.crosshair.y / H) * 100}%`;
  }
}

function startLevel(index, options = {}) {
  state.levelIndex = Math.max(0, Math.min(LEVELS.length - 1, index | 0));
  state.scene = LEVELS[state.levelIndex];
  state.found = new Set();
  state.levelScore = 0;
  state.combo = 0;
  state.lastFind = 0;
  state.misses = 0;
  state.missTimes = [];
  state.hintsLeft = 3;
  state.hintCooldown = 0;
  state.paused = false;
  state.lockUntil = 0;
  state.timer = createTimer(state.scene.time, onTimeout);
  clearFx(fx);
  if (debug) debugOutline(fx, state.scene.differences);
  renderPanels();
  showScreen('hunt');
  updateCrosshairs();
  updateHud(state);
  setStatus(`${state.scene.name}. ${state.scene.differences.length} differences to find.`);
  if (options.silentScore) state.score = state.save.bestScore[String(state.levelIndex)] || 0;
}

function goSelect() {
  renderSelect($('select'), state.save, (index) => startLevel(index), () => showScreen('title'));
  showScreen('select');
  setStatus('Level select. Press 1 to 6 to choose an unlocked scene.');
}

function onTimeout() {
  if (state.screen !== 'hunt') return;
  audio.gameOverSound();
  const remaining = state.scene.differences.filter((diff) => !state.found.has(diff.id));
  remaining.forEach((diff) => revealMarker(fx, diff));
  renderModal(modal, 'gameover', { remaining: remaining.length });
  setStatus(`Time is up. ${remaining.length} differences remaining.`);
}

function finishLevel(instant = false) {
  if (!state.timer) return;
  state.timer.running = false;
  const bonus = timeBonus(state.timer.remaining);
  state.levelScore += bonus;
  state.score += bonus;
  const stars = starsFor(state.timer.remaining, state.timer.max, state.misses);
  state.earnedStars[state.levelIndex + 1] = stars;
  storage.recordLevel(state.save, state.levelIndex, state.levelScore, stars);
  audio.fanfare();
  const payload = {
    levelIndex: state.levelIndex,
    score: state.levelScore,
    timeBonus: bonus,
    misses: state.misses,
    stars,
    differences: state.scene.differences.length,
  };
  setStatus(`${state.scene.name} cleared with ${stars} stars.`);
  if (instant) renderModal(modal, 'complete', payload);
  else setTimeout(() => {
    if (state.screen === 'hunt' && state.found.size === state.scene.differences.length) renderModal(modal, 'complete', payload);
  }, 650);
}

function clickAt(point, panelIndex = 0) {
  if (state.screen !== 'hunt' || state.paused || !state.timer || !state.timer.running) return null;
  if (performance.now() < state.lockUntil) return null;
  const diff = findHit(state.scene.differences, state.found, point.x, point.y);
  if (!diff) {
    const alreadyFound = state.scene.differences.some((d) => state.found.has(d.id) && Math.hypot(d.x - point.x, d.y - point.y) <= d.r);
    if (alreadyFound) return null;
    state.misses++;
    state.combo = 0;
    state.timer.penalty(5);
    missMarker(fx, point.x, point.y);
    const wrap = panels[panelIndex]?.parentElement;
    if (wrap) {
      wrap.classList.remove('shake');
      void wrap.offsetWidth;
      wrap.classList.add('shake');
      setTimeout(() => wrap.classList.remove('shake'), 400);
    }
    audio.thud();
    const now = performance.now();
    state.missTimes = state.missTimes.filter((t) => now - t < 2500);
    state.missTimes.push(now);
    if (state.missTimes.length >= 3) {
      state.lockUntil = now + 900;
      state.missTimes = [];
    }
    updateHud(state);
    setStatus(`Miss. Five seconds lost. ${state.scene.differences.length - state.found.size} left.`);
    return null;
  }
  state.found.add(diff.id);
  const now = performance.now();
  state.combo = now - state.lastFind < 5000 ? state.combo + 1 : 1;
  state.lastFind = now;
  const points = findPoints(state.combo);
  foundMarker(fx, diff, true, points);
  state.levelScore += points;
  state.score += points;
  audio.chime(state.combo);
  renderPanels();
  updateHud(state);
  setStatus(`${diff.label}. ${state.scene.differences.length - state.found.size} left.`);
  if (state.found.size === state.scene.differences.length) finishLevel();
  return diff;
}

function markFound(id, animate = false) {
  const diff = state.scene?.differences.find((d) => d.id === id);
  if (!diff || state.found.has(id)) return false;
  state.found.add(id);
  foundMarker(fx, diff, animate);
  state.combo += 1;
  state.lastFind = performance.now();
  const points = findPoints(state.combo);
  state.levelScore += points;
  state.score += points;
  renderPanels();
  updateHud(state);
  return true;
}

function useHint(forceFirst = false) {
  if (state.screen !== 'hunt' || state.paused || state.hintsLeft <= 0 || state.hintCooldown > 0) return false;
  const remaining = state.scene.differences.filter((diff) => !state.found.has(diff.id));
  if (!remaining.length) return false;
  const diff = forceFirst ? remaining[0] : remaining[Math.floor(Math.random() * remaining.length)];
  state.hintsLeft--;
  state.hintCooldown = 4;
  hintMarker(fx, diff);
  audio.hintSound();
  updateHud(state);
  setStatus('Hint: look inside the glowing circle.');
  return true;
}

function togglePause() {
  if (state.screen !== 'hunt') return;
  state.paused = !state.paused;
  state.timer.paused = state.paused;
  if (state.paused) renderModal(modal, 'pause');
  else hideModal(modal);
}

function toggleMute() {
  state.muted = !state.muted;
  audio.setMuted(state.muted);
  updateHud(state);
}

function toggleLens() {
  state.lens = setMagnifierEnabled(!magnifierEnabled());
  updateHud(state);
}

function handleModalAction(action) {
  if (action === 'next') startLevel(state.levelIndex + 1);
  else if (action === 'retry') startLevel(state.levelIndex);
  else if (action === 'select' || action === 'finale') {
    if (action === 'finale') {
      renderModal(modal, 'finale', {
        totalStars: Object.values(state.earnedStars).reduce((a, b) => a + b, 0),
        finalScore: state.score,
      });
      modal.dataset.finale = '1';
    } else goSelect();
  } else if (action === 'resume') togglePause();
}

function moveCrosshair(dx, dy) {
  state.inputMode = 'keyboard';
  state.crosshair = clampCrosshair(state.crosshair.x + dx, state.crosshair.y + dy);
  updateCrosshairs();
}

function onKey(key, event = {}) {
  if (key === 'm' || key === 'M') return toggleMute();
  if (key === 'Escape' || key === 'p' || key === 'P') {
    if (state.screen === 'hunt') return togglePause();
    if (state.screen === 'select') return showScreen('title');
    return;
  }
  if (state.screen === 'title' && (key === 'Enter' || key === ' ')) return goSelect();
  if (state.screen === 'select') {
    if (/^[1-6]$/.test(key)) {
      const index = Number(key) - 1;
      if (index + 1 <= state.save.unlocked) startLevel(index);
      return;
    }
    if (key === 'Enter') return startLevel(Math.min(state.save.unlocked - 1, LEVELS.length - 1));
    return;
  }
  if (!modal.classList.contains('hidden') && (key === 'Enter' || key === ' ')) {
    const first = modal.querySelector('.primary-btn');
    if (first) handleModalAction(first.dataset.action);
    return;
  }
  if (state.screen !== 'hunt') return;
  if (key === 'h' || key === 'H') return useHint();
  if (key === 'z' || key === 'Z') return toggleLens();
  if (key === 'ArrowLeft' || key === 'Tab') return moveCrosshair(key === 'Tab' && event.shiftKey ? -32 : -14, 0);
  if (key === 'ArrowRight') return moveCrosshair(14, 0);
  if (key === 'ArrowUp') return moveCrosshair(0, -14);
  if (key === 'ArrowDown') return moveCrosshair(0, 14);
  if (key === 'Enter' || key === ' ') clickAt(state.crosshair, state.inputMode === 'keyboard' ? 0 : 1);
}

const api = {
  levels: LEVELS.map((level) => ({
    id: level.id,
    name: level.name,
    differences: level.differences.map(({ id, kind, target, x, y, r, label }) => ({ id, kind, target, x, y, r, label })),
  })),
  get state() {
    return {
      screen: state.screen,
      levelIndex: state.levelIndex,
      levelName: state.scene?.name,
      remaining: state.scene ? state.scene.differences.length - state.found.size : 0,
      found: [...state.found],
      timeLeft: state.timer?.remaining ?? 0,
      timeMax: state.timer?.max ?? 0,
      score: state.score,
      misses: state.misses,
      hintsLeft: state.hintsLeft,
      paused: state.paused,
      locked: performance.now() < state.lockUntil,
      modal: modal.firstElementChild ? modal.firstElementChild.className : '',
    };
  },
  startLevel,
  goSelect,
  clickAt,
  findDiff(id) {
    const diff = state.scene?.differences.find((d) => d.id === id);
    return diff ? clickAt({ x: diff.x, y: diff.y }) : null;
  },
  missAt(x, y) {
    return clickAt({ x, y });
  },
  markFound,
  setTime(seconds) {
    if (state.timer) state.timer.remaining = seconds;
    updateHud(state);
  },
  hint: useHint,
  finishLevel,
  togglePause,
  toggleMute,
  toggleLens,
  resetSave() {
    state.save = { unlocked: 1, bestScore: {}, stars: {} };
    storage.save(state.save);
  },
  ready: true,
};
window.__twin = api;

renderTitleArt($('title-art'));
goSelect();
showScreen('title');
initMagnifier(panels, lenses);
initInput(panels, {
  onPanelClick: (point, index) => clickAt(point, index),
  onPanelMove: (clientX, clientY) => updateMagnifier(clientX, clientY),
  onPanelLeave: () => updateMagnifier(-1, -1),
  onKey,
  onBlur: () => {
    if (state.screen === 'hunt' && !state.paused && state.timer?.running) togglePause();
  },
});

$('play-btn').addEventListener('click', goSelect);
$('levels-btn').addEventListener('click', goSelect);
$('hint-btn').addEventListener('click', () => useHint());
$('pause-btn').addEventListener('click', togglePause);
$('mute-btn').addEventListener('click', toggleMute);
$('lens-btn').addEventListener('click', toggleLens);
modal.addEventListener('click', (event) => {
  const action = modalAction(event);
  if (action) handleModalAction(action);
});

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (state.screen === 'hunt' && !state.paused) {
    if (state.timer?.running) state.timer.update(dt);
    if (state.hintCooldown > 0) state.hintCooldown = Math.max(0, state.hintCooldown - dt);
    updateHud(state);
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

if (query.has('shot')) {
  state.shotMode = true;
  applyShot(query, api);
}
