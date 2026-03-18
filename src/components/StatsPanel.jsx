import { formatTimeCompact } from './Timer';

const STORAGE_KEY = 'cyber-codebreaker-stats';

export function loadStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { gamesPlayed: 0, gamesWon: 0, currentStreak: 0, bestStreak: 0, bestTime: null, guessDistribution: {} };
}

export function saveStats(stats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {}
}

export function updateStats(won, guesses, timeMs) {
  const stats = loadStats();
  stats.gamesPlayed++;
  if (won) {
    stats.gamesWon++;
    stats.currentStreak++;
    if (stats.currentStreak > stats.bestStreak) {
      stats.bestStreak = stats.currentStreak;
    }
    if (!stats.bestTime || timeMs < stats.bestTime) {
      stats.bestTime = timeMs;
    }
    const key = String(guesses);
    stats.guessDistribution[key] = (stats.guessDistribution[key] || 0) + 1;
  } else {
    stats.currentStreak = 0;
  }
  saveStats(stats);
  return stats;
}

export default function StatsPanel({ show, onClose }) {
  if (!show) return null;

  const stats = loadStats();
  const winRate = stats.gamesPlayed > 0
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    : 0;

  const maxDist = Math.max(1, ...Object.values(stats.guessDistribution));

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-cyber-dark border-2 border-neon-cyan/30 rounded-xl p-6 w-80 max-w-[90vw] neon-border animate-glow-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold neon-text-cyan text-center mb-4 tracking-wider">
          {'[ OPERATOR STATS ]'}
        </h2>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <StatBox label="PLAYED" value={stats.gamesPlayed} />
          <StatBox label="WIN RATE" value={`${winRate}%`} />
          <StatBox label="STREAK" value={stats.currentStreak} />
          <StatBox label="BEST STREAK" value={stats.bestStreak} />
        </div>

        {stats.bestTime && (
          <div className="text-center mb-4">
            <span className="text-gray-500 text-xs font-mono">BEST TIME: </span>
            <span className="text-neon-yellow text-sm font-bold font-mono">
              {formatTimeCompact(stats.bestTime)}
            </span>
          </div>
        )}

        {Object.keys(stats.guessDistribution).length > 0 && (
          <div className="mb-4">
            <p className="text-gray-500 text-xs font-mono mb-2 text-center">GUESS DISTRIBUTION</p>
            <div className="space-y-1">
              {Object.entries(stats.guessDistribution)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([guesses, count]) => (
                  <div key={guesses} className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-gray-400 w-4 text-right">{guesses}</span>
                    <div
                      className="h-4 bg-neon-purple/40 rounded-sm flex items-center justify-end pr-1"
                      style={{ width: `${(count / maxDist) * 100}%`, minWidth: '20px' }}
                    >
                      <span className="text-white text-[10px]">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2 rounded-md font-mono text-xs uppercase tracking-wider
            border border-neon-cyan/30 text-neon-cyan/70 hover:bg-neon-cyan/10
            transition-all duration-200 cursor-pointer"
        >
          {'> CLOSE'}
        </button>
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="bg-cyber-card border border-cyber-border rounded-lg p-3 text-center">
      <div className="text-xl font-bold text-neon-cyan">{value}</div>
      <div className="text-[10px] text-gray-500 font-mono tracking-wider mt-1">{label}</div>
    </div>
  );
}
