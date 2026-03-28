let ctx: AudioContext | null = null;

const getCtx = (): AudioContext => {
  ctx ??= new AudioContext();
  return ctx;
};

const beep = (
  freq: number,
  duration: number,
  type: OscillatorType = 'square',
  gain = 0.12
): void => {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.connect(g);
    g.connect(c.destination);
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(gain, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    osc.start();
    osc.stop(c.currentTime + duration);
  } catch {
    // Audio unavailable (e.g. in test environment) — silently ignore
  }
};

export const sounds = {
  move: () => beep(220, 0.05),
  rotate: () => beep(330, 0.07),
  softDrop: () => beep(180, 0.04),
  hardDrop: () => beep(150, 0.12, 'sawtooth'),
  lineClear: () => beep(660, 0.2, 'sine', 0.22),
  levelUp: () => beep(880, 0.3, 'sine', 0.28),
  gameOver: () => beep(110, 0.5, 'sawtooth', 0.18),
};
