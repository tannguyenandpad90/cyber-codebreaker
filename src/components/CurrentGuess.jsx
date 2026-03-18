import { getColorById } from '../gameLogic';

export default function CurrentGuess({ guess, onRemoveColor, disabled, codeLength = 4 }) {
  const slots = Array.from({ length: codeLength }, (_, i) => guess[i] || null);

  return (
    <div className="flex gap-3 justify-center">
      {slots.map((colorId, index) => {
        const color = colorId ? getColorById(colorId) : null;
        return (
          <button
            key={index}
            onClick={() => colorId && !disabled && onRemoveColor(index)}
            className={`
              w-14 h-14 md:w-16 md:h-16 rounded-lg border-2 transition-all duration-300
              ${color
                ? 'animate-glow-in cursor-pointer hover:scale-105 active:scale-95 border-white/20'
                : 'border-dashed border-neon-cyan/30 bg-cyber-card'
              }
              ${!color ? 'animate-neon-pulse' : ''}
            `}
            style={color ? {
              backgroundColor: color.hex,
              boxShadow: `0 0 10px ${color.glow}`,
            } : {}}
            disabled={!colorId || disabled}
          >
            {!color && (
              <span className="text-neon-cyan/30 text-2xl">?</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
