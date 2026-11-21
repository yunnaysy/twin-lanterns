const LENS_RADIUS = 88;
let panels = [];
let lenses = [];
let enabled = false;

export function initMagnifier(panelElements, lensElements) {
  panels = panelElements;
  lenses = lensElements;
  refreshMagnifier();
}

export function setMagnifierEnabled(value) {
  enabled = value;
  if (!enabled) lenses.forEach((lens) => lens.classList.remove('visible'));
  return enabled;
}

export function magnifierEnabled() {
  return enabled;
}

export function refreshMagnifier() {
  lenses.forEach((lens, i) => {
    const source = panels[i]?.querySelector('svg.scene');
    const holder = lens.querySelector('.lens-content');
    if (source && holder) holder.innerHTML = source.outerHTML;
    lens.classList.remove('visible');
  });
}

export function updateMagnifier(clientX, clientY) {
  if (!enabled) return;
  panels.forEach((panel, i) => {
    const lens = lenses[i];
    if (!lens) return;
    const rect = panel.getBoundingClientRect();
    const inside = clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
    lens.classList.toggle('visible', inside);
    if (!inside) return;
    const localX = clientX - rect.left;
    const localY = clientY - rect.top;
    const wrapRect = panel.parentElement.getBoundingClientRect();
    lens.style.left = `${clientX - wrapRect.left - LENS_RADIUS}px`;
    lens.style.top = `${clientY - wrapRect.top - LENS_RADIUS}px`;
    const svg = lens.querySelector('svg');
    if (svg) {
      svg.style.width = `${rect.width * 2}px`;
      svg.style.height = `${rect.height * 2}px`;
      svg.style.left = `${LENS_RADIUS - localX * 2}px`;
      svg.style.top = `${LENS_RADIUS - localY * 2}px`;
    }
  });
}
