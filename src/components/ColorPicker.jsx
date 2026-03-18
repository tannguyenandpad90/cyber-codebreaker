import { COLORS } from '../gameLogic';

export default function ColorPicker({ onSelectColor, currentGuess, disabled, colorCount = 6, allowDuplicates = false }) {
  const available = COLORS.slice(0, colorCount);

  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {available.map((color) => {
        const isSelected = !allowDuplicates && currentGuess.includes(color.id);
        return (
          <button
            key={color.id}
            onClick={() => onSelectColor(color.id)}
            disabled={disabled || isSelected}
            className={`
              w-14 h-14 rounded-lg border-2 transition-all duration-200 cursor-pointer relative
              ${isSelected
                ? 'opacity-30 scale-90 border-gray-700'
                : 'hover:scale-110 active:scale-95 border-transparent hover:border-white/30'
              }
              ${disabled ? 'cursor-not-allowed opacity-50' : ''}
            `}
            style={{
              backgroundColor: color.hex,
              boxShadow: isSelected ? 'none' : `0 0 15px ${color.glow}, 0 0 30px ${color.glow}`,
            }}
            title={`${color.name} [${color.key}]`}
          >
            <span className="text-xs font-bold text-black/60 drop-shadow-sm">
              {color.name}
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 text-[9px] bg-black/50 text-white/50 rounded px-1 font-mono">
              {color.key}
            </span>
          </button>
        );
      })}
    </div>
  );
}
