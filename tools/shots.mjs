import { chromium } from '/tmp/pw-tools/node_modules/playwright-core/index.mjs';
import { mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.BASE_URL || 'http://localhost:8123/';
const OUT = new URL('../screenshots/', import.meta.url).pathname;
const shots = [
  { file: '1-hunt.jpg', query: '?shot=hunt&level=3', wait: 900 },
  { file: '2-hint.jpg', query: '?shot=hint&level=5', wait: 700 },
  { file: '3-complete.jpg', query: '?shot=complete&level=2', wait: 500 },
  { file: '4-title.jpg', query: '?shot=title', wait: 700 },
];

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
page.on('pageerror', (error) => console.error('PAGE ERROR', error.message));

for (const shot of shots) {
  await page.goto(BASE + shot.query, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__twin?.ready === true);
  await page.waitForTimeout(shot.wait);
  const path = join(OUT, shot.file);
  await page.screenshot({ path, type: 'jpeg', quality: 85, clip: { x: 0, y: 0, width: 1280, height: 720 } });
  console.log(`${shot.file}: ${statSync(path).size} bytes`);
}

await browser.close();
