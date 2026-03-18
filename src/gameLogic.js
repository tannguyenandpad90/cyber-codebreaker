// 6 colors available for the game
export const COLORS = [
  { id: 'red', name: 'RED', hex: '#ff0040', glow: 'rgba(255, 0, 64, 0.5)' },
  { id: 'blue', name: 'BLUE', hex: '#0080ff', glow: 'rgba(0, 128, 255, 0.5)' },
  { id: 'green', name: 'GRN', hex: '#39ff14', glow: 'rgba(57, 255, 20, 0.5)' },
  { id: 'yellow', name: 'YLW', hex: '#fff700', glow: 'rgba(255, 247, 0, 0.5)' },
  { id: 'purple', name: 'PRP', hex: '#b400ff', glow: 'rgba(180, 0, 255, 0.5)' },
  { id: 'cyan', name: 'CYN', hex: '#00f0ff', glow: 'rgba(0, 240, 255, 0.5)' },
];

export const CODE_LENGTH = 4;
export const MAX_GUESSES = 10;

// Generate a secret code of 4 unique random colors
export function generateSecretCode() {
  const shuffled = [...COLORS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, CODE_LENGTH).map((c) => c.id);
}

// Compare guess against secret code
// Returns { red: number, white: number }
// red = correct color in correct position
// white = correct color in wrong position
export function checkGuess(guess, secretCode) {
  let red = 0;
  let white = 0;

  const secretRemaining = [];
  const guessRemaining = [];

  // First pass: find exact matches (red pegs)
  for (let i = 0; i < CODE_LENGTH; i++) {
    if (guess[i] === secretCode[i]) {
      red++;
    } else {
      secretRemaining.push(secretCode[i]);
      guessRemaining.push(guess[i]);
    }
  }

  // Second pass: find color matches in wrong position (white pegs)
  for (const color of guessRemaining) {
    const idx = secretRemaining.indexOf(color);
    if (idx !== -1) {
      white++;
      secretRemaining.splice(idx, 1);
    }
  }

  return { red, white };
}
