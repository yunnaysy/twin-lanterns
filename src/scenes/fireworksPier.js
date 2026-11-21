import { W, C, rng, backdrop, moon, star, cloud, mountain, waves, reflection, lantern, lanternString, roof, house, stall, boat, person, fish, firework, firefly, pier, tree, posts, sign, foreground, bunting, facadeDetails, depthDetails, boatWake, crowd } from '../sceneKit.js';

export function fireworksPier() {
  const objects = [];
  const add = (id, svg) => objects.push({ id, svg });
  const rand = rng(606);

  add('sky', backdrop('#04071c', '#171f5e', '#5b2d70'));
  add('bunting', bunting(10, 34, 630, 30, 18));
  add('moon', moon(316, 52, 21));
  const stars = [];
  for (let i = 0; i < 32; i++) {
    const x = 12 + rand() * (W - 24);
    const y = 8 + rand() * 120;
    stars.push([x, y]);
    add(`star-${i}`, star(x, y, rand() > 0.87 ? 2 : 0.7 + rand()));
  }
  add('cloud-1', cloud(88, 112, 100, 0.1));
  add('cloud-2', cloud(520, 130, 110, 0.09));

  const firework1 = firework(164, 72, 26, C.magenta, 12);
  const firework2 = firework(432, 64, 28, C.amber, 12);
  const firework3 = firework(546, 108, 22, C.rose, 12);
  add('firework-1', firework1);
  add('firework-2', firework2);
  add('firework-3', firework3);
  add('firework-4', firework(74, 116, 18, C.teal, 10));
  add('firework-5', firework(360, 118, 14, C.orange, 8));

  add('mount-1', mountain(96, 218, 220, 62, '#101741'));
  add('mount-2', mountain(540, 220, 240, 68, '#111840'));
  add('waves', waves(61, 22, 250, 354));
  add('moon-reflect', reflection(316, 252, 28, 96, '#fff0c2', 0.34));

  add('house-1', house(36, 180, 58, 62, { color: '#131132', roof: '#261a4d' }));
  add('house-2', house(102, 174, 54, 68, { color: '#17143a', windows: 1 }));
  add('house-3', house(166, 182, 58, 60, { color: '#121232', roof: '#2b1a52' }));
  add('house-4', house(238, 176, 56, 66, { color: '#16133a', windows: 1 }));
  add('house-5', house(400, 178, 58, 64, { color: '#141232', roof: '#281a4e' }));
  add('house-6', house(476, 174, 56, 68, { color: '#17143a', windows: 1 }));
  add('house-7', house(552, 182, 58, 60, { color: '#121232', roof: '#2b1a52' }));
  add('house-8', house(616, 176, 54, 66, { color: '#111131', windows: 1 }));
  add('facades', facadeDetails(606, [[128, 222, 26], [452, 273, 13], [517, 300, 22]]));

  const string1 = lanternString(8, 128, 320, 116, 8, [C.amber, C.magenta, C.orange, C.rose]);
  add('string-1', string1);
  add('string-2', lanternString(348, 116, 634, 126, 8, [C.teal, C.amber, C.magenta]));
  add('lamp-1', lantern(64, 160, 0.62, C.amber));
  add('lamp-2', lantern(142, 154, 0.66, C.orange));
  add('lamp-3', lantern(236, 162, 0.6, C.magenta));
  add('lamp-4', lantern(410, 158, 0.64, C.rose));
  add('lamp-5', lantern(492, 162, 0.6, C.amber));
  add('lamp-6', lantern(590, 154, 0.7, C.orange));

  const stallMain = stall(128, 236, 0.95, { stripe: C.magenta, stripes: 5 });
  add('stall-1', stallMain);
  add('stall-2', stall(492, 238, 0.9, { stripe: C.teal, base: '#ffe1ad', stripes: 5 }));
  add('sign-1', sign(328, 186, 0.9, C.amber, false));

  add('pier', pier(320, 284, 360));
  add('boat-1', boat(88, 310, 0.55, { sail: C.rose }));
  const boat2 = boat(516, 312, 0.58, { sail: C.amber, flag: C.magenta });
  add('boat-2', boat2);
  add('boat-3', boat(252, 320, 0.5, { sail: C.teal, flag: C.amber }));
  add('reflect-1', reflection(88, 320, 28, 34, '#ff7ba8', 0.24));
  const reflect2 = reflection(516, 322, 30, 34, '#ffb24b', 0.26);
  add('reflect-2', reflect2);
  add('reflect-3', reflection(252, 330, 26, 26, '#53e0cf', 0.24));
  add('wakes', boatWake(88, 320, 0.55, C.rose) + boatWake(252, 330, 0.5, C.teal));
  add('crowd', crowd(607, 268, 4, 50, 146) + crowd(608, 268, 3, 302, 340));

  add('person-1', person(180, 278, 0.95, '#0c1030', true));
  add('person-2', person(272, 278, 0.9, '#101132'));
  add('person-3', person(366, 278, 0.95, '#0d102c'));
  const person4 = person(452, 278, 0.9, '#111232', true);
  add('person-4', person4);
  add('person-5', person(554, 278, 0.85, '#0c1029'));
  add('fish-1', fish(196, 344, 0.75, C.teal));
  add('fish-2', fish(420, 344, 0.7, C.rose, true));
  for (let i = 0; i < 5; i++) {
    add(`firefly-${i + 1}`, firefly(30 + rand() * 580, 200 + rand() * 80, 0.8));
  }
  add('tree-1', tree(18, 254, 0.85));
  add('tree-2', tree(628, 254, 0.9));
  add('deep-water', depthDetails(622));
  add('foreground', foreground(62));

  const [sx, sy] = stars[3];
  return {
    id: 'fireworks-pier',
    name: 'Fireworks Pier',
    subtitle: 'The whole river town celebrates at once',
    time: 120,
    theme: { sky: ['#04071c', '#171f5e', '#5b2d70'], water: ['#102156', '#070f2d'] },
    objects,
    differences: [
      { id: 'd1', kind: 'variant', target: 'firework-1', variant: firework(164, 72, 26, C.teal, 12), x: 164, y: 72, r: 30, label: 'A firework changed colour' },
      { id: 'd2', kind: 'remove', target: 'firework-2', x: 432, y: 64, r: 30, label: 'A firework vanished' },
      { id: 'd3', kind: 'variant', target: 'firework-3', variant: firework(546, 108, 22, C.rose, 7), x: 546, y: 108, r: 26, label: 'Fewer sparks in the burst' },
      { id: 'd4', kind: 'variant', target: 'boat-2', variant: `<g transform="rotate(28 517 298)"><path d="M493 312Q517 321 541 312L535 318Q517 330 499 318Z" fill="#22183f" stroke="#a05d96" stroke-width="0.9"/><path d="M517 310v-23" stroke="#c8aad0" stroke-width="0.8"/><path d="M518 297l13 9h-13z" fill="${C.amber}" opacity="0.9"/></g>`, x: 517, y: 300, r: 22, label: 'The boat flag is tilted' },
      { id: 'd5', kind: 'variant', target: 'string-1', variant: lanternString(8, 128, 320, 116, 5, [C.amber, C.magenta, C.orange, C.rose]), x: 160, y: 144, r: 56, label: 'The lantern string is shorter' },
      { id: 'd6', kind: 'variant', target: 'stall-1', variant: stall(128, 236, 0.95, { stripe: C.magenta, stripes: 3 }), x: 128, y: 222, r: 26, label: 'The stall awning lost stripes' },
      { id: 'd7', kind: 'remove', target: 'person-4', x: 452, y: 273, r: 13, label: 'A reveller left the pier' },
      { id: 'd8', kind: 'variant', target: 'reflect-2', variant: reflection(516, 322, 30, 34, '#52e2d1', 0.26), x: 516, y: 336, r: 22, label: 'The reflection is wrong' },
      { id: 'd9', kind: 'remove', target: 'star-3', x: sx, y: sy, r: 9, label: 'A tiny star went out' },
    ],
  };
}
