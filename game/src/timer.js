export function createTimer(seconds, onExpire) {
  return {
    max: seconds,
    remaining: seconds,
    running: true,
    paused: false,
    onExpire,
    update(dt) {
      if (!this.running || this.paused) return;
      this.remaining -= dt;
      if (this.remaining <= 0) {
        this.remaining = 0;
        this.running = false;
        this.onExpire();
      }
    },
    penalty(seconds) {
      this.remaining = Math.max(0, this.remaining - seconds);
      if (this.remaining === 0 && this.running) {
        this.running = false;
        this.onExpire();
      }
    },
    fraction() {
      return Math.max(0, Math.min(1, this.remaining / this.max));
    },
  };
}
