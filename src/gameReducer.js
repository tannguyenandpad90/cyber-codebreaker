import { generateSecretCode, checkGuess } from './gameLogic';
import { DIFFICULTIES } from './components/DifficultySelector';

export const ACTIONS = {
  SELECT_COLOR: 'SELECT_COLOR',
  REMOVE_COLOR: 'REMOVE_COLOR',
  SUBMIT_GUESS: 'SUBMIT_GUESS',
  RESET_GAME: 'RESET_GAME',
  USE_HINT: 'USE_HINT',
};

export function createInitialState(difficulty = 'normal') {
  const diff = DIFFICULTIES[difficulty];
  return {
    difficulty,
    secretCode: generateSecretCode(diff),
    currentGuess: [],
    guessHistory: [],
    gameStatus: 'playing',
    currentRound: 0,
    hintsUsed: 0,
    revealedPositions: [], // indices revealed by hints
    lastAction: null,
    codeLength: diff.codeLength,
    maxGuesses: diff.maxGuesses,
    maxHints: diff.maxHints,
    allowDuplicates: diff.allowDuplicates,
    colorCount: diff.colorCount,
  };
}

export function gameReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SELECT_COLOR: {
      if (state.gameStatus !== 'playing') return state;
      if (state.currentGuess.length >= state.codeLength) return state;
      if (!state.allowDuplicates && state.currentGuess.includes(action.color)) return state;
      return {
        ...state,
        currentGuess: [...state.currentGuess, action.color],
        lastAction: 'select',
      };
    }

    case ACTIONS.REMOVE_COLOR: {
      if (state.gameStatus !== 'playing') return state;
      const newGuess = [...state.currentGuess];
      newGuess.splice(action.index, 1);
      return {
        ...state,
        currentGuess: newGuess,
        lastAction: 'remove',
      };
    }

    case ACTIONS.SUBMIT_GUESS: {
      if (state.gameStatus !== 'playing') return state;
      if (state.currentGuess.length !== state.codeLength) return state;

      const feedback = checkGuess(state.currentGuess, state.secretCode);
      const newHistory = [
        ...state.guessHistory,
        { guess: [...state.currentGuess], feedback },
      ];
      const newRound = state.currentRound + 1;

      let gameStatus = 'playing';
      if (feedback.red === state.codeLength) {
        gameStatus = 'won';
      } else if (newRound >= state.maxGuesses) {
        gameStatus = 'lost';
      }

      return {
        ...state,
        guessHistory: newHistory,
        currentGuess: [],
        currentRound: newRound,
        gameStatus,
        lastAction: 'submit',
      };
    }

    case ACTIONS.USE_HINT: {
      if (state.gameStatus !== 'playing') return state;
      if (state.hintsUsed >= state.maxHints) return state;

      // Find a position not yet revealed
      const unrevealed = [];
      for (let i = 0; i < state.codeLength; i++) {
        if (!state.revealedPositions.includes(i)) {
          unrevealed.push(i);
        }
      }
      if (unrevealed.length === 0) return state;

      const pos = unrevealed[Math.floor(Math.random() * unrevealed.length)];
      return {
        ...state,
        hintsUsed: state.hintsUsed + 1,
        revealedPositions: [...state.revealedPositions, pos],
        lastAction: 'hint',
      };
    }

    case ACTIONS.RESET_GAME: {
      return createInitialState(action.difficulty || state.difficulty);
    }

    default:
      return state;
  }
}
