import { scenePoint } from './hitTest.js';

export function initInput(panels, handlers) {
  panels.forEach((panel, index) => {
    panel.addEventListener('click', (event) => {
      handlers.onPanelClick(scenePoint(event, panel), index);
    });
    panel.addEventListener('mousemove', (event) => {
      handlers.onPanelMove(event.clientX, event.clientY, index);
    });
    panel.addEventListener('mouseleave', () => handlers.onPanelLeave());
  });

  window.addEventListener('keydown', (event) => {
    const key = event.key;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', ' ', 'Escape'].includes(key)) event.preventDefault();
    const active = document.activeElement;
    if ((key === 'Enter' || key === ' ') && active && active.tagName === 'BUTTON') return;
    handlers.onKey(key, event);
  });

  window.addEventListener('blur', () => handlers.onBlur());
}
