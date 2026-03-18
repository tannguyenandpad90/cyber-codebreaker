import { COLORS, CODE_LENGTH } from '../gameLogic';

function getColorHex(colorId) {
  return COLORS.find((c) => c.id === colorId)?.hex || 'transparent';
}

function getColorGlow(colorId) {
  return COLORS.find((c) => c.id === colorId)?.glow || 'transparent';
}

export default function CurrentGuess({ guess, onRemoveColor, disabled }) {
  const slots = Array.from({ length: CODE_LENGTH }, (_, i) => guess[i] || null);

  return (
    <div className="flex gap-3 justify-center">
      {slots.map((colorId, index) => (
        <button
          key={index}
          onClick={() => colorId && !disabled && onRemoveColor(index)}
          className={`
            w-16 h-16 rounded-lg border-2 transition-all duration-300
            ${colorId
              ? 'animate-glow-in cursor-pointer hover:scale-105 active:scale-95 border-white/20'
              : 'border-dashed border-neon-cyan/30 bg-cyber-card'
            }
            ${!colorId ? 'animate-neon-pulse' : ''}
          `}
          style={colorId ? {
            backgroundColor: getColorHex(colorId),
            boxShadow: `0 0 10px ${getColorGlow(colorId)}`,
          } : {}}
          disabled={!colorId || disabled}
        >
          {!colorId && (
            <span className="text-neon-cyan/30 text-2xl">?</span>
          )}
        </button>
      ))}
    </div>
  );
}
