import { W, H, C, rng, backdrop, moon, star, cloud, mountain, waves, reflection, lantern, lanternString, roof, house, boat, person, pier, fish, sign, tree, posts, foreground, bunting, facadeDetails, depthDetails, boatWake, crowd } from '../sceneKit.js';

export function harbourGate() {
  const objects = [];
  const add = (id, svg) => objects.push({ id, svg });
  const rand = rng(101);

  add('sky', backdrop('#05091f', '#14215a', '#4d2a66'));
  add('bunting', bunting(10, 146, 630, 152, 16));
  add('moon', moon(522, 58, 25));
  const stars = [];
  for (let i = 0; i < 26; i++) {
    const x = 14 + rand() * (W - 28);
    const y = 10 + rand() * 128;
    stars.push([x, y]);
    add(`star-${i}`, star(x, y, rand() > 0.85 ? 2 : 0.8 + rand()));
  }
  add('cloud-1', cloud(120, 52, 108, 0.14));
  add('cloud-2', cloud(392, 92, 84, 0.12));
  add('mount-1', mountain(90, 226, 190, 70, '#101a46'));
  add('mount-2', mountain(330, 230, 230, 58, '#141c49'));
  add('mount-3', mountain(578, 224, 170, 78, '#0e183f'));
  add('waves', waves(11, 20, 250, 354));
  add('moon-reflect', reflection(522, 252, 34, 96, '#ffedbc', 0.38));

  add('house-1', house(52, 190, 58, 46, { color: '#141334', roof: '#241a4b' }));
  add('house-2', house(116, 204, 46, 34, { color: '#181438', windows: 1, roof: '#2c1a50' }));
  add('house-3', house(180, 184, 62, 52, { color: '#111132', roof: '#201944', edge: '#b44fa6' }));
  add('house-4', house(254, 198, 50, 40, { color: '#17143a', windows: 1 }));
  add('house-5', house(392, 196, 58, 42, { color: '#141337', roof: '#271a4d' }));
  add('house-6', house(456, 208, 46, 32, { color: '#18143a', windows: 1 }));
  add('house-7', house(584, 190, 60, 50, { color: '#111131', roof: '#241a49' }));
  add('facades', facadeDetails(101, [[476, 162, 17], [328, 162, 16], [159, 242, 18], [540, 210, 17]]));

  add('string-1', lanternString(22, 118, 316, 106, 7, [C.amber, C.magenta, C.amber, C.orange]));
  add('string-2', lanternString(352, 108, 630, 122, 6, [C.magenta, C.amber, C.rose]));

  const lamp1 = lantern(76, 148, 0.72, C.amber);
  const lamp2 = lantern(212, 160, 0.62, C.orange);
  const lamp3 = lantern(336, 146, 0.7, C.magenta);
  const lamp4 = lantern(476, 162, 0.66, C.amber);
  const lamp5 = lantern(560, 138, 0.8, C.rose);
  const lamp6 = lantern(612, 168, 0.55, C.orange);
  add('lamp-1', lamp1);
  add('lamp-2', lamp2);
  add('lamp-3', lamp3);
  add('lamp-4', lamp4);
  add('lamp-5', lamp5);
  add('lamp-6', lamp6);

  add('gate-left', `<g><rect x="286" y="150" width="9" height="96" fill="#3a1d4d" stroke="#a34e95" stroke-width="0.8"/><circle cx="290.5" cy="156" r="2.5" fill="${C.amber}"/></g>`);
  add('gate-right', `<g><rect x="365" y="150" width="9" height="96" fill="#3a1d4d" stroke="#a34e95" stroke-width="0.8"/><circle cx="369.5" cy="156" r="2.5" fill="${C.amber}"/></g>`);
  const gateSign = sign(328, 162, 1.05, C.amber, false);
  add('gate-sign', gateSign);
  add('gate-roof', roof(328, 146, 108, 20, '#2e1a50', C.magenta));
  add('gate-roof2', roof(328, 122, 76, 12, '#3b2058', C.rose));
  add('gate-lamp-l', lantern(292, 180, 0.5, C.amber));
  add('gate-lamp-r', lantern(368, 180, 0.5, C.amber));

  const sailBoat = boat(152, 254, 0.72, { sail: C.amber });
  add('boat-1', boat(78, 292, 0.6, { sail: C.rose }));
  add('boat-2', sailBoat);
  add('boat-3', boat(498, 286, 0.68, { sail: C.orange, flag: C.teal }));
  add('reflect-1', reflection(78, 302, 28, 46, '#ff7a9e', 0.3));
  add('reflect-2', reflection(152, 266, 30, 62, '#ffb24b', 0.34));
  add('reflect-3', reflection(498, 298, 34, 48, '#ff8a5c', 0.3));
  add('wakes', boatWake(78, 300, 0.7, C.rose) + boatWake(152, 266, 0.7, C.amber) + boatWake(498, 294, 0.7, C.orange));
  add('crowd', crowd(111, 258, 8, 286, 410));

  add('pier', pier(566, 272, 126));
  add('person-1', person(540, 268, 0.95, '#0d0f29', true));
  add('person-2', person(592, 266, 1, '#101031'));
  add('person-3', person(246, 246, 0.8, '#0d0f29'));
  add('person-4', person(268, 247, 0.75, '#111132', true));
  add('fish-1', fish(346, 316, 0.9, C.teal));
  add('fish-2', fish(410, 334, 0.75, C.rose, true));
  add('tree-1', tree(30, 246, 1.1));
  add('tree-2', tree(624, 246, 0.95));
  add('posts', posts(218, 452, 252, 6));
  add('deep-water', depthDetails(112));
  add('foreground', foreground(12));

  const [sx, sy] = stars[8];
  return {
    id: 'harbour-gate',
    name: 'Harbour Gate',
    subtitle: 'The lantern ships return at dusk',
    time: 70,
    theme: { sky: ['#05091f', '#14215a', '#4d2a66'], water: ['#102552', '#08132f'] },
    objects,
    differences: [
      { id: 'd1', kind: 'remove', target: 'lamp-4', x: 476, y: 162, r: 17, label: 'A hanging lantern is gone' },
      { id: 'd2', kind: 'variant', target: 'boat-2', variant: boat(152, 254, 0.72, { sail: C.teal }), x: 159, y: 242, r: 18, label: 'The sail changed colour' },
      { id: 'd3', kind: 'remove', target: 'star-8', x: sx, y: sy, r: 9, label: 'A star is missing' },
      { id: 'd4', kind: 'add', target: 'lamp-5', add: lantern(540, 210, 0.58, C.teal), x: 540, y: 210, r: 17, label: 'An extra lantern appeared' },
      { id: 'd5', kind: 'variant', target: 'gate-sign', variant: sign(328, 162, 1.05, C.amber, true), x: 328, y: 162, r: 16, label: 'The gate glyph is tilted' },
    ],
  };
}
