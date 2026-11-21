import { W, C, rng, backdrop, moon, star, cloud, mountain, waves, reflection, lantern, lanternString, roof, house, stall, steam, sign, boat, person, fish, cat, tree, posts, pier, foreground, bunting, facadeDetails, depthDetails, boatWake, crowd } from '../sceneKit.js';

export function noodleMarket() {
  const objects = [];
  const add = (id, svg) => objects.push({ id, svg });
  const rand = rng(202);

  add('sky', backdrop('#06091e', '#1b2360', '#612f69'));
  add('bunting', bunting(12, 148, 628, 142, 18));
  add('moon', moon(104, 54, 22));
  const stars = [];
  for (let i = 0; i < 24; i++) {
    const x = 12 + rand() * (W - 24);
    const y = 8 + rand() * 116;
    stars.push([x, y]);
    add(`star-${i}`, star(x, y, rand() > 0.87 ? 2 : 0.7 + rand()));
  }
  add('cloud-1', cloud(320, 44, 120, 0.13));
  add('cloud-2', cloud(540, 88, 96, 0.11));
  add('mount-1', mountain(150, 220, 210, 52, '#161946'));
  add('mount-2', mountain(480, 222, 250, 62, '#141941'));
  add('waves', waves(21, 18, 252, 354));
  add('moon-reflect', reflection(104, 250, 28, 90, '#fff0c4', 0.3));

  add('house-1', house(40, 180, 60, 66, { color: '#161235', roof: '#2a1950' }));
  add('house-2', house(104, 174, 56, 72, { color: '#191338', roof: '#321c58' }));
  add('house-3', house(170, 182, 62, 64, { color: '#121233', roof: '#241a4b' }));
  add('house-4', house(246, 176, 58, 70, { color: '#17133a', windows: 1 }));
  add('house-5', house(320, 180, 62, 66, { color: '#131135', roof: '#2c1a50' }));
  add('house-6', house(398, 178, 58, 68, { color: '#18143a', roof: '#291b51', edge: C.rose }));
  add('house-7', house(478, 184, 62, 62, { color: '#141232' }));
  add('house-8', house(578, 176, 66, 70, { color: '#111131', roof: '#251a4b' }));
  add('facades', facadeDetails(202, [[154, 204, 27], [404, 186, 14], [336, 146, 16], [230, 230, 16]]));

  add('string-1', lanternString(8, 104, 312, 118, 8, [C.orange, C.amber, C.magenta]));
  add('string-2', lanternString(340, 116, 634, 102, 7, [C.rose, C.amber, C.teal]));

  add('lamp-1', lantern(58, 152, 0.62, C.amber));
  const lamp2 = lantern(142, 148, 0.72, C.orange);
  add('lamp-2', lamp2);
  add('lamp-3', lantern(216, 138, 0.58, C.magenta));
  const lamp4 = lantern(272, 154, 0.66, C.amber);
  add('lamp-4', lamp4);
  const lamp5 = lantern(336, 146, 0.8, C.rose);
  add('lamp-5', lamp5);
  add('lamp-6', lantern(452, 142, 0.62, C.orange));
  add('lamp-7', lantern(604, 150, 0.7, C.amber));

  const stallBig = stall(154, 218, 1.05, { stripe: C.magenta, stripes: 5 });
  add('stall-1', stallBig);
  add('stall-2', stall(298, 220, 0.95, { stripe: C.teal, base: '#ffe6b0', stripes: 6 }));
  add('stall-3', stall(442, 220, 0.9, { stripe: C.orange, base: '#ffd0e4', stripes: 5 }));
  const steamBowl = steam(230, 238, 1, 2);
  add('steam-1', steamBowl);
  add('steam-2', steam(376, 236, 0.9, 3));
  add('steam-3', steam(516, 238, 0.8, 2));
  add('crowd', crowd(212, 266, 9, 296, 410) + crowd(213, 274, 4, 580, 624));

  const signShop = sign(404, 186, 0.95, C.amber, false);
  add('sign-1', sign(94, 182, 0.9, C.magenta, false));
  add('sign-2', signShop);
  add('sign-3', sign(560, 184, 0.85, C.teal, false));

  add('person-1', person(122, 264, 1.05, '#0c1030', true));
  add('person-2', person(206, 270, 0.95, '#101132'));
  const person3 = person(470, 268, 1, '#0b0f2c', true);
  add('person-3', person3);
  add('person-4', person(494, 274, 0.85, '#141033'));
  add('person-5', person(556, 266, 0.95, '#0d102e'));
  add('person-6', person(64, 272, 0.8, '#121232'));

  add('boat-1', boat(250, 306, 0.55, { sail: C.rose }));
  add('boat-2', boat(524, 308, 0.6, { sail: C.amber, flag: C.teal }));
  add('reflect-1', reflection(154, 268, 38, 70, '#ff62a8', 0.28));
  add('reflect-2', reflection(298, 268, 40, 72, '#48dcd0', 0.24));
  add('reflect-3', reflection(442, 268, 34, 66, '#ff9b52', 0.26));
  add('fish-1', fish(350, 332, 0.8, C.teal));
  add('fish-2', fish(600, 324, 0.7, C.rose, true));
  add('wakes', boatWake(250, 316, 0.6, C.rose) + boatWake(524, 318, 0.6, C.amber));
  add('pier', pier(40, 280, 120));
  add('tree-1', tree(624, 252, 0.9));
  add('posts', posts(8, 632, 252, 10));
  add('deep-water', depthDetails(222));
  add('foreground', foreground(22));

  const [sx, sy] = stars[13];
  return {
    id: 'noodle-market',
    name: 'Noodle Market',
    subtitle: 'Steam, spices and a thousand paper lights',
    time: 80,
    theme: { sky: ['#06091e', '#1b2360', '#612f69'], water: ['#122252', '#080f2e'] },
    objects,
    differences: [
      { id: 'd1', kind: 'variant', target: 'stall-1', variant: stall(154, 218, 1.05, { stripe: C.magenta, stripes: 4 }), x: 154, y: 204, r: 27, label: 'The awning lost a stripe' },
      { id: 'd2', kind: 'variant', target: 'steam-1', variant: steam(230, 238, 1, 3), x: 230, y: 230, r: 16, label: 'An extra curl of steam' },
      { id: 'd3', kind: 'variant', target: 'sign-2', variant: sign(404, 186, 0.95, C.teal, false), x: 404, y: 186, r: 14, label: 'The shop sign changed colour' },
      { id: 'd4', kind: 'remove', target: 'person-3', x: 470, y: 263, r: 13, label: 'A market visitor left' },
      { id: 'd5', kind: 'variant', target: 'lamp-5', variant: lantern(336, 146, 0.45, C.rose), x: 336, y: 146, r: 16, label: 'A lantern shrank' },
      { id: 'd6', kind: 'add', target: 'person-6', add: cat(58, 284, 1.1), x: 58, y: 280, r: 15, label: 'A cat appeared by the stall' },
    ],
  };
}
