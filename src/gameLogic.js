// 6 colors available for the game
export const COLORS = [
  { id: 'red', name: 'RED', hex: '#ff0040', glow: 'rgba(255, 0, 64, 0.5)', key: '1' },
  { id: 'blue', name: 'BLUE', hex: '#0080ff', glow: 'rgba(0, 128, 255, 0.5)', key: '2' },
  { id: 'green', name: 'GRN', hex: '#39ff14', glow: 'rgba(57, 255, 20, 0.5)', key: '3' },
  { id: 'yellow', name: 'YLW', hex: '#fff700', glow: 'rgba(255, 247, 0, 0.5)', key: '4' },
  { id: 'purple', name: 'PRP', hex: '#b400ff', glow: 'rgba(180, 0, 255, 0.5)', key: '5' },
  { id: 'cyan', name: 'CYN', hex: '#00f0ff', glow: 'rgba(0, 240, 255, 0.5)', key: '6' },
];

export function getColorById(id) {
  return COLORS.find((c) => c.id === id);
}

// Generate a secret code based on difficulty settings
export function generateSecretCode({ colorCount = 6, codeLength = 4, allowDuplicates = false } = {}) {
  const available = COLORS.slice(0, colorCount);

  if (allowDuplicates) {
    return Array.from({ length: codeLength }, () =>
      available[Math.floor(Math.random() * available.length)].id
    );
  }

  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, codeLength).map((c) => c.id);
}

// Compare guess against secret code
// Returns { red: number, white: number }
export function checkGuess(guess, secretCode) {
  let red = 0;
  let white = 0;
  const len = secretCode.length;

  const secretRemaining = [];
  const guessRemaining = [];

  for (let i = 0; i < len; i++) {
    if (guess[i] === secretCode[i]) {
      red++;
    } else {
      secretRemaining.push(secretCode[i]);
      guessRemaining.push(guess[i]);
    }
  }

  for (const color of guessRemaining) {
    const idx = secretRemaining.indexOf(color);
    if (idx !== -1) {
      white++;
      secretRemaining.splice(idx, 1);
    }
  }

  return { red, white };
}
