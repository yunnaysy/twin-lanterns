import { svgMarkup } from './sceneKit.js';

export function applyDifferences(scene, found = new Set(), visible = null) {
  const removes = new Map();
  const variants = new Map();
  const adds = [];
  for (const diff of scene.differences) {
    if (visible && !visible.has(diff.id)) continue;
    if (found.has(diff.id)) continue;
    if (diff.kind === 'remove') removes.set(diff.target, diff.id);
    else if (diff.kind === 'variant') variants.set(diff.target, diff.variant);
    else if (diff.kind === 'add') adds.push(diff);
  }
  const objects = [];
  for (const object of scene.objects) {
    if (removes.has(object.id)) continue;
    objects.push({ id: object.id, svg: variants.get(object.id) ?? object.svg });
    for (const add of adds) if (add.target === object.id) objects.push({ id: add.id, svg: add.add });
  }
  for (const add of adds) {
    if (!scene.objects.some((object) => object.id === add.target)) objects.push({ id: add.id, svg: add.add });
  }
  return { objects, markup: svgMarkup(objects, scene.theme) };
}
