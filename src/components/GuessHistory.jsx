import { getColorById } from '../gameLogic';

function FeedbackPegs({ feedback, codeLength }) {
  const pegs = [];
  for (let i = 0; i < feedback.red; i++) {
    pegs.push(
      <div
        key={`red-${i}`}
        className="w-3.5 h-3.5 rounded-full animate-flip-reveal"
        style={{
          backgroundColor: '#ff0040',
          boxShadow: '0 0 8px rgba(255, 0, 64, 0.8)',
          animationDelay: `${i * 100}ms`,
        }}
        title="Correct color & position"
      />
    );
  }
  for (let i = 0; i < feedback.white; i++) {
    pegs.push(
      <div
        key={`white-${i}`}
        className="w-3.5 h-3.5 rounded-full animate-flip-reveal"
        style={{
          backgroundColor: '#ffffff',
          boxShadow: '0 0 8px rgba(255, 255, 255, 0.6)',
          animationDelay: `${(feedback.red + i) * 100}ms`,
        }}
        title="Correct color, wrong position"
      />
    );
  }
  const empty = codeLength - feedback.red - feedback.white;
  for (let i = 0; i < empty; i++) {
    pegs.push(
      <div
        key={`empty-${i}`}
        className="w-3.5 h-3.5 rounded-full bg-gray-700/50 border border-gray-600/30"
      />
    );
  }

  const cols = codeLength <= 4 ? 2 : 3;
  return (
    <div className={`grid gap-1.5`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, width: cols === 2 ? '2.5rem' : '3.5rem' }}>
      {pegs}
    </div>
  );
}

export default function GuessHistory({ history, codeLength = 4 }) {
  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neon-cyan/30 text-sm tracking-widest uppercase">
          // No attempts yet
        </p>
        <p className="text-gray-600 text-xs mt-1">
          Select {codeLength} colors and submit your guess
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {history.map((entry, rowIdx) => (
        <div
          key={rowIdx}
          className="flex items-center gap-3 bg-cyber-card/80 border border-cyber-border rounded-lg px-3 py-2.5 animate-slide-in"
          style={{ animationDelay: `${rowIdx * 50}ms` }}
        >
          <span className="text-neon-purple/60 text-xs font-mono w-6 shrink-0">
            {String(rowIdx + 1).padStart(2, '0')}
          </span>

          <div className="flex gap-1.5">
            {entry.guess.map((colorId, colIdx) => {
              const color = getColorById(colorId);
              return (
                <div
                  key={colIdx}
                  className="w-9 h-9 rounded-md animate-flip-reveal"
                  style={{
                    backgroundColor: color?.hex || '#333',
                    boxShadow: `0 0 8px ${color?.glow || 'transparent'}`,
                    animationDelay: `${colIdx * 80}ms`,
                  }}
                />
              );
            })}
          </div>

          <div className="mx-1 w-px h-8 bg-cyber-border" />

          <FeedbackPegs feedback={entry.feedback} codeLength={codeLength} />

          <div className="ml-auto text-xs font-mono whitespace-nowrap">
            <span className="text-red-400">{entry.feedback.red}R</span>
            {' '}
            <span className="text-gray-300">{entry.feedback.white}W</span>
          </div>
        </div>
      ))}
    </div>
  );
}
