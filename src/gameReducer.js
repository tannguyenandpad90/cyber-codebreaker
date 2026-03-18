import { generateSecretCode, checkGuess, CODE_LENGTH, MAX_GUESSES } from './gameLogic';

export const ACTIONS = {
  SELECT_COLOR: 'SELECT_COLOR',
  REMOVE_COLOR: 'REMOVE_COLOR',
  SUBMIT_GUESS: 'SUBMIT_GUESS',
  RESET_GAME: 'RESET_GAME',
};

export function createInitialState() {
  return {
    secretCode: generateSecretCode(),
    currentGuess: [],
    guessHistory: [], // [{ guess: [...], feedback: { red, white } }]
    gameStatus: 'playing', // 'playing' | 'won' | 'lost'
    currentRound: 0,
    lastAction: null, // for triggering animations
  };
}

export function gameReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SELECT_COLOR: {
      if (state.gameStatus !== 'playing') return state;
      if (state.currentGuess.length >= CODE_LENGTH) return state;
      // Don't allow duplicate colors in a guess
      if (state.currentGuess.includes(action.color)) return state;
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
      if (state.currentGuess.length !== CODE_LENGTH) return state;

      const feedback = checkGuess(state.currentGuess, state.secretCode);
      const newHistory = [
        ...state.guessHistory,
        { guess: [...state.currentGuess], feedback },
      ];
      const newRound = state.currentRound + 1;

      let gameStatus = 'playing';
      if (feedback.red === CODE_LENGTH) {
        gameStatus = 'won';
      } else if (newRound >= MAX_GUESSES) {
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

    case ACTIONS.RESET_GAME: {
      return createInitialState();
    }

    default:
      return state;
  }
}
