import { W, H } from './sceneKit.js';

export function scenePoint(event, element) {
  const rect = element.getBoundingClientRect();
  const scale = Math.min(rect.width / W, rect.height / H);
  const offsetX = (rect.width - W * scale) / 2;
  const offsetY = (rect.height - H * scale) / 2;
  return {
    x: Math.max(0, Math.min(W, (event.clientX - rect.left - offsetX) / scale)),
    y: Math.max(0, Math.min(H, (event.clientY - rect.top - offsetY) / scale)),
  };
}

export function findHit(differences, found, x, y) {
  let best = null;
  let bestDistance = Infinity;
  for (const diff of differences) {
    if (found.has(diff.id)) continue;
    const dx = x - diff.x;
    const dy = y - diff.y;
    const distance = Math.hypot(dx, dy);
    if (distance <= diff.r && distance < bestDistance) {
      best = diff;
      bestDistance = distance;
    }
  }
  return best;
}

export function clampCrosshair(x, y) {
  return {
    x: Math.max(8, Math.min(W - 8, x)),
    y: Math.max(8, Math.min(H - 8, y)),
  };
}
