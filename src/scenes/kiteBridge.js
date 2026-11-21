import { W, C, rng, backdrop, moon, star, cloud, mountain, waves, reflection, lantern, lanternString, roof, house, bridge, boat, kite, person, fish, bird, tree, posts, pier, foreground, bunting, facadeDetails, depthDetails, boatWake, crowd } from '../sceneKit.js';

export function kiteBridge() {
  const objects = [];
  const add = (id, svg) => objects.push({ id, svg });
  const rand = rng(303);

  add('sky', backdrop('#060a20', '#182363', '#4b2d6b'));
  add('bunting', bunting(10, 150, 630, 156, 17));
  add('moon', moon(132, 56, 26));
  const stars = [];
  for (let i = 0; i < 28; i++) {
    const x = 12 + rand() * (W - 24);
    const y = 8 + rand() * 124;
    stars.push([x, y]);
    add(`star-${i}`, star(x, y, rand() > 0.86 ? 2 : 0.7 + rand()));
  }
  add('cloud-1', cloud(300, 50, 110, 0.13));
  add('cloud-2', cloud(520, 104, 86, 0.1));
  add('mount-1', mountain(76, 220, 200, 68, '#111a47'));
  add('mount-2', mountain(560, 222, 220, 72, '#101840'));
  add('waves', waves(31, 20, 252, 354));
  add('moon-reflect', reflection(132, 252, 32, 96, '#ffedbc', 0.36));

  add('house-1', house(38, 176, 64, 60, { color: '#151333', roof: '#261a4d' }));
  add('house-2', house(110, 186, 52, 50, { color: '#18143a', windows: 1 }));
  add('house-3', house(176, 168, 60, 68, { color: '#121233', roof: '#2d1a55', edge: C.rose }));
  add('house-4', house(462, 170, 64, 66, { color: '#141333', roof: '#281a4f' }));
  add('house-5', house(534, 182, 56, 54, { color: '#17143a', windows: 1 }));
  add('house-6', house(602, 170, 66, 68, { color: '#111131', roof: '#251a49' }));
  add('facades', facadeDetails(303, [[320, 206, 44], [468, 84, 18], [550, 62, 16]]));

  const string1 = lanternString(10, 112, 330, 98, 7, [C.amber, C.magenta, C.orange, C.rose]);
  add('string-1', string1);
  add('string-2', lanternString(344, 100, 634, 112, 7, [C.teal, C.amber, C.magenta]));

  add('lamp-1', lantern(60, 144, 0.6, C.amber));
  add('lamp-2', lantern(200, 150, 0.68, C.orange));
  add('lamp-3', lantern(410, 146, 0.64, C.magenta));
  add('lamp-4', lantern(486, 152, 0.6, C.rose));
  add('lamp-5', lantern(584, 142, 0.7, C.amber));

  const bridgeMain = bridge(320, 214, 176, 8);
  add('bridge', bridgeMain);
  add('bridge-reflect', reflection(320, 286, 92, 66, '#c466bd', 0.22));

  const kite1 = kite(240, 82, 0.9, C.amber);
  const kite2 = kite(468, 84, 1.05, C.magenta);
  const kite3 = kite(550, 62, 0.8, C.teal);
  add('kite-1', kite1);
  add('kite-2', kite2);
  add('kite-3', kite3);
  add('kite-4', kite(366, 50, 0.7, C.rose));
  add('bird-1', bird(298, 104, 1));
  add('bird-2', bird(314, 96, 0.8));

  add('boat-1', boat(92, 296, 0.62, { sail: C.rose }));
  const boat2 = boat(390, 304, 0.62, { sail: C.amber });
  add('boat-2', boat2);
  add('boat-3', boat(566, 296, 0.58, { sail: C.teal, flag: C.amber }));
  add('reflect-1', reflection(92, 308, 30, 42, '#ff7ba8', 0.26));
  const reflect2 = reflection(390, 314, 32, 40, '#ffb24b', 0.3);
  add('reflect-2', reflect2);
  add('reflect-3', reflection(566, 308, 28, 42, '#48dcd0', 0.26));
  add('wakes', boatWake(92, 306, 0.6, C.rose) + boatWake(566, 306, 0.6, C.teal));
  add('crowd', crowd(311, 264, 7, 40, 200) + crowd(312, 264, 5, 520, 620));

  add('person-1', person(258, 196, 0.85, '#0d1029', true));
  add('person-2', person(382, 196, 0.85, '#101132'));
  add('person-3', person(510, 262, 0.9, '#0c1029'));
  add('person-4', person(530, 264, 0.8, '#111132', true));
  add('fish-1', fish(160, 330, 0.85, C.teal));
  add('fish-2', fish(470, 334, 0.75, C.rose, true));
  add('pier-1', pier(48, 274, 100));
  add('tree-1', tree(624, 256, 0.9));
  add('posts', posts(8, 632, 250, 9));
  add('deep-water', depthDetails(322));
  add('foreground', foreground(32));

  const [sx, sy] = stars[19];
  return {
    id: 'kite-bridge',
    name: 'Kite Bridge',
    subtitle: 'Paper kites chase the moon above the arches',
    time: 90,
    theme: { sky: ['#060a20', '#182363', '#4b2d6b'], water: ['#0e2150', '#07122f'] },
    objects,
    differences: [
      { id: 'd1', kind: 'remove', target: 'kite-2', x: 468, y: 84, r: 18, label: 'A kite flew away' },
      { id: 'd2', kind: 'variant', target: 'kite-3', variant: kite(550, 62, 0.8, C.rose), x: 550, y: 62, r: 16, label: 'A kite changed colour' },
      { id: 'd3', kind: 'variant', target: 'bridge', variant: bridge(320, 214, 176, 6), x: 320, y: 206, r: 44, label: 'The bridge has fewer posts' },
      { id: 'd4', kind: 'remove', target: 'boat-2', x: 390, y: 295, r: 22, label: 'A boat drifted off' },
      { id: 'd5', kind: 'variant', target: 'string-1', variant: lanternString(10, 112, 330, 98, 5, [C.amber, C.magenta, C.orange, C.rose]), x: 170, y: 130, r: 54, label: 'Fewer lanterns on the string' },
      { id: 'd6', kind: 'variant', target: 'reflect-2', variant: reflection(390, 314, 32, 40, '#53e0cf', 0.3), x: 390, y: 330, r: 22, label: 'The reflection is the wrong hue' },
      { id: 'd7', kind: 'remove', target: 'star-19', x: sx, y: sy, r: 9, label: 'A tiny star went out' },
    ],
  };
}
