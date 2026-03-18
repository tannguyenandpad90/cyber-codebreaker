import { useReducer, useState } from 'react';
import { gameReducer, createInitialState, ACTIONS } from './gameReducer';
import { MAX_GUESSES, CODE_LENGTH } from './gameLogic';
import ColorPicker from './components/ColorPicker';
import CurrentGuess from './components/CurrentGuess';
import GuessHistory from './components/GuessHistory';
import GameStatus from './components/GameStatus';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);
  const [shakeSubmit, setShakeSubmit] = useState(false);

  const { secretCode, currentGuess, guessHistory, gameStatus, currentRound } = state;

  const handleSelectColor = (colorId) => {
    dispatch({ type: ACTIONS.SELECT_COLOR, color: colorId });
  };

  const handleRemoveColor = (index) => {
    dispatch({ type: ACTIONS.REMOVE_COLOR, index });
  };

  const handleSubmit = () => {
    if (currentGuess.length !== CODE_LENGTH) {
      setShakeSubmit(true);
      setTimeout(() => setShakeSubmit(false), 500);
      return;
    }
    dispatch({ type: ACTIONS.SUBMIT_GUESS });
  };

  const handleReset = () => {
    dispatch({ type: ACTIONS.RESET_GAME });
  };

  const isPlaying = gameStatus === 'playing';
  const remainingGuesses = MAX_GUESSES - currentRound;

  return (
    <div className="min-h-screen bg-cyber-dark text-white scanline">
      {/* Header */}
      <header className="pt-6 pb-4 text-center border-b border-cyber-border">
        <h1 className="text-3xl md:text-4xl font-bold tracking-wider neon-text-cyan">
          CYBER CODEBREAKER
        </h1>
        <p className="text-neon-purple/60 text-xs tracking-[0.3em] uppercase mt-1">
          // Crack the 4-color encryption sequence
        </p>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Status Bar */}
        {isPlaying && (
          <div className="flex justify-between items-center text-xs font-mono px-2">
            <span className="text-neon-cyan/70">
              ROUND: <span className="text-neon-cyan font-bold">{currentRound + 1}</span>/{MAX_GUESSES}
            </span>
            <span className={`${remainingGuesses <= 3 ? 'text-red-400' : 'text-neon-green/70'}`}>
              ATTEMPTS LEFT: <span className="font-bold">{remainingGuesses}</span>
            </span>
          </div>
        )}

        {/* Game Over / Win Screen */}
        <GameStatus
          gameStatus={gameStatus}
          secretCode={secretCode}
          currentRound={currentRound}
          onReset={handleReset}
        />

        {/* Current Guess */}
        {isPlaying && (
          <section className="space-y-4">
            <div className="text-center">
              <h2 className="text-sm font-mono text-neon-purple/80 tracking-wider uppercase mb-3">
                {'> Current Input'}
              </h2>
              <CurrentGuess
                guess={currentGuess}
                onRemoveColor={handleRemoveColor}
                disabled={!isPlaying}
              />
              <p className="text-gray-600 text-xs mt-2">Click a slot to remove</p>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={currentGuess.length !== CODE_LENGTH}
                className={`
                  px-8 py-3 rounded-lg font-mono text-sm font-bold uppercase tracking-wider
                  transition-all duration-200 cursor-pointer
                  ${currentGuess.length === CODE_LENGTH
                    ? 'bg-neon-purple/20 border-2 border-neon-purple text-neon-purple hover:bg-neon-purple/30 active:scale-95 neon-border-purple'
                    : 'bg-gray-800/50 border-2 border-gray-700 text-gray-600 cursor-not-allowed'
                  }
                  ${shakeSubmit ? 'animate-shake' : ''}
                `}
              >
                {'> SUBMIT DECODE'}
              </button>
            </div>
          </section>
        )}

        {/* Color Picker */}
        {isPlaying && (
          <section className="space-y-3">
            <h2 className="text-sm font-mono text-neon-purple/80 tracking-wider uppercase text-center">
              {'> Select Colors'}
            </h2>
            <ColorPicker
              onSelectColor={handleSelectColor}
              currentGuess={currentGuess}
              disabled={!isPlaying}
            />
          </section>
        )}

        {/* Legend */}
        {isPlaying && (
          <div className="flex justify-center gap-6 text-xs font-mono text-gray-500 border-t border-cyber-border pt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" style={{ boxShadow: '0 0 6px rgba(255,0,64,0.6)' }} />
              <span>= Correct position</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white" style={{ boxShadow: '0 0 6px rgba(255,255,255,0.4)' }} />
              <span>= Wrong position</span>
            </div>
          </div>
        )}

        {/* Guess History */}
        <section>
          <h2 className="text-sm font-mono text-neon-cyan/60 tracking-wider uppercase text-center mb-3">
            {'> Decode Log'}
          </h2>
          <GuessHistory history={guessHistory} />
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-700 text-xs font-mono border-t border-cyber-border mt-auto">
        CYBER CODEBREAKER v1.0 // Based on MASTERMIND protocol
      </footer>
    </div>
  );
}
