import { COLORS } from '../gameLogic';

function getColorHex(colorId) {
  return COLORS.find((c) => c.id === colorId)?.hex || '#333';
}

export default function GameStatus({ gameStatus, secretCode, currentRound, onReset }) {
  if (gameStatus === 'playing') return null;

  const isWon = gameStatus === 'won';

  return (
    <div className={`
      text-center py-6 px-8 rounded-xl border-2
      ${isWon
        ? 'border-neon-green/50 bg-neon-green/5 animate-win-glow'
        : 'border-red-500/50 bg-red-500/5'
      }
    `}>
      <h2 className={`text-2xl font-bold mb-2 ${isWon ? 'neon-text-green' : 'neon-text-pink'}`}>
        {isWon ? '[ SYSTEM CRACKED ]' : '[ ACCESS DENIED ]'}
      </h2>
      <p className="text-gray-400 text-sm mb-4">
        {isWon
          ? `Code broken in ${currentRound} attempt${currentRound > 1 ? 's' : ''}!`
          : 'Maximum attempts exceeded. The secret code was:'
        }
      </p>

      {!isWon && (
        <div className="flex gap-2 justify-center mb-4">
          {secretCode.map((colorId, i) => (
            <div
              key={i}
              className="w-12 h-12 rounded-md animate-flip-reveal"
              style={{
                backgroundColor: getColorHex(colorId),
                boxShadow: `0 0 10px ${COLORS.find(c => c.id === colorId)?.glow}`,
                animationDelay: `${i * 150}ms`,
              }}
            />
          ))}
        </div>
      )}

      <button
        onClick={onReset}
        className="
          mt-2 px-6 py-2.5 rounded-lg font-mono text-sm font-bold uppercase tracking-wider
          bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan
          hover:bg-neon-cyan/20 hover:border-neon-cyan
          active:scale-95 transition-all duration-200 cursor-pointer
        "
      >
        {'> REBOOT SYSTEM'}
      </button>
    </div>
  );
}
