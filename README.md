# Twin Lanterns

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/yunnaysy/twin-lanterns/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/yunnaysy/twin-lanterns/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Built for make.fun's bounty: https://make.fun/bounty/best-spot-the-difference-game-20261121-0451
Live demo: https://yunnaysy.github.io/twin-lanterns/

An original spot-the-difference game set in a floating river town at Lantern Festival night. Six illustrated scenes — Harbour Gate, Noodle Market, Kite Bridge, Moon Pagoda, Lotus Pond and Fireworks Pier — are drawn entirely in code as layered SVG: moonlit skies, tiled rooftops, arched bridges, boats, kites, paper lanterns, fish, lotus flowers, fireworks and their reflections on the water.

Two equal panels show the same scene. The right panel has a handful of visible changes: an object removed, a colour swapped, a stripe count altered, a reflection gone wrong. Find every change before the lantern light runs out.

## What's in each scene

| Scene | Hidden changes | A closer look |
| --- | --- | --- |
| Harbour Gate | 5 | A gate strung with banners, tiled rooftops, moored sailboats, a market crowd and the first lantern reflections. |
| Noodle Market | 6 | Steam curls over a row of striped stalls, paper signs, balconies, floating lanterns and a cat by the counter. |
| Kite Bridge | 7 | Kites drift above an arched bridge while lantern strings, boats and their reflections cross the river. |
| Moon Pagoda | 7 | A tiered shrine holds a banner aloft; moon ripples, birds, fish and a shoreline crowd surround it. |
| Lotus Pond | 8 | Lotus blooms and lily pads fill the shallows with fireflies, a bridge, a frog and drifting water lanterns. |
| Fireworks Pier | 9 | Bursts of light over a crowded pier, awnings, flags, boats and a river full of coloured reflections. |

Every scene is composed from code-drawn layers: night gradients, constellations, mist, distant rooftops, balconies, drawn glyph signs, bunting, crowds, boats with wakes, lilies, fish, reeds and soft lantern glow. The two panels render from the same scene description; the right panel applies that level's list of data-defined changes.

## How to play

- Click anywhere on either picture where something has changed. Found differences are ringed in amber on **both** panels.
- A wrong click costs 5 seconds. Three fast misses briefly lock the panels.
- Quick finds build a combo multiplier. Remaining time becomes a bonus at the end of each scene.
- Each scene has three hints. A hint shows a glowing clue circle around the general region, not the exact spot.
- Stars (1–3) depend on time left and misses. Progress, stars and best scores are saved in your browser.

## Controls

| Key / action | Effect |
| --- | --- |
| Mouse click | Mark a difference |
| `H` | Use a hint |
| `Z` | Toggle the 2× magnifier (follows the mouse on both panels) |
| Arrow keys / `Tab` | Move the keyboard crosshair |
| `Enter` / `Space` | Click the crosshair, or continue on menus |
| `1`–`6` | Choose an unlocked scene on the level select |
| `M` | Mute / unmute the synthesized sounds |
| `P` / `Esc` | Pause menu |

## Run locally

```sh
node serve.ts
```

Then open http://localhost:8080. No install, build step or network connection is needed: the game is plain HTML, CSS and ES modules under `game/`, with all sounds synthesized in the browser with WebAudio.

To run the automated browser checks (requires Playwright core and Chrome) while the server is running on port 8123:

```sh
node serve.ts --port 8123
node tools/playtest.mjs
node tools/shots.mjs
```

Screenshot modes are available through the URL: `?shot=hunt&level=3`, `?shot=hint&level=5`, `?shot=complete&level=2`, `?shot=title` and `?shot=select`. Add `&debug=1` to outline every difference hit circle.

## Live demo

https://yunnaysy.github.io/twin-lanterns/

## License

MIT — see [LICENSE](LICENSE).
