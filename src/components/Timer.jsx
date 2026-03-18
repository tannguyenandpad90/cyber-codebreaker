import { useState, useEffect, useRef } from 'react';

export default function Timer({ running, onTimeUpdate }) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (running) {
      startRef.current = Date.now() - elapsed;
      const tick = () => {
        const now = Date.now() - startRef.current;
        setElapsed(now);
        onTimeUpdate?.(now);
        frameRef.current = requestAnimationFrame(tick);
      };
      frameRef.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(frameRef.current);
    }
    return () => cancelAnimationFrame(frameRef.current);
  }, [running]);

  // Reset when running becomes true from a fresh start
  useEffect(() => {
    if (running && elapsed === 0) {
      startRef.current = Date.now();
    }
  }, [running]);

  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    const centis = Math.floor((ms % 1000) / 10);
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(centis).padStart(2, '0')}`;
  };

  return (
    <div className="font-mono text-sm">
      <span className="text-neon-yellow/60">TIME: </span>
      <span className="text-neon-yellow font-bold tracking-wider">
        {formatTime(elapsed)}
      </span>
    </div>
  );
}

export function formatTimeCompact(ms) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return min > 0 ? `${min}m${sec}s` : `${sec}s`;
}
