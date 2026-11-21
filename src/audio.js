let context = null;
let muted = false;

function ctx() {
  if (muted) return null;
  if (!context) {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return null;
    context = new Audio();
  }
  if (context.state === 'suspended') context.resume().catch(() => {});
  return context;
}

function tone(freq, start, duration, type = 'sine', volume = 0.12, sweep = null) {
  const audio = ctx();
  if (!audio) return;
  const now = audio.currentTime + start;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (sweep) osc.frequency.exponentialRampToValueAtTime(sweep, now + duration);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain).connect(audio.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}

export function chime(combo = 0) {
  const lift = Math.min(6, combo) * 45;
  tone(784 + lift, 0, 0.26, 'sine', 0.1);
  tone(1046 + lift, 0.06, 0.32, 'sine', 0.08);
  tone(1568 + lift, 0.13, 0.34, 'triangle', 0.045);
}

export function thud() {
  tone(148, 0, 0.2, 'sawtooth', 0.07, 58);
  tone(84, 0.02, 0.16, 'sine', 0.08, 42);
}

export function hintSound() {
  tone(620, 0, 0.18, 'sine', 0.055, 880);
  tone(930, 0.09, 0.24, 'sine', 0.04);
}

export function fanfare() {
  [523, 659, 784, 1046].forEach((freq, i) => tone(freq, i * 0.12, 0.42, 'triangle', 0.09));
}

export function gameOverSound() {
  [440, 370, 294].forEach((freq, i) => tone(freq, i * 0.18, 0.4, 'sine', 0.08));
}

export function unlock() {
  ctx();
}
