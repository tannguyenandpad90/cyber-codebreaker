// Cyberpunk synth sound effects using Web Audio API
let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(freq, duration, type = 'square', volume = 0.15) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio not supported
  }
}

export function playSelectSound() {
  playTone(880, 0.08, 'square', 0.1);
  setTimeout(() => playTone(1100, 0.06, 'square', 0.08), 50);
}

export function playRemoveSound() {
  playTone(440, 0.1, 'sawtooth', 0.08);
}

export function playSubmitSound() {
  playTone(660, 0.1, 'square', 0.12);
  setTimeout(() => playTone(880, 0.1, 'square', 0.12), 80);
  setTimeout(() => playTone(1100, 0.15, 'square', 0.1), 160);
}

export function playWinSound() {
  const notes = [523, 659, 784, 1047, 1319, 1568];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.3, 'square', 0.12), i * 100);
  });
  setTimeout(() => {
    playTone(1568, 0.6, 'sine', 0.15);
  }, 600);
}

export function playLoseSound() {
  playTone(400, 0.3, 'sawtooth', 0.15);
  setTimeout(() => playTone(300, 0.3, 'sawtooth', 0.15), 200);
  setTimeout(() => playTone(200, 0.5, 'sawtooth', 0.12), 400);
}

export function playHintSound() {
  playTone(1200, 0.1, 'sine', 0.1);
  setTimeout(() => playTone(1500, 0.1, 'sine', 0.1), 100);
  setTimeout(() => playTone(1800, 0.2, 'sine', 0.12), 200);
}

export function playErrorSound() {
  playTone(200, 0.15, 'square', 0.12);
  setTimeout(() => playTone(150, 0.2, 'square', 0.1), 100);
}

export function playTickSound() {
  playTone(1000, 0.02, 'square', 0.05);
}
