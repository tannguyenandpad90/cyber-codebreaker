export const DIFFICULTIES = {
  easy: {
    label: 'EASY',
    description: '4 colors from 5 / 12 attempts / 2 hints',
    colorCount: 5,
    codeLength: 4,
    maxGuesses: 12,
    maxHints: 2,
    allowDuplicates: false,
  },
  normal: {
    label: 'NORMAL',
    description: '4 colors from 6 / 10 attempts / 1 hint',
    colorCount: 6,
    codeLength: 4,
    maxGuesses: 10,
    maxHints: 1,
    allowDuplicates: false,
  },
  hard: {
    label: 'HARD',
    description: '5 colors from 6 / 8 attempts / 0 hints / dupes allowed',
    colorCount: 6,
    codeLength: 5,
    maxGuesses: 8,
    maxHints: 0,
    allowDuplicates: true,
  },
};

export default function DifficultySelector({ current, onSelect, disabled }) {
  return (
    <div className="flex gap-2 justify-center">
      {Object.entries(DIFFICULTIES).map(([key, diff]) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          disabled={disabled}
          className={`
            px-4 py-2 rounded-md font-mono text-xs uppercase tracking-wider
            border transition-all duration-200 cursor-pointer
            ${current === key
              ? 'border-neon-cyan bg-neon-cyan/15 text-neon-cyan neon-border'
              : 'border-cyber-border bg-cyber-card text-gray-500 hover:text-gray-300 hover:border-gray-500'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          title={diff.description}
        >
          {diff.label}
        </button>
      ))}
    </div>
  );
}
