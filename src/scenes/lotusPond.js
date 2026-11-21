import { W, C, rng, backdrop, moon, star, cloud, mountain, waves, reflection, lantern, lanternString, roof, house, bridge, fish, lotus, firefly, bird, person, tree, posts, foreground, bunting, facadeDetails, depthDetails, crowd } from '../sceneKit.js';

const frog = (x, y, s, color) => `<g><ellipse cx="${n2(x)}" cy="${n2(y)}" rx="${n2(9 * s)}" ry="${n2(5 * s)}" fill="${color}"/><circle cx="${n2(x + 6 * s)}" cy="${n2(y - 4 * s)}" r="${n2(4 * s)}" fill="${color}"/><circle cx="${n2(x + 7.5 * s)}" cy="${n2(y - 5 * s)}" r="${n2(1.4 * s)}" fill="#fff6c9"/><circle cx="${n2(x + 7.5 * s)}" cy="${n2(y - 5 * s)}" r="${n2(0.7 * s)}" fill="#191128"/><path d="M${n2(x - 8 * s)} ${n2(y)}l${n2(-5 * s)} ${n2(4 * s)}" stroke="${color}" stroke-width="${n2(1.6 * s)}"/></g>`;
const n2 = (v) => Math.round(v * 10) / 10;

export function lotusPond() {
  const objects = [];
  const add = (id, svg) => objects.push({ id, svg });
  const rand = rng(505);

  add('sky', backdrop('#050819', '#151c53', '#472a6a'));
  add('bunting', bunting(10, 154, 630, 148, 18));
  add('moon', moon(520, 62, 27));
  const stars = [];
  for (let i = 0; i < 30; i++) {
    const x = 12 + rand() * (W - 24);
    const y = 8 + rand() * 132;
    stars.push([x, y]);
    add(`star-${i}`, star(x, y, rand() > 0.87 ? 2 : 0.7 + rand()));
  }
  add('cloud-1', cloud(180, 52, 112, 0.12));
  add('cloud-2', cloud(420, 96, 90, 0.1));
  add('mount-1', mountain(90, 216, 210, 58, '#101741'));
  add('mount-2', mountain(390, 216, 250, 68, '#11183f'));
  add('waves', waves(51, 22, 252, 354));
  add('moon-reflect', reflection(520, 252, 34, 96, '#ffedbc', 0.36));

  add('house-1', house(34, 174, 58, 62, { color: '#141232', roof: '#251a49' }));
  add('house-2', house(98, 182, 50, 54, { color: '#18143a', windows: 1 }));
  add('house-3', house(160, 168, 58, 70, { color: '#121132', roof: '#2c1a53' }));
  add('house-4', house(458, 172, 60, 68, { color: '#151333', roof: '#271a4d' }));
  add('house-5', house(528, 182, 52, 58, { color: '#17143a', windows: 1 }));
  add('house-6', house(598, 176, 64, 64, { color: '#111131', roof: '#281b4e' }));
  add('facades', facadeDetails(505, [[324, 220, 44], [398, 148, 16], [252, 284, 18], [98, 298, 18]]));

  add('string-1', lanternString(8, 106, 314, 116, 7, [C.amber, C.rose, C.teal]));
  add('string-2', lanternString(350, 114, 634, 106, 8, [C.magenta, C.amber, C.orange]));
  add('lamp-1', lantern(58, 148, 0.62, C.amber));
  add('lamp-2', lantern(174, 152, 0.6, C.rose));
  add('lamp-3', lantern(268, 144, 0.7, C.magenta));
  const lamp4 = lantern(398, 148, 0.72, C.amber);
  add('lamp-4', lamp4);
  add('lamp-5', lantern(486, 154, 0.6, C.orange));
  add('lamp-6', lantern(582, 146, 0.66, C.amber));

  const bridgeMain = bridge(324, 228, 160, 8, '#2e1e50');
  add('bridge', bridgeMain);

  for (let i = 0; i < 9; i++) {
    const x = 30 + i * 72;
    const y = 274 + (i % 3) * 22;
    add(`pad-${i}`, `<g><ellipse cx="${x}" cy="${y}" rx="${22 + (i % 2) * 5}" ry="7" fill="#12796f" opacity="0.75"/><path d="M${x} ${y}l14 ${-5}" stroke="#2cc1a0" stroke-width="0.8" opacity="0.7"/></g>`);
  }

  const lotus1 = lotus(136, 282, 1, C.rose, 5);
  const lotus2 = lotus(252, 292, 0.95, C.rose, 5);
  add('lotus-1', lotus1);
  add('lotus-2', lotus2);
  add('lotus-3', lotus(354, 306, 0.9, '#ffd1e8', 6));
  add('lotus-4', lotus(452, 296, 0.85, C.rose, 5));
  add('lotus-5', lotus(568, 312, 1, '#ffb6dd', 6));
  add('lotus-6', lotus(60, 320, 0.8, C.rose, 5));

  add('fish-1', fish(188, 330, 0.85, C.teal));
  add('fish-2', fish(320, 338, 0.7, C.amber));
  const fish3 = fish(476, 326, 0.9, C.rose, true);
  add('fish-3', fish3);
  add('fish-4', fish(600, 340, 0.7, C.teal, true));

  const frogMain = frog(98, 300, 1.05, '#69e08a');
  add('frog', frogMain);

  for (let i = 0; i < 8; i++) {
    const x = 24 + rand() * 592;
    const y = 180 + rand() * 120;
    if (i === 4) {
      add('firefly-5', firefly(540, 206, 1));
    } else {
      add(`firefly-${i + 1}`, firefly(x, y, 0.8 + rand() * 0.5));
    }
  }

  add('reflect-1', reflection(136, 300, 28, 46, '#ff7ba8', 0.26));
  const reflect2 = reflection(252, 312, 30, 44, '#ff8ac4', 0.28);
  add('reflect-2', reflect2);
  add('reflect-3', reflection(568, 324, 30, 30, '#ffc0dd', 0.24));
  add('crowd', crowd(501, 268, 5, 444, 508) + crowd(502, 270, 5, 120, 190));
  add('bird-1', bird(236, 100, 0.9));
  add('bird-2', bird(254, 92, 0.7));
  add('person-1', person(392, 268, 0.85, '#0d102c', true));
  add('person-2', person(414, 270, 0.8, '#111232'));
  add('tree-1', tree(20, 250, 0.95));
  add('tree-2', tree(628, 250, 1));
  add('posts', posts(8, 632, 248, 9));
  add('deep-water', depthDetails(522));
  add('foreground', foreground(52));

  const [sx, sy] = stars[16];
  return {
    id: 'lotus-pond',
    name: 'Lotus Pond',
    subtitle: 'Fireflies hover where the lanterns fall',
    time: 110,
    theme: { sky: ['#050819', '#151c53', '#472a6a'], water: ['#0a2049', '#06122f'] },
    objects,
    differences: [
      { id: 'd1', kind: 'variant', target: 'lotus-2', variant: lotus(252, 292, 0.95, C.rose, 3), x: 252, y: 284, r: 18, label: 'A lotus lost two petals' },
      { id: 'd2', kind: 'remove', target: 'fish-3', x: 476, y: 326, r: 17, label: 'A fish swam away' },
      { id: 'd3', kind: 'variant', target: 'frog', variant: frog(98, 300, 1.05, C.magenta), x: 98, y: 298, r: 18, label: 'The frog changed colour' },
      { id: 'd4', kind: 'variant', target: 'lamp-4', variant: lantern(398, 148, 0.72, C.amber, { lit: false }), x: 398, y: 148, r: 18, label: 'A lantern went dark' },
      { id: 'd5', kind: 'remove', target: 'firefly-5', x: 540, y: 206, r: 11, label: 'A firefly vanished' },
      { id: 'd6', kind: 'variant', target: 'bridge', variant: bridge(324, 228, 160, 5, '#2e1e50'), x: 324, y: 220, r: 44, label: 'The bridge has fewer posts' },
      { id: 'd7', kind: 'variant', target: 'reflect-2', variant: reflection(252, 312, 30, 44, '#55e3d2', 0.28), x: 252, y: 330, r: 22, label: 'A reflection is the wrong colour' },
      { id: 'd8', kind: 'remove', target: 'star-16', x: sx, y: sy, r: 9, label: 'A star is missing' },
    ],
  };
}
