import { chromium } from '/tmp/pw-tools/node_modules/playwright-core/index.mjs';

const BASE = process.env.BASE_URL || 'http://localhost:8123/';
const runtimeErrors = [];
const external = [];
const checks = [];

function check(name, ok, detail = '') {
  checks.push({ name, ok, detail });
}

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('console', (msg) => { if (msg.type() === 'error') runtimeErrors.push(`console: ${msg.text()}`); });
page.on('pageerror', (error) => runtimeErrors.push(`pageerror: ${error.message}`));
page.on('request', (request) => {
  const url = request.url();
  if (!url.startsWith(BASE) && !url.startsWith('data:') && !url.startsWith('blob:') && url !== 'about:blank') external.push(url);
});

async function open(query = '') {
  await page.goto(BASE + query, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__twin?.ready === true, null, { timeout: 10000 });
}

for (let i = 0; i < 6; i++) {
  await open('?debug=1');
  const level = await page.evaluate((index) => {
    window.__twin.startLevel(index);
    return window.__twin.levels[index];
  }, i);
  check(`level ${i + 1} has the right difference count`, level.differences.length === [5, 6, 7, 7, 8, 9][i], `got ${level.differences.length}`);
  const circles = await page.locator('.debug-circle').count();
  check(`level ${i + 1} debug circles`, circles === level.differences.length * 2, `got ${circles}`);

  const beforeMiss = await page.evaluate(() => window.__twin.state.timeLeft);
  const missPoint = { x: 4, y: 356 };
  const safe = level.differences.every((d) => Math.hypot(d.x - missPoint.x, d.y - missPoint.y) > d.r + 6);
  check(`level ${i + 1} safe miss point`, safe);
  await page.evaluate((p) => window.__twin.missAt(p.x, p.y), missPoint);
  const afterMiss = await page.evaluate(() => window.__twin.state);
  check(`level ${i + 1} miss costs 5s`, beforeMiss - afterMiss.timeLeft >= 4.8, `lost ${(beforeMiss - afterMiss.timeLeft).toFixed(2)}s`);
  check(`level ${i + 1} miss counted`, afterMiss.misses === 1, `got ${afterMiss.misses}`);

  for (const diff of level.differences) {
    await page.evaluate((id) => window.__twin.findDiff(id), diff.id);
  }
  const afterFinds = await page.evaluate(() => window.__twin.state);
  check(`level ${i + 1} counter reaches zero`, afterFinds.remaining === 0, `got ${afterFinds.remaining}`);
  await page.waitForSelector('.complete-modal', { timeout: 4000 });
  const modalText = (await page.locator('.complete-modal').innerText()).toLowerCase();
  check(`level ${i + 1} complete screen`, modalText.includes('scene cleared') && modalText.includes(level.name.toLowerCase()), modalText.slice(0, 80));
  const panels = await page.locator('.panel svg.scene').count();
  check(`level ${i + 1} has two panels`, panels === 2, `got ${panels}`);
}

const shotQueries = ['?shot=title', '?shot=select', '?shot=hunt&level=3', '?shot=hint&level=5', '?shot=complete&level=2'];
for (const query of shotQueries) {
  await open(query);
  await page.waitForTimeout(350);
  const state = await page.evaluate(() => window.__twin.state);
  check(`shot ${query} renders a screen`, ['title', 'select', 'hunt'].includes(state.screen), state.screen);
}

await open('');
await page.evaluate(() => window.__twin.startLevel(0));
await page.keyboard.press('h');
await page.keyboard.press('z');
await page.keyboard.press('ArrowRight');
await page.keyboard.press('p');
const keyboardState = await page.evaluate(() => window.__twin.state);
check('keyboard controls respond', keyboardState.paused === true && keyboardState.hintsLeft === 2, JSON.stringify(keyboardState));

await browser.close();

check('no external network requests', external.length === 0, external.join(', '));
check('no runtime errors', runtimeErrors.length === 0, runtimeErrors.join('\n'));

const failures = checks.filter((c) => !c.ok);
console.log(JSON.stringify({
  passed: checks.length - failures.length,
  failed: failures.length,
  failures,
  externalRequests: external,
  runtimeErrors,
}, null, 2));

if (failures.length) process.exit(1);
