import { COLORS } from '../gameLogic';

export default function ColorPicker({ onSelectColor, currentGuess, disabled }) {
  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {COLORS.map((color) => {
        const isSelected = currentGuess.includes(color.id);
        return (
          <button
            key={color.id}
            onClick={() => onSelectColor(color.id)}
            disabled={disabled || isSelected}
            className={`
              w-14 h-14 rounded-lg border-2 transition-all duration-200 cursor-pointer
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
            title={color.name}
          >
            <span className="text-xs font-bold text-black/60 drop-shadow-sm">
              {color.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
