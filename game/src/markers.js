import { C, n } from './sceneKit.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

function el(tag, attrs = {}) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  return node;
}

function both(fx, build) {
  return fx.map((svg) => {
    if (!svg) return null;
    const node = build();
    svg.appendChild(node);
    return node;
  });
}

export function clearFx(fx) {
  for (const svg of fx) if (svg) svg.replaceChildren();
}

export function foundMarker(fx, diff, animate = true, points = 0) {
  const { x, y } = diff;
  const r = Math.max(11, Math.min(18, diff.r * 0.82));
  const nodes = both(fx, () => {
    const group = el('g', { class: `found-marker${animate ? ' anim' : ''}` });
    group.appendChild(el('circle', { cx: x, cy: y, r: r + 5, class: 'found-aura' }));
    group.appendChild(el('circle', { cx: x, cy: y, r, class: 'found-ring' }));
    group.appendChild(el('circle', { cx: x, cy: y, r: r - 4, class: 'found-inner' }));
    group.appendChild(el('circle', { cx: x, cy: y, r: 2.2, class: 'found-core' }));
    const sparkles = el('g', { class: 'sparks' });
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      const reach = 14 + (i % 3) * 5;
      sparkles.appendChild(el('circle', {
        cx: x + Math.cos(a) * (r + 2),
        cy: y + Math.sin(a) * (r + 2),
        r: i % 2 ? 1.1 : 1.7,
        fill: i % 3 === 0 ? C.rose : C.amber,
        class: 'spark',
        style: `--dx:${n(Math.cos(a) * reach)}px;--dy:${n(Math.sin(a) * reach)}px;animation-delay:${(i % 4) * 0.035}s`,
      }));
    }
    group.appendChild(sparkles);
    if (animate && points > 0) {
      const label = el('text', { x, y: y - r - 9, class: 'points-label' });
      label.textContent = `+${points}`;
      group.appendChild(label);
    }
    return group;
  });
  if (animate) setTimeout(() => nodes.forEach((node) => node?.querySelector('.sparks')?.remove()), 900);
}

export function missMarker(fx, x, y) {
  const nodes = both(fx, () => {
    const group = el('g', { class: 'miss-marker' });
    group.appendChild(el('circle', { cx: x, cy: y, r: 17, class: 'miss-halo' }));
    group.appendChild(el('path', { d: `M${x - 7} ${y - 7}L${x + 7} ${y + 7}M${x + 7} ${y - 7}L${x - 7} ${y + 7}`, class: 'miss-cross' }));
    return group;
  });
  setTimeout(() => nodes.forEach((node) => node?.remove()), 700);
}

export function hintMarker(fx, diff) {
  const r = Math.max(28, diff.r * 1.9);
  const nodes = both(fx, () => {
    const group = el('g', { class: 'hint-marker' });
    group.appendChild(el('circle', { cx: diff.x, cy: diff.y, r, class: 'hint-glow' }));
    group.appendChild(el('circle', { cx: diff.x, cy: diff.y, r: r * 0.58, class: 'hint-ring' }));
    return group;
  });
  setTimeout(() => nodes.forEach((node) => node?.remove()), 3600);
  return nodes;
}

export function debugOutline(fx, differences) {
  both(fx, () => {
    const group = el('g', { class: 'debug-layer' });
    for (const diff of differences) {
      group.appendChild(el('circle', { cx: diff.x, cy: diff.y, r: diff.r, class: 'debug-circle' }));
      const label = el('text', { x: diff.x, y: diff.y - diff.r - 3, class: 'debug-label' });
      label.textContent = diff.id + ':' + diff.target;
      group.appendChild(label);
    }
    return group;
  });
}

export function revealMarker(fx, diff) {
  both(fx, () => {
    const group = el('g', { class: 'reveal-marker' });
    group.appendChild(el('circle', { cx: diff.x, cy: diff.y, r: Math.max(14, diff.r), class: 'reveal-ring' }));
    group.appendChild(el('circle', { cx: diff.x, cy: diff.y, r: 3, class: 'reveal-dot' }));
    return group;
  });
}
