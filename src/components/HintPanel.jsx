import { getColorById } from '../gameLogic';

export default function HintPanel({ secretCode, revealedPositions, hintsUsed, maxHints, onUseHint, disabled }) {
  if (maxHints === 0) return null;

  const hintsLeft = maxHints - hintsUsed;

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={onUseHint}
        disabled={disabled || hintsLeft <= 0}
        className={`
          px-4 py-2 rounded-md font-mono text-xs uppercase tracking-wider
          border transition-all duration-200 cursor-pointer
          ${hintsLeft > 0 && !disabled
            ? 'border-neon-yellow/50 bg-neon-yellow/10 text-neon-yellow hover:bg-neon-yellow/20 active:scale-95'
            : 'border-gray-700 bg-gray-800/50 text-gray-600 cursor-not-allowed'
          }
        `}
      >
        {'> HINT'} ({hintsLeft}/{maxHints})
      </button>

      {revealedPositions.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-neon-yellow/50 text-xs font-mono">REVEALED:</span>
          {revealedPositions
            .sort((a, b) => a - b)
            .map((pos) => {
              const color = getColorById(secretCode[pos]);
              return (
                <div key={pos} className="flex items-center gap-1">
                  <span className="text-gray-500 text-xs font-mono">#{pos + 1}</span>
                  <div
                    className="w-6 h-6 rounded animate-glow-in"
                    style={{
                      backgroundColor: color?.hex,
                      boxShadow: `0 0 8px ${color?.glow}`,
                    }}
                  />
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
