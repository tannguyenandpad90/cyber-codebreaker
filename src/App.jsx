import { useReducer, useState, useEffect, useCallback, useRef } from 'react';
import { gameReducer, createInitialState, ACTIONS } from './gameReducer';
import { COLORS } from './gameLogic';
import ColorPicker from './components/ColorPicker';
import CurrentGuess from './components/CurrentGuess';
import GuessHistory from './components/GuessHistory';
import GameStatus from './components/GameStatus';
import CyberBackground from './components/CyberBackground';
import ParticleExplosion from './components/ParticleExplosion';
import Timer from './components/Timer';
import DifficultySelector from './components/DifficultySelector';
import HintPanel from './components/HintPanel';
import StatsPanel, { updateStats } from './components/StatsPanel';
import {
  playSelectSound, playRemoveSound, playSubmitSound,
  playWinSound, playLoseSound, playHintSound, playErrorSound,
} from './sounds';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, null, () => createInitialState('normal'));
  const [shakeSubmit, setShakeSubmit] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const prevStatusRef = useRef('playing');

  const {
    secretCode, currentGuess, guessHistory, gameStatus, currentRound,
    codeLength, maxGuesses, maxHints, hintsUsed, revealedPositions,
    allowDuplicates, colorCount, difficulty,
  } = state;

  const isPlaying = gameStatus === 'playing';
  const remainingGuesses = maxGuesses - currentRound;
  const timerRunning = isPlaying && currentRound >= 0;

  // Sound helper
  const sfx = useCallback((fn) => { if (soundEnabled) fn(); }, [soundEnabled]);

  // Handle game end
  useEffect(() => {
    if (prevStatusRef.current === 'playing' && gameStatus !== 'playing') {
      const won = gameStatus === 'won';
      if (won) {
        sfx(playWinSound);
        setShowParticles(true);
        setTimeout(() => setShowParticles(false), 3000);
      } else {
        sfx(playLoseSound);
      }
      updateStats(won, currentRound, elapsedTime);
    }
    prevStatusRef.current = gameStatus;
  }, [gameStatus]);

  // Keyboard support
  useEffect(() => {
    function handleKey(e) {
      if (!isPlaying || showStats) return;

      // Number keys 1-6 to select colors
      const num = parseInt(e.key);
      if (num >= 1 && num <= colorCount) {
        const color = COLORS[num - 1];
        if (color) {
          dispatch({ type: ACTIONS.SELECT_COLOR, color: color.id });
          sfx(playSelectSound);
        }
        return;
      }

      // Enter to submit
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
        return;
      }

      // Backspace to remove last
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (currentGuess.length > 0) {
          dispatch({ type: ACTIONS.REMOVE_COLOR, index: currentGuess.length - 1 });
          sfx(playRemoveSound);
        }
        return;
      }

      // H for hint
      if (e.key === 'h' || e.key === 'H') {
        handleHint();
        return;
      }
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlaying, currentGuess, showStats, colorCount, soundEnabled]);

  const handleSelectColor = (colorId) => {
    dispatch({ type: ACTIONS.SELECT_COLOR, color: colorId });
    sfx(playSelectSound);
  };

  const handleRemoveColor = (index) => {
    dispatch({ type: ACTIONS.REMOVE_COLOR, index });
    sfx(playRemoveSound);
  };

  const handleSubmit = () => {
    if (currentGuess.length !== codeLength) {
      setShakeSubmit(true);
      sfx(playErrorSound);
      setTimeout(() => setShakeSubmit(false), 500);
      return;
    }
    sfx(playSubmitSound);
    dispatch({ type: ACTIONS.SUBMIT_GUESS });
  };

  const handleHint = () => {
    if (hintsUsed >= maxHints) {
      sfx(playErrorSound);
      return;
    }
    sfx(playHintSound);
    dispatch({ type: ACTIONS.USE_HINT });
  };

  const handleReset = (newDifficulty) => {
    dispatch({ type: ACTIONS.RESET_GAME, difficulty: newDifficulty || difficulty });
    setElapsedTime(0);
    setShowParticles(false);
  };

  const handleDifficultyChange = (diff) => {
    handleReset(diff);
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-white relative">
      <CyberBackground />
      <ParticleExplosion active={showParticles} />

      <div className="relative z-10 scanline">
        {/* Header */}
        <header className="pt-5 pb-3 text-center border-b border-cyber-border bg-cyber-dark/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center justify-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold tracking-wider neon-text-cyan">
              CYBER CODEBREAKER
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowStats(true)}
                className="px-2 py-1 rounded text-xs font-mono border border-cyber-border text-gray-500 hover:text-neon-cyan hover:border-neon-cyan/30 transition-all cursor-pointer"
                title="Stats"
              >
                STATS
              </button>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`px-2 py-1 rounded text-xs font-mono border transition-all cursor-pointer ${
                  soundEnabled
                    ? 'border-neon-green/30 text-neon-green/70'
                    : 'border-gray-700 text-gray-600'
                }`}
                title={soundEnabled ? 'Mute' : 'Unmute'}
              >
                {soundEnabled ? 'SFX ON' : 'SFX OFF'}
              </button>
            </div>
          </div>
          <p className="text-neon-purple/50 text-[10px] tracking-[0.3em] uppercase mt-1">
            // Crack the {codeLength}-color encryption sequence
          </p>
        </header>

        <main className="max-w-lg mx-auto px-4 py-5 space-y-5">
          {/* Difficulty Selector */}
          <DifficultySelector
            current={difficulty}
            onSelect={handleDifficultyChange}
            disabled={currentRound > 0 && isPlaying}
          />

          {/* Status Bar + Timer */}
          {isPlaying && (
            <div className="flex justify-between items-center text-xs font-mono px-1">
              <span className="text-neon-cyan/70">
                ROUND: <span className="text-neon-cyan font-bold">{currentRound + 1}</span>/{maxGuesses}
              </span>
              <Timer running={timerRunning} onTimeUpdate={setElapsedTime} key={state.secretCode.join()} />
              <span className={`${remainingGuesses <= 3 ? 'text-red-400 animate-neon-pulse' : 'text-neon-green/70'}`}>
                LEFT: <span className="font-bold">{remainingGuesses}</span>
              </span>
            </div>
          )}

          {/* Game Over / Win */}
          <GameStatus
            gameStatus={gameStatus}
            secretCode={secretCode}
            currentRound={currentRound}
            onReset={() => handleReset()}
            elapsedTime={elapsedTime}
          />

          {/* Current Guess */}
          {isPlaying && (
            <section className="space-y-3">
              <h2 className="text-xs font-mono text-neon-purple/70 tracking-wider uppercase text-center">
                {'> Current Input'}
              </h2>
              <CurrentGuess
                guess={currentGuess}
                onRemoveColor={handleRemoveColor}
                disabled={!isPlaying}
                codeLength={codeLength}
              />

              {/* Submit */}
              <div className="text-center">
                <button
                  onClick={handleSubmit}
                  disabled={currentGuess.length !== codeLength}
                  className={`
                    px-8 py-2.5 rounded-lg font-mono text-sm font-bold uppercase tracking-wider
                    transition-all duration-200 cursor-pointer
                    ${currentGuess.length === codeLength
                      ? 'bg-neon-purple/20 border-2 border-neon-purple text-neon-purple hover:bg-neon-purple/30 active:scale-95 neon-border-purple'
                      : 'bg-gray-800/50 border-2 border-gray-700 text-gray-600 cursor-not-allowed'
                    }
                    ${shakeSubmit ? 'animate-shake' : ''}
                  `}
                >
                  {'> SUBMIT [Enter]'}
                </button>
              </div>
            </section>
          )}

          {/* Color Picker */}
          {isPlaying && (
            <section className="space-y-2">
              <h2 className="text-xs font-mono text-neon-purple/70 tracking-wider uppercase text-center">
                {'> Select Colors [1-' + colorCount + ']'}
              </h2>
              <ColorPicker
                onSelectColor={handleSelectColor}
                currentGuess={currentGuess}
                disabled={!isPlaying}
                colorCount={colorCount}
                allowDuplicates={allowDuplicates}
              />
            </section>
          )}

          {/* Hint */}
          {isPlaying && (
            <HintPanel
              secretCode={secretCode}
              revealedPositions={revealedPositions}
              hintsUsed={hintsUsed}
              maxHints={maxHints}
              onUseHint={handleHint}
              disabled={!isPlaying}
            />
          )}

          {/* Legend */}
          {isPlaying && (
            <div className="flex flex-wrap justify-center gap-4 text-[10px] font-mono text-gray-600 border-t border-cyber-border pt-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" style={{ boxShadow: '0 0 4px rgba(255,0,64,0.6)' }} />
                Correct pos
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white inline-block" style={{ boxShadow: '0 0 4px rgba(255,255,255,0.4)' }} />
                Wrong pos
              </span>
              <span className="text-gray-700">|</span>
              <span>Backspace = undo</span>
              <span>H = hint</span>
            </div>
          )}

          {/* Guess History */}
          <section>
            <h2 className="text-xs font-mono text-neon-cyan/50 tracking-wider uppercase text-center mb-2">
              {'> Decode Log'}
            </h2>
            <GuessHistory history={guessHistory} codeLength={codeLength} />
          </section>
        </main>

        <footer className="text-center py-3 text-gray-700 text-[10px] font-mono border-t border-cyber-border">
          CYBER CODEBREAKER v2.0 // MASTERMIND PROTOCOL // {difficulty.toUpperCase()} MODE
        </footer>
      </div>

      <StatsPanel show={showStats} onClose={() => setShowStats(false)} />
    </div>
  );
}
