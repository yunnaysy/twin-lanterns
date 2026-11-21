import { harbourGate } from './harbourGate.js';
import { noodleMarket } from './noodleMarket.js';
import { kiteBridge } from './kiteBridge.js';
import { moonPagoda } from './moonPagoda.js';
import { lotusPond } from './lotusPond.js';
import { fireworksPier } from './fireworksPier.js';

export const LEVELS = [harbourGate(), noodleMarket(), kiteBridge(), moonPagoda(), lotusPond(), fireworksPier()];

export function levelByNumber(number) {
  return LEVELS[Math.max(0, Math.min(LEVELS.length - 1, (number | 0) - 1))];
}
