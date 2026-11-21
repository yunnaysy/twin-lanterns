import { W, C, rng, backdrop, moon, star, cloud, mountain, waves, reflection, lantern, lanternString, roof, house, pagoda, boat, bird, fish, person, tree, posts, pier, foreground, bunting, facadeDetails, depthDetails, boatWake, crowd } from '../sceneKit.js';

export function moonPagoda() {
  const objects = [];
  const add = (id, svg) => objects.push({ id, svg });
  const rand = rng(404);

  add('sky', backdrop('#04071a', '#131d54', '#3d2560'));
  add('bunting', bunting(12, 152, 628, 158, 18));
  add('moon', moon(150, 56, 30));
  const stars = [];
  for (let i = 0; i < 30; i++) {
    const x = 12 + rand() * (W - 24);
    const y = 8 + rand() * 136;
    stars.push([x, y]);
    add(`star-${i}`, star(x, y, rand() > 0.88 ? 2.1 : 0.7 + rand()));
  }
  add('cloud-1', cloud(330, 60, 130, 0.12));
  add('cloud-2', cloud(60, 108, 90, 0.1));
  add('mount-1', mountain(120, 216, 230, 76, '#0f1740'));
  add('mount-2', mountain(410, 218, 260, 66, '#111940'));
  add('waves', waves(41, 22, 250, 354));
  add('moon-reflect', reflection(150, 252, 38, 100, '#fff0c2', 0.4));
  const ripple = `<g fill="none" stroke="#bfe9ff" stroke-width="1.2" opacity="0.5"><path d="M128 286q22 -7 44 0"/><path d="M134 296q16 -6 32 0"/><path d="M140 306q10 -4 20 0"/></g>`;
  add('ripple', ripple);

  add('house-1', house(38, 178, 58, 66, { color: '#131132', roof: '#241a48' }));
  add('house-2', house(104, 186, 52, 58, { color: '#17143a', windows: 1 }));
  add('house-3', house(246, 174, 60, 70, { color: '#121232', roof: '#2c1a52' }));
  add('house-4', house(320, 186, 50, 58, { color: '#16133a', windows: 1 }));
  add('house-5', house(556, 182, 58, 62, { color: '#141232', roof: '#271a4c' }));
  add('house-6', house(616, 176, 48, 68, { color: '#111131', windows: 1 }));
  add('facades', facadeDetails(404, [[452, 212, 44], [130, 214, 16], [306, 152, 16]]));

  const pagodaMain = pagoda(452, 252, 1, 4, 2);
  add('pagoda', pagodaMain);
  const ornament = `<g><path d="M452 100v13" stroke="#ffd08a" stroke-width="1.4"/><path d="M452 101l18 5l-18 5z" fill="${C.magenta}" stroke="#ffd5ef" stroke-width="0.7"/><circle cx="452" cy="99" r="2.2" fill="${C.amber}"/></g>`;
  add('pagoda-ornament', ornament);
  add('pagoda-reflect', reflection(452, 290, 66, 60, '#ff9d5c', 0.24));

  add('string-1', lanternString(8, 108, 316, 118, 8, [C.amber, C.rose, C.magenta]));
  add('string-2', lanternString(340, 116, 634, 104, 7, [C.teal, C.amber, C.magenta]));
  add('lamp-1', lantern(62, 150, 0.6, C.amber));
  add('lamp-2', lantern(196, 144, 0.66, C.orange));
  const lamp3 = lantern(306, 152, 0.7, C.magenta);
  add('lamp-3', lamp3);
  add('lamp-4', lantern(380, 148, 0.6, C.rose));
  add('lamp-5', lantern(540, 150, 0.64, C.amber));
  add('lamp-6', lantern(604, 144, 0.72, C.orange));

  const bird1 = bird(242, 92, 1.1);
  add('bird-1', bird1);
  add('bird-2', bird(262, 84, 0.85));
  add('bird-3', bird(224, 78, 0.7));
  add('boat-1', boat(106, 298, 0.6, { sail: C.rose }));
  add('boat-2', boat(262, 306, 0.55, { sail: C.amber, flag: C.teal }));
  add('boat-3', boat(562, 300, 0.6, { sail: C.teal }));
  add('reflect-1', reflection(106, 310, 28, 42, '#ff7ba8', 0.26));
  add('reflect-2', reflection(262, 316, 30, 38, '#ffb24b', 0.26));
  add('reflect-3', reflection(562, 310, 30, 42, '#48dcd0', 0.26));
  add('wakes', boatWake(106, 308, 0.6, C.rose) + boatWake(262, 316, 0.55, C.amber) + boatWake(562, 310, 0.6, C.teal));
  add('crowd', crowd(411, 266, 6, 160, 300) + crowd(412, 266, 4, 510, 560));
  const fish1 = fish(360, 330, 0.9, C.teal);
  add('fish-1', fish1);
  add('fish-2', fish(470, 336, 0.75, C.rose, true));
  add('fish-3', fish(180, 338, 0.7, C.amber));
  add('person-1', person(80, 274, 0.9, '#0c1030', true));
  add('person-2', person(106, 276, 0.85, '#111233'));
  add('person-3', person(580, 272, 0.9, '#0d1030'));
  add('pier', pier(86, 278, 110));
  add('tree-1', tree(20, 252, 0.9));
  add('tree-2', tree(628, 252, 1));
  add('posts', posts(8, 632, 250, 9));
  add('deep-water', depthDetails(422));
  add('foreground', foreground(42));

  const [sx, sy] = stars[22];
  return {
    id: 'moon-pagoda',
    name: 'Moon Pagoda',
    subtitle: 'A silent tiered shrine holds the moonlight',
    time: 100,
    theme: { sky: ['#04071a', '#131d54', '#3d2560'], water: ['#0b1b45', '#060e28'] },
    objects,
    differences: [
      { id: 'd1', kind: 'variant', target: 'pagoda', variant: pagoda(452, 252, 1, 4, 1), x: 452, y: 212, r: 34, label: 'A pagoda window disappeared' },
      { id: 'd2', kind: 'remove', target: 'ripple', x: 150, y: 294, r: 24, label: 'The moon ripple is gone' },
      { id: 'd3', kind: 'variant', target: 'lamp-3', variant: lantern(306, 152, 0.7, C.teal), x: 306, y: 152, r: 16, label: 'A lantern changed colour' },
      { id: 'd4', kind: 'variant', target: 'pagoda-ornament', variant: `<g transform="rotate(38 452 107)"><path d="M452 100v13" stroke="#ffd08a" stroke-width="1.4"/><path d="M452 101l18 5l-18 5z" fill="${C.magenta}" stroke="#ffd5ef" stroke-width="0.7"/><circle cx="452" cy="99" r="2.2" fill="${C.amber}"/></g>`, x: 460, y: 107, r: 17, label: 'The roof banner turned' },
      { id: 'd5', kind: 'remove', target: 'bird-1', x: 242, y: 92, r: 14, label: 'A bird flew away' },
      { id: 'd6', kind: 'add', target: 'lamp-2', add: lantern(130, 214, 0.52, C.rose), x: 130, y: 214, r: 16, label: 'A new lantern appeared' },
      { id: 'd7', kind: 'variant', target: 'fish-1', variant: fish(360, 330, 0.9, C.teal, true), x: 360, y: 330, r: 17, label: 'A fish swims the other way' },
    ],
  };
}
