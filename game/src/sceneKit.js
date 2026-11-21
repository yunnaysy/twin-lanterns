export const W = 640;
export const H = 560;

export const C = {
  night: '#080d24',
  deep: '#0c1638',
  indigo: '#17245c',
  violet: '#33275f',
  plum: '#4a2455',
  teal: '#35d8cf',
  tealDim: '#1d8f9c',
  amber: '#ffb24b',
  orange: '#ff7a3d',
  magenta: '#ff4d9d',
  rose: '#ff86b4',
  white: '#f5fbff',
  ink: '#050818',
  water: '#0b1c40',
  jade: '#5be0a8',
};

export function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export const n = (v) => Math.round(v * 10) / 10;

export function star(x, y, r = 1.2, op = 0.9) {
  const sparkle = r > 1.6 ? `<path d="M${n(x - r * 3)} ${n(y)}H${n(x + r * 3)}M${x} ${n(y - r * 3)}V${n(y + r * 3)}" stroke="#ffffff" stroke-width="0.5" opacity="0.45"/>` : '';
  return `<g><circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="#ffffff" opacity="${op}"/>${sparkle}</g>`;
}

export function starField(seed, count = 26, fromY = 8, toY = 150) {
  const r = rng(seed);
  let out = '';
  for (let i = 0; i < count; i++) {
    const x = 12 + r() * (W - 24);
    const y = fromY + r() * (toY - fromY);
    const rad = r() > 0.86 ? 2.1 : 0.7 + r() * 0.9;
    out += star(x, y, rad, 0.5 + r() * 0.5);
  }
  return out;
}

export function backdrop(top = '#070b22', mid = '#1b2a63', horizon = '#56316c') {
  const r = rng(717);
  let shimmer = '';
  for (let i = 0; i < 96; i++) {
    const x = 4 + r() * 630;
    const y = 250 + r() * (H - 262);
    const w = 7 + r() * 46;
    const deep = y > 380;
    shimmer += `<path d="M${n(x)} ${n(y)}h${n(w)}" stroke="${r() > 0.74 ? '#9bd8ee' : '#547cbb'}" stroke-width="${n(0.5 + r() * 0.8)}" opacity="${n((deep ? 0.06 : 0.1) + r() * 0.2)}"/>`;
  }
  let skyLights = '';
  const spots = [[58, 78], [242, 52], [388, 88], [604, 62]];
  spots.forEach(([x, y], i) => {
    skyLights += `<g opacity="0.75"><ellipse cx="${n(x)}" cy="${n(y)}" rx="12" ry="13" fill="url(#lanternHalo)" opacity="0.55"/><path d="M${n(x - 2.6)} ${n(y - 3)}h${n(5.2)}l1 6h-7.2z" fill="${[C.amber, C.rose, C.orange, C.magenta][i]}" opacity="0.8"/><path d="M${n(x)} ${n(y + 3)}v3" stroke="#e9b579" stroke-width="0.6"/></g>`;
  });
  let distant = '';
  for (let i = 0; i < 11; i++) {
    const x = 12 + i * 60 + r() * 16;
    const y = 218 + r() * 14;
    const w = 18 + r() * 20;
    const roofColor = i % 3 === 0 ? '#332050' : '#1e1542';
    distant += `<g opacity="0.62"><rect x="${n(x)}" y="${n(y - 13)}" width="${n(w)}" height="13" fill="#0c1030"/><path d="M${n(x - 5)} ${n(y - 13)}h${n(w + 10)}l-4 -6h-${n(w + 2)}z" fill="${roofColor}"/>${i % 4 === 0 ? `<rect x="${n(x + w * 0.3)}" y="${n(y - 9)}" width="2" height="3" fill="${C.amber}" opacity="0.5"/>` : ''}</g>`;
  }
  let deep = '';
  for (let i = 0; i < 18; i++) {
    const x = 30 + r() * 580;
    const y = 300 + r() * (H - 320);
    const rw = 12 + r() * 40;
    deep += `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(rw)}" ry="${n(1.5 + r() * 2.5)}" fill="none" stroke="${r() > 0.6 ? '#7cc9de' : '#4d76b4'}" stroke-width="0.7" opacity="${n(0.06 + r() * 0.14)}"/>`;
  }
  const glowColumns = [[122, C.rose], [318, C.amber], [516, C.teal]].map(([x, color], i) => {
    let streaks = '';
    for (let k = 0; k < 26; k++) {
      const y = 262 + k * 10.5 + r() * 5;
      const w = (6 + r() * 18) * (1 - k * 0.012);
      streaks += `<rect x="${n(x - w / 2 + (r() - 0.5) * 9)}" y="${n(y)}" width="${n(w)}" height="${n(0.8 + r() * 1.6)}" rx="1" fill="${color}" opacity="${n(0.03 + r() * 0.09)}"/>`;
    }
    return `<g opacity="${i === 1 ? 0.9 : 0.6}">${streaks}</g>`;
  }).join('');
  return `<g>
    <rect width="${W}" height="${H}" fill="url(#skyGrad)"/>
    <ellipse cx="${n(320)}" cy="150" rx="360" ry="130" fill="${horizon}" opacity="0.12"/>
    ${skyLights}
    <path d="M0 186 Q70 150 140 180 T280 166 T430 184 T640 158 L640 270 L0 270Z" fill="${mid}" opacity="0.38"/>
    <path d="M0 208 Q100 178 190 204 Q280 230 370 200 Q470 168 560 202 Q610 220 640 204 L640 280 L0 280Z" fill="${horizon}" opacity="0.34"/>
    ${distant}
    <path d="M0 232 Q110 216 230 236 Q370 256 490 232 Q580 216 640 234 L640 ${H} L0 ${H}Z" fill="url(#waterGrad)"/>
    <ellipse cx="320" cy="238" rx="350" ry="13" fill="#9d7bdc" opacity="0.1"/>
    <ellipse cx="320" cy="272" rx="360" ry="30" fill="url(#hazeGrad)" opacity="0.32"/>
    <ellipse cx="320" cy="404" rx="360" ry="52" fill="url(#hazeGrad)" opacity="0.16"/>
    ${glowColumns}${shimmer}${deep}
  </g>`;
}

export function moon(x, y, r = 27) {
  return `<g>
    <circle cx="${n(x)}" cy="${n(y)}" r="${n(r * 2.5)}" fill="url(#moonHalo)" opacity="0.75"/>
    <circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="#fff6da"/>
    <circle cx="${n(x - r * 0.3)}" cy="${n(y - r * 0.18)}" r="${n(r * 0.17)}" fill="#e6d7b2" opacity="0.55"/>
    <circle cx="${n(x + r * 0.34)}" cy="${n(y + r * 0.32)}" r="${n(r * 0.12)}" fill="#e6d7b2" opacity="0.45"/>
    <circle cx="${n(x + r * 0.18)}" cy="${n(y - r * 0.45)}" r="${n(r * 0.09)}" fill="#e6d7b2" opacity="0.4"/>
  </g>`;
}

export function cloud(x, y, w = 90, op = 0.18) {
  return `<g fill="#bfa1e8" opacity="${op}">
    <ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(w * 0.36)}" ry="6"/>
    <ellipse cx="${n(x + w * 0.18)}" cy="${n(y - 4)}" rx="${n(w * 0.22)}" ry="5"/>
    <ellipse cx="${n(x - w * 0.2)}" cy="${n(y + 3)}" rx="${n(w * 0.2)}" ry="4"/>
  </g>`;
}

export function mountain(x, y, w, h, color = '#131c48') {
  return `<path d="M${n(x - w / 2)} ${n(y)} L${n(x - w * 0.18)} ${n(y - h * 0.72)} L${n(x + w * 0.05)} ${n(y - h)} L${n(x + w * 0.3)} ${n(y - h * 0.58)} L${n(x + w / 2)} ${n(y)}Z" fill="${color}"/>`;
}

export function waves(seed, count = 16, y0 = 250, y1 = 352) {
  const r = rng(seed);
  let out = '';
  for (let i = 0; i < count; i++) {
    const x = 8 + r() * 560;
    const y = y0 + r() * (y1 - y0);
    const w = 12 + r() * 58;
    const col = r() > 0.65 ? '#7fd8e8' : '#4a86b8';
    out += `<path d="M${n(x)} ${n(y)} q${n(w / 4)} -3 ${n(w / 2)} 0 t${n(w / 2)} 0" stroke="${col}" stroke-width="0.9" fill="none" opacity="${n(0.12 + r() * 0.3)}" stroke-linecap="round"/>`;
  }
  return out;
}

export function reflection(x, y, w, h, color = '#ffb24b', op = 0.35) {
  let out = '';
  const r = rng(Math.round(x * 31 + y));
  for (let i = 0; i < 7; i++) {
    const yy = y + (i * h) / 7;
    const ww = w * (0.55 + r() * 0.6) * (1 - i * 0.045);
    out += `<rect x="${n(x - ww / 2 + (r() - 0.5) * 5)}" y="${n(yy)}" width="${n(ww)}" height="${n(1 + r() * 1.6)}" rx="1" fill="${color}" opacity="${n(op * (1 - i * 0.1))}"/>`;
  }
  return `<g>${out}</g>`;
}

export function lantern(x, y, s = 1, color = C.amber, opts = {}) {
  const h = opts.hanging !== false;
  const cord = h ? `<path d="M${n(x)} ${n(y - 34 * s)}V${n(y - 12 * s)}" stroke="#9a8bb8" stroke-width="${n(0.9 * s)}"/>` : '';
  const ribs = opts.ribs === undefined ? 3 : opts.ribs;
  let ribLines = '';
  for (let i = 1; i <= ribs; i++) {
    const yy = y - 11 * s + (i * 20 * s) / (ribs + 1);
    ribLines += `<path d="M${n(x - 8 * s)} ${n(yy)}Q${n(x)} ${n(yy + 2 * s)} ${n(x + 8 * s)} ${n(yy)}" stroke="#7a2f3c" stroke-width="${n(0.6 * s)}" fill="none" opacity="0.7"/>`;
  }
  const glow = opts.lit === false ? '' : `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(19 * s)}" ry="${n(23 * s)}" fill="url(#lanternHalo)" opacity="0.75"/>`;
  const capColor = opts.cap || '#5c2748';
  return `<g>
    ${glow}${cord}
    <rect x="${n(x - 5 * s)}" y="${n(y - 14 * s)}" width="${n(10 * s)}" height="${n(3 * s)}" rx="1" fill="${capColor}"/>
    <path d="M${n(x - 6 * s)} ${n(y - 11 * s)} Q${n(x - 10 * s)} ${n(y)} ${n(x - 6 * s)} ${n(y + 11 * s)} Q${n(x)} ${n(y + 15 * s)} ${n(x + 6 * s)} ${n(y + 11 * s)} Q${n(x + 10 * s)} ${n(y)} ${n(x + 6 * s)} ${n(y - 11 * s)} Q${n(x)} ${n(y - 15 * s)} ${n(x - 6 * s)} ${n(y - 11 * s)}Z" fill="${color}" stroke="#ffdca1" stroke-width="${n(0.7 * s)}"/>
    ${ribLines}
    <rect x="${n(x - 5 * s)}" y="${n(y + 11 * s)}" width="${n(10 * s)}" height="${n(2.5 * s)}" rx="1" fill="${capColor}"/>
    <path d="M${n(x)} ${n(y + 13 * s)}v${n(7 * s)}" stroke="${color}" stroke-width="${n(1.4 * s)}"/>
    <circle cx="${n(x)}" cy="${n(y + 21 * s)}" r="${n(1.5 * s)}" fill="${color}"/>
  </g>`;
}

export function lanternString(x1, y1, x2, y2, count, colors = [C.amber, C.magenta, C.orange]) {
  let out = `<path d="M${n(x1)} ${n(y1)} Q${n((x1 + x2) / 2)} ${n(Math.max(y1, y2) + 16)} ${n(x2)} ${n(y2)}" stroke="#a99ac4" stroke-width="0.9" fill="none" opacity="0.8"/>`;
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    const x = x1 + (x2 - x1) * t;
    const sag = 16 * 4 * t * (1 - t);
    const y = y1 + (y2 - y1) * t + sag;
    out += lantern(x, y + 10, 0.42, colors[i % colors.length]);
  }
  return `<g>${out}</g>`;
}

export function roof(x, y, w, h = 14, color = '#2a1c46', edge = C.magenta) {
  return `<g>
    <path d="M${n(x - w / 2 - 6)} ${n(y)} Q${n(x - w / 2)} ${n(y - 3)} ${n(x - w * 0.32)} ${n(y - h)} L${n(x + w * 0.32)} ${n(y - h)} Q${n(x + w / 2)} ${n(y - 3)} ${n(x + w / 2 + 6)} ${n(y)}Z" fill="${color}" stroke="${edge}" stroke-width="1"/>
    <path d="M${n(x - w / 2 - 6)} ${n(y)}H${n(x + w / 2 + 6)}" stroke="${edge}" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M${n(x)} ${n(y - h)}V${n(y - h - 6)}" stroke="${edge}" stroke-width="1"/>
    <circle cx="${n(x)}" cy="${n(y - h - 7)}" r="1.8" fill="${C.amber}"/>
  </g>`;
}

export function house(x, y, w = 56, h = 44, opts = {}) {
  const color = opts.color || '#171436';
  const win = opts.windowColor || C.amber;
  const windows = opts.windows === undefined ? 2 : opts.windows;
  let wSvg = '';
  for (let i = 0; i < windows; i++) {
    const wx = x - w / 2 + 11 + (i * (w - 22)) / Math.max(1, windows - 1);
    wSvg += `<rect x="${n(wx - 5)}" y="${n(y + 8)}" width="10" height="12" rx="1" fill="${win}" opacity="0.88"/><path d="M${n(wx)} ${n(y + 8)}v12M${n(wx - 5)} ${n(y + 14)}h10" stroke="#3b1d3e" stroke-width="0.7"/>`;
  }
  return `<g>
    <rect x="${n(x - w / 2)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="${color}"/>
    <rect x="${n(x - w / 2)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="none" stroke="#4a2d63" stroke-width="0.8"/>
    ${wSvg}
    ${roof(x, y, w + 4, 13, opts.roof || '#281a4d', opts.edge || C.magenta)}
  </g>`;
}

export function pagoda(x, y, s = 1, tiers = 4, windowCount = 2) {
  let out = '';
  for (let i = 0; i < tiers; i++) {
    const yy = y - i * 27 * s;
    const w = (92 - i * 15) * s;
    out += `<rect x="${n(x - w * 0.34)}" y="${n(yy - 22 * s)}" width="${n(w * 0.68)}" height="${n(23 * s)}" fill="#1c153f" stroke="#52306e" stroke-width="0.7"/>`;
    for (let k = 0; k < windowCount; k++) {
      const wx = x + (k - (windowCount - 1) / 2) * 15 * s;
      out += `<rect x="${n(wx - 3.5 * s)}" y="${n(yy - 17 * s)}" width="${n(7 * s)}" height="${n(10 * s)}" rx="1" fill="${C.amber}" opacity="0.9"/>`;
    }
    out += roof(x, yy - 22 * s, w, 11 * s, '#34205a', i === tiers - 1 ? C.magenta : '#8e4fa8');
  }
  out += `<path d="M${n(x)} ${n(y - tiers * 27 * s - 22 * s)}v${n(-15 * s)}" stroke="${C.amber}" stroke-width="${n(1.4 * s)}"/><circle cx="${n(x)}" cy="${n(y - tiers * 27 * s - 38 * s)}" r="${n(3 * s)}" fill="${C.amber}"/>`;
  return `<g>${out}</g>`;
}

export function bridge(x, y, w = 150, rails = 7, color = '#38214f') {
  let out = `<path d="M${n(x - w / 2)} ${n(y + 18)} Q${n(x)} ${n(y - 30)} ${n(x + w / 2)} ${n(y + 18)} L${n(x + w / 2)} ${n(y + 24)} Q${n(x)} ${n(y - 22)} ${n(x - w / 2)} ${n(y + 24)}Z" fill="${color}" stroke="#8c4c9c" stroke-width="1"/>`;
  out += `<path d="M${n(x - w / 2)} ${n(y + 6)} Q${n(x)} ${n(y - 42)} ${n(x + w / 2)} ${n(y + 6)}" stroke="#d47bc0" stroke-width="1.8" fill="none"/>`;
  for (let i = 0; i <= rails; i++) {
    const t = i / rails;
    const px = x - w / 2 + w * t;
    const py = y + 6 - 48 * 4 * t * (1 - t) * 0.55;
    const top = py - 11;
    out += `<path d="M${n(px)} ${n(py)}V${n(top)}" stroke="#d47bc0" stroke-width="1.2"/><circle cx="${n(px)}" cy="${n(top)}" r="1.5" fill="${C.amber}"/>`;
  }
  return `<g>${out}</g>`;
}

export function boat(x, y, s = 1, opts = {}) {
  const sail = opts.sail || C.amber;
  const flag = opts.flag || C.magenta;
  return `<g>
    <path d="M${n(x - 24 * s)} ${n(y)}Q${n(x)} ${n(y + 13 * s)} ${n(x + 24 * s)} ${n(y)}L${n(x + 18 * s)} ${n(y + 6 * s)}Q${n(x)} ${n(y + 18 * s)} ${n(x - 18 * s)} ${n(y + 6 * s)}Z" fill="#22183f" stroke="#a05d96" stroke-width="0.9"/>
    <path d="M${n(x)} ${n(y - 2 * s)}V${n(y - 40 * s)}" stroke="#c8aad0" stroke-width="${n(1.3 * s)}"/>
    <path d="M${n(x + 1 * s)} ${n(y - 39 * s)}L${n(x + 22 * s)} ${n(y - 8 * s)}L${n(x + 1 * s)} ${n(y - 8 * s)}Z" fill="${sail}" opacity="0.92"/>
    <path d="M${n(x - 1 * s)} ${n(y - 32 * s)}L${n(x - 15 * s)} ${n(y - 8 * s)}H${n(x - 1 * s)}Z" fill="${flag}" opacity="0.75"/>
    ${opts.lantern === false ? '' : lantern(x + 17 * s, y - 9 * s, 0.3 * s, C.amber)}
    <path d="M${n(x - 20 * s)} ${n(y + 7 * s)}q20 5 40 0" stroke="#63a9d6" stroke-width="0.8" fill="none" opacity="0.5"/>
  </g>`;
}

export function person(x, y, s = 1, color = '#0d1028', hat = false) {
  return `<g fill="${color}">
    <circle cx="${n(x)}" cy="${n(y - 13 * s)}" r="${n(3.4 * s)}"/>
    <path d="M${n(x - 4 * s)} ${n(y - 9 * s)}Q${n(x)} ${n(y - 12 * s)} ${n(x + 4 * s)} ${n(y - 9 * s)}L${n(x + 5 * s)} ${n(y)}H${n(x - 5 * s)}Z"/>
    ${hat ? `<path d="M${n(x - 6 * s)} ${n(y - 15 * s)}q6 -5 12 0z" fill="#3b2452"/>` : ''}
  </g>`;
}

export function stall(x, y, s = 1, opts = {}) {
  const stripe = opts.stripe || C.magenta;
  const base = opts.base || '#ffd9a0';
  let awn = '';
  const stripes = opts.stripes === undefined ? 5 : opts.stripes;
  for (let i = 0; i < stripes; i++) {
    const w = 44 * s / stripes;
    awn += `<path d="M${n(x - 22 * s + i * w)} ${n(y - 26 * s)}h${n(w)}l${n(-2 * s)} ${n(10 * s)}h${n(w - 4 * s)}z" fill="${i % 2 ? stripe : base}" opacity="0.95"/>`;
  }
  return `<g>
    ${awn}
    <path d="M${n(x - 24 * s)} ${n(y - 26 * s)}h${n(48 * s)}" stroke="#ffd0e8" stroke-width="1.2"/>
    <path d="M${n(x - 22 * s)} ${n(y - 26 * s)}v${n(28 * s)}M${n(x + 22 * s)} ${n(y - 26 * s)}v${n(28 * s)}" stroke="#7b5aa0" stroke-width="${n(1.7 * s)}"/>
    <rect x="${n(x - 20 * s)}" y="${n(y - 2 * s)}" width="${n(40 * s)}" height="${n(4 * s)}" fill="#4b2b5f"/>
    <ellipse cx="${n(x - 9 * s)}" cy="${n(y - 4 * s)}" rx="${n(5 * s)}" ry="${n(2 * s)}" fill="${C.amber}"/>
    <ellipse cx="${n(x + 7 * s)}" cy="${n(y - 4 * s)}" rx="${n(5 * s)}" ry="${n(2 * s)}" fill="${C.rose}"/>
    <path d="M${n(x - 9 * s)} ${n(y - 8 * s)}q-2 -4 0 -7M${n(x - 9 * s)} ${n(y - 6 * s)}q3 -4 1 -8" stroke="#e8c7ff" stroke-width="0.8" fill="none" opacity="0.7"/>
  </g>`;
}

export function steam(x, y, s = 1, puffs = 2) {
  let out = '';
  for (let i = 0; i < puffs; i++) {
    const xx = x + (i - (puffs - 1) / 2) * 5 * s;
    out += `<path d="M${n(xx)} ${n(y)}q-3 -4 0 -7t0 -7" stroke="#d7c5ff" stroke-width="${n(1.1 * s)}" fill="none" opacity="0.6" stroke-linecap="round"/>`;
  }
  return `<g>${out}</g>`;
}

export function kite(x, y, s = 1, color = C.magenta) {
  return `<g>
    <path d="M${n(x)} ${n(y - 14 * s)}L${n(x + 11 * s)} ${n(y)}L${n(x)} ${n(y + 16 * s)}L${n(x - 11 * s)} ${n(y)}Z" fill="${color}" stroke="#ffe0f2" stroke-width="0.8"/>
    <path d="M${n(x)} ${n(y - 14 * s)}V${n(y + 16 * s)}M${n(x - 11 * s)} ${n(y)}H${n(x + 11 * s)}" stroke="#ffe0f2" stroke-width="0.6" opacity="0.8"/>
    <path d="M${n(x)} ${n(y + 16 * s)}q5 12 -2 20q8 -3 6 9" stroke="${color}" stroke-width="1" fill="none" opacity="0.8"/>
    <path d="M${n(x - 11 * s)} ${n(y)}q-10 5 -15 16" stroke="#ffd5e9" stroke-width="0.7" fill="none"/>
  </g>`;
}

export function fish(x, y, s = 1, color = C.teal, flip = false) {
  const d = flip ? -1 : 1;
  return `<g>
    <path d="M${n(x - 9 * s * d)} ${n(y)}q9 -6 18 0q-9 6 -18 0z" fill="${color}" opacity="0.95"/>
    <path d="M${n(x - 9 * s * d)} ${n(y)}l${n(-6 * s * d)} ${n(-4 * s)}v${n(8 * s)}z" fill="${color}" opacity="0.8"/>
    <circle cx="${n(x + 4 * s * d)}" cy="${n(y - s)}" r="${n(0.9 * s)}" fill="#fff"/>
    <path d="M${n(x - 3 * s * d)} ${n(y)}q4 -3 8 0" stroke="#fff" stroke-width="0.5" fill="none" opacity="0.6"/>
  </g>`;
}

export function lotus(x, y, s = 1, color = C.rose, petals = 5) {
  let out = '';
  for (let i = 0; i < petals; i++) {
    const a = -1.1 + (i * 2.2) / Math.max(1, petals - 1);
    out += `<path d="M${n(x)} ${n(y)}q${n(Math.sin(a) * 9 * s)} ${n(-10 * s)} ${n(Math.sin(a) * 12 * s)} ${n(-14 * s)}q${n(-Math.sin(a) * 5 * s)} ${n(8 * s)} ${n(-Math.sin(a) * 12 * s)} ${n(14 * s)}z" fill="${color}" opacity="0.9"/>`;
  }
  return `<g>${out}<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(13 * s)}" ry="${n(3 * s)}" fill="#1c7d76" opacity="0.8"/><path d="M${n(x)} ${n(y + 1 * s)}q${n(4 * s)} ${n(12 * s)} 0 ${n(20 * s)}" stroke="#248f7c" stroke-width="${n(1.2 * s)}" fill="none"/></g>`;
}

export function bird(x, y, s = 1) {
  return `<path d="M${n(x - 6 * s)} ${n(y)}q${n(3 * s)} ${n(-4 * s)} ${n(6 * s)} 0q${n(3 * s)} ${n(-4 * s)} ${n(6 * s)} 0" stroke="#e7d9ff" stroke-width="${n(1.2 * s)}" fill="none" stroke-linecap="round"/>`;
}

export function firework(x, y, r = 24, color = C.magenta, sparks = 12) {
  let out = `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r * 0.32)}" fill="${color}" opacity="0.18"/>`;
  for (let i = 0; i < sparks; i++) {
    const a = (i / sparks) * Math.PI * 2;
    const inner = r * 0.42;
    const outer = r * (0.86 + (i % 3) * 0.06);
    out += `<path d="M${n(x + Math.cos(a) * inner)} ${n(y + Math.sin(a) * inner)}L${n(x + Math.cos(a) * outer)} ${n(y + Math.sin(a) * outer)}" stroke="${i % 2 ? color : C.amber}" stroke-width="1.5" stroke-linecap="round" opacity="0.95"/><circle cx="${n(x + Math.cos(a) * (outer + 3))}" cy="${n(y + Math.sin(a) * (outer + 3))}" r="1.2" fill="${color}" opacity="0.8"/>`;
  }
  return `<g>${out}</g>`;
}

export function firefly(x, y, s = 1, color = C.jade) {
  return `<g><circle cx="${n(x)}" cy="${n(y)}" r="${n(4 * s)}" fill="${color}" opacity="0.16"/><circle cx="${n(x)}" cy="${n(y)}" r="${n(1.5 * s)}" fill="#eaffcf"/></g>`;
}

export function sign(x, y, s = 1, color = C.amber, rotated = false) {
  const g = rotated ? ` transform="rotate(12 ${n(x)} ${n(y)})"` : '';
  return `<g${g}>
    <rect x="${n(x - 9 * s)}" y="${n(y - 13 * s)}" width="${n(18 * s)}" height="${n(26 * s)}" rx="2" fill="#3a1c47" stroke="${color}" stroke-width="1.2"/>
    <path d="M${n(x - 4 * s)} ${n(y - 8 * s)}h${n(8 * s)}M${n(x)} ${n(y - 8 * s)}v${n(15 * s)}M${n(x - 5 * s)} ${n(y - 1 * s)}h${n(10 * s)}M${n(x - 4 * s)} ${n(y + 7 * s)}l${n(8 * s)} ${n(-3 * s)}" stroke="${color}" stroke-width="${n(1.5 * s)}" fill="none" stroke-linecap="round"/>
  </g>`;
}

export function posts(x1, x2, y, count = 5) {
  let out = '';
  for (let i = 0; i < count; i++) {
    const x = x1 + ((x2 - x1) * i) / Math.max(1, count - 1);
    out += `<path d="M${n(x)} ${n(y)}v-22" stroke="#3b2557" stroke-width="3"/><circle cx="${n(x)}" cy="${n(y - 23)}" r="2" fill="${C.amber}" opacity="0.9"/>`;
  }
  return `<g>${out}</g>`;
}

export function pier(x, y, w = 130) {
  return `<g>
    <rect x="${n(x - w / 2)}" y="${n(y)}" width="${n(w)}" height="7" fill="#2d1c45" stroke="#a35a9c" stroke-width="0.8"/>
    <path d="M${n(x - w / 2 + 8)} ${n(y + 7)}v14M${n(x - 8)} ${n(y + 7)}v18M${n(x + w / 2 - 8)} ${n(y + 7)}v14" stroke="#241736" stroke-width="4"/>
    ${posts(x - w / 2 + 4, x + w / 2 - 4, y, 7)}
  </g>`;
}

export function tree(x, y, s = 1) {
  return `<g fill="#120f30">
    <path d="M${n(x - 3 * s)} ${n(y)}h${n(6 * s)}l${n(-1 * s)} ${n(-30 * s)}h${n(-4 * s)}z"/>
    <ellipse cx="${n(x)}" cy="${n(y - 34 * s)}" rx="${n(15 * s)}" ry="${n(10 * s)}"/>
    <ellipse cx="${n(x - 10 * s)}" cy="${n(y - 28 * s)}" rx="${n(9 * s)}" ry="${n(7 * s)}"/>
    <ellipse cx="${n(x + 11 * s)}" cy="${n(y - 27 * s)}" rx="${n(8 * s)}" ry="${n(6 * s)}"/>
  </g>`;
}

export function cat(x, y, s = 1) {
  return `<g fill="#0b0d24">
    <path d="M${n(x - 5 * s)} ${n(y)}q0 -7 5 -7t5 7q0 -3 -2 -5l-1 -4l-2 4h-2l-2 -4l-1 4q-2 2 -2 5z"/>
    <path d="M${n(x + 4 * s)} ${n(y - 2 * s)}q7 -3 6 4" stroke="#0b0d24" stroke-width="${n(1.5 * s)}" fill="none"/>
    <circle cx="${n(x - 2 * s)}" cy="${n(y - 4 * s)}" r="${n(0.7 * s)}" fill="${C.amber}"/>
    <circle cx="${n(x + 2 * s)}" cy="${n(y - 4 * s)}" r="${n(0.7 * s)}" fill="${C.amber}"/>
  </g>`;
}

export function foreground(seed = 1) {
  const r = rng(seed);
  let reeds = '';
  for (let side = 0; side < 2; side++) {
    const base = side === 0 ? 10 : 630;
    for (let i = 0; i < 14; i++) {
      const x = base + (side === 0 ? 1 : -1) * i * 6;
      const height = 30 + r() * 60;
      const bend = (r() - 0.5) * 24;
      reeds += `<path d="M${n(x)} ${H}q${n(bend * 0.4)} ${n(-height * 0.6)} ${n(bend)} ${n(-height)}" stroke="#08132f" stroke-width="${n(1 + r() * 1.3)}" fill="none"/>`;
      if (i % 3 === 0) reeds += `<ellipse cx="${n(x + bend)}" cy="${n(H - height)}" rx="2" ry="6" fill="#0a1838" transform="rotate(${n(bend * 3)} ${n(x + bend)} ${n(H - height)})"/>`;
    }
  }
  let glints = '';
  for (let i = 0; i < 40; i++) {
    const x = 70 + r() * 500;
    const y = 292 + r() * (H - 300);
    glints += `<path d="M${n(x)} ${n(y)}h${n(4 + r() * 14)}" stroke="${r() > 0.82 ? '#ffc477' : '#79bdd8'}" stroke-width="0.7" opacity="${n(0.1 + r() * 0.2)}"/>`;
  }
  let pads = '';
  for (let i = 0; i < 7; i++) {
    const x = 84 + r() * 470;
    const y = 372 + r() * (H - 390);
    pads += `<g opacity="0.8"><ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(8 + r() * 10)}" ry="${n(2.5 + r() * 2)}" fill="#126e69"/><path d="M${n(x)} ${n(y)}l${n(6)} ${n(-3)}" stroke="#2cc1a0" stroke-width="0.7"/></g>`;
  }
  let swirls = '';
  for (let i = 0; i < 9; i++) {
    const x = 70 + r() * 500;
    const y = 340 + r() * (H - 360);
    swirls += `<path d="M${n(x - 12)} ${n(y)}q6 -6 12 0t12 0" stroke="#8fd4e4" stroke-width="0.8" fill="none" opacity="${n(0.1 + r() * 0.16)}"/>`;
  }
  return `<g>
    <ellipse cx="320" cy="${H - 8}" rx="310" ry="16" fill="#070f2b" opacity="0.5"/>
    <ellipse cx="320" cy="332" rx="340" ry="26" fill="url(#hazeGrad)" opacity="0.1"/>
    ${glints}${swirls}${pads}${reeds}
  </g>`;
}

export function balcony(x, y, w = 20, color = '#3a2154') {
  return `<g>
    <path d="M${n(x - w / 2)} ${n(y)}h${n(w)}" stroke="${color}" stroke-width="2.2"/>
    <path d="M${n(x - w / 2)} ${n(y - 9)}h${n(w)}" stroke="#b565a9" stroke-width="1"/>
    ${Array.from({ length: 5 }, (_, i) => `<path d="M${n(x - w / 2 + (i * w) / 4)} ${n(y)}v-9" stroke="#b565a9" stroke-width="0.9"/>`).join('')}
  </g>`;
}

export function banner(x, y, s = 1, color = C.magenta, variant = 0) {
  const glyphs = [
    'M-4 -5h8M0 -5v10M-4 0h8',
    'M-4 -5l4 10l4 -10M-4 1h8',
    'M-4 -5v10M4 -5v10M-4 -5h8M-4 1h8',
    'M0 -6l5 4l-5 5l-5 -5z',
  ][variant % 4];
  return `<g transform="translate(${n(x)} ${n(y)}) scale(${s})">
    <rect x="-8" y="-11" width="16" height="23" rx="2" fill="#2b1442" stroke="${color}" stroke-width="1"/>
    <path d="${glyphs}" stroke="${color}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <circle cx="0" cy="-13" r="1.6" fill="${C.amber}"/>
  </g>`;
}

export function bunting(x1, y1, x2, y2, count = 10, colors = [C.amber, C.magenta, C.teal, C.rose]) {
  let out = `<path d="M${n(x1)} ${n(y1)}Q${n((x1 + x2) / 2)} ${n(Math.max(y1, y2) + 12)} ${n(x2)} ${n(y2)}" stroke="#b7a3d4" stroke-width="0.8" fill="none" opacity="0.75"/>`;
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    const x = x1 + (x2 - x1) * t;
    const sag = 12 * 4 * t * (1 - t);
    const y = y1 + (y2 - y1) * t + sag;
    out += `<path d="M${n(x - 4)} ${n(y)}l8 0l-4 9z" fill="${colors[i % colors.length]}" opacity="0.8"/>`;
  }
  return `<g>${out}</g>`;
}

export function crowd(seed, y, count = 10, x0 = 30, x1 = 610) {
  const r = rng(seed);
  let out = '';
  for (let i = 0; i < count; i++) {
    const x = x0 + ((x1 - x0) * i) / Math.max(1, count - 1) + (r() - 0.5) * 14;
    const s = 0.65 + r() * 0.45;
    out += person(x, y + (r() - 0.5) * 6, s, i % 3 === 0 ? '#161034' : '#0b0e28', r() > 0.6);
    if (i % 4 === 1) out += lantern(x + 5 * s, y - 9 * s, 0.22 * s, C.amber);
  }
  return `<g>${out}</g>`;
}

export function boatWake(x, y, s = 1, color = C.amber) {
  let out = '';
  for (let i = 0; i < 9; i++) {
    const w = (8 + i * 2.4) * s;
    out += `<rect x="${n(x - w / 2)}" y="${n(y + i * 4.5 * s)}" width="${n(w)}" height="${n(0.9 * s)}" rx="1" fill="${color}" opacity="${n(0.24 - i * 0.02)}"/>`;
  }
  return `<g>${out}<path d="M${n(x - 18 * s)} ${n(y)}q18 5 36 0" stroke="#bfe6f2" stroke-width="${n(0.8 * s)}" fill="none" opacity="0.4"/></g>`;
}

export function waterLantern(x, y, s = 1, color = C.amber) {
  return `<g>
    <ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(9 * s)}" ry="${n(2.6 * s)}" fill="#0a1c3b"/>
    <path d="M${n(x - 5 * s)} ${n(y - 2 * s)}q5 ${n(-6 * s)} 10 0z" fill="${color}" opacity="0.9"/>
    <ellipse cx="${n(x)}" cy="${n(y - 1 * s)}" rx="${n(13 * s)}" ry="${n(7 * s)}" fill="url(#lanternHalo)" opacity="0.6"/>
    <path d="M${n(x - 16 * s)} ${n(y + 3 * s)}h${n(32 * s)}M${n(x - 11 * s)} ${n(y + 7 * s)}h${n(22 * s)}" stroke="${color}" stroke-width="0.8" opacity="0.25"/>
  </g>`;
}

export function facadeDetails(seed = 1, exclude = []) {
  const r = rng(seed);
  let out = '';
  let made = 0;
  for (let attempt = 0; attempt < 26 && made < 8; attempt++) {
    const x = 30 + r() * 580;
    const y = 190 + r() * 38;
    if (exclude.some(([ex, ey, er]) => Math.hypot(x - ex, y - ey) < er + 16)) continue;
    const kind = made % 3;
    if (kind === 0) out += balcony(x, y, 18 + r() * 12);
    else if (kind === 1) out += banner(x, y - 16, 0.5 + r() * 0.2, [C.amber, C.magenta, C.teal][made % 3], made);
    else out += `<g opacity="0.75"><path d="M${n(x - 12)} ${n(y)}h24M${n(x - 9)} ${n(y - 4)}h18" stroke="#b06bb0" stroke-width="1"/><path d="M${n(x - 6)} ${n(y - 8)}l6 -5l6 5" stroke="#d67fc4" stroke-width="0.9" fill="none"/></g>`;
    made++;
  }
  return `<g>${out}</g>`;
}

export function depthDetails(seed = 1) {
  const r = rng(seed);
  let out = '';
  for (let i = 0; i < 5; i++) {
    const x = 50 + r() * 540;
    const y = 372 + r() * 150;
    out += waterLantern(x, y, 0.7 + r() * 0.4, [C.amber, C.rose, C.teal][i % 3]);
  }
  for (let i = 0; i < 6; i++) {
    const x = 30 + r() * 580;
    const y = 374 + r() * 160;
    out += `<g opacity="0.8"><ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(9 + r() * 12)}" ry="${n(3 + r() * 2)}" fill="#117269"/><path d="M${n(x)} ${n(y)}l${n(7)} ${n(-3)}" stroke="#35cfa6" stroke-width="0.7"/></g>`;
  }
  for (let i = 0; i < 5; i++) {
    const x = 60 + r() * 520;
    const y = 392 + r() * 140;
    out += fish(x, y, 0.6 + r() * 0.5, [C.teal, C.rose, C.amber][i % 3], r() > 0.5);
  }
  for (let i = 0; i < 8; i++) {
    const x = 40 + r() * 560;
    const y = 356 + r() * 170;
    out += `<path d="M${n(x - 14)} ${n(y)}q7 -5 14 0t14 0" stroke="#8fd4e4" stroke-width="0.8" fill="none" opacity="${n(0.1 + r() * 0.15)}"/>`;
  }
  return `<g>${out}</g>`;
}

export function defs(theme = {}) {
  const sky = theme.sky || ['#060a1e', '#1a2460', '#5b3168'];
  const water = theme.water || ['#102552', '#08132f'];
  return `<defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${sky[0]}"/><stop offset="0.62" stop-color="${sky[1]}"/><stop offset="1" stop-color="${sky[2]}"/>
    </linearGradient>
    <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${water[0]}"/><stop offset="1" stop-color="${water[1]}"/>
    </linearGradient>
    <radialGradient id="moonHalo"><stop offset="0" stop-color="#fff4cf" stop-opacity="0.55"/><stop offset="0.45" stop-color="#ffe8ad" stop-opacity="0.16"/><stop offset="1" stop-color="#ffe8ad" stop-opacity="0"/></radialGradient>
    <radialGradient id="lanternHalo"><stop offset="0" stop-color="#ffd27a" stop-opacity="0.62"/><stop offset="0.42" stop-color="#ff9b52" stop-opacity="0.22"/><stop offset="1" stop-color="#ff7a3d" stop-opacity="0"/></radialGradient>
    <radialGradient id="hintHalo"><stop offset="0.65" stop-color="#35d8cf" stop-opacity="0"/><stop offset="0.85" stop-color="#6ffff0" stop-opacity="0.3"/><stop offset="1" stop-color="#6ffff0" stop-opacity="0"/></radialGradient>
    <linearGradient id="hazeGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9a7ff" stop-opacity="0"/><stop offset="0.5" stop-color="#c9a7ff" stop-opacity="0.5"/><stop offset="1" stop-color="#c9a7ff" stop-opacity="0"/></linearGradient>
    <filter id="softGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>`;
}

export function svgMarkup(objects, theme = {}) {
  return defs(theme) + objects.map((o) => o.svg).join('');
}
