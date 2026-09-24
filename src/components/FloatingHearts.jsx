import { useEffect, useState } from "react";
import { useReducedMotion } from "../hooks";

// Ambient hearts drifting up behind the content
export default function FloatingHearts() {
  const reduced = useReducedMotion();
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    if (reduced) return;
    const timers = new Set();
    const interval = setInterval(() => {
      const id = Date.now() + Math.random();
      const roll = Math.random();
      setHearts((h) => [
        ...h.slice(-10),
        {
          id,
          x: 3 + Math.random() * 94,
          size: 12 + Math.random() * 14,
          duration: 6 + Math.random() * 4,
          opacity: 0.35 + Math.random() * 0.4,
          rotate: (Math.random() - 0.5) * 50,
          icon: roll < 0.5 ? "💜" : roll < 0.8 ? "🤍" : "💗",
        },
      ]);
      const t = setTimeout(() => {
        timers.delete(t);
        setHearts((h) => h.filter((x) => x.id !== id));
      }, 10500);
      timers.add(t);
    }, 1400);
    return () => {
      clearInterval(interval);
      timers.forEach(clearTimeout);
    };
  }, [reduced]);

  if (reduced) return null;
  return (
    <div className="hearts" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart"
          style={{
            left: `${h.x}%`,
            fontSize: h.size,
            "--duration": `${h.duration}s`,
            "--opacity": h.opacity,
            "--rotate": `${h.rotate}deg`,
          }}
        >
          {h.icon}
        </span>
      ))}
    </div>
  );
}
