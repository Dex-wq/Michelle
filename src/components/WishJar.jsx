import { useRef, useState } from "react";
import { burst } from "../confetti";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const MAX = 20;
const JAR_BOTTOM = 269;
const JAR_TOP = 80;
const BODY = "M56 48C56 62 26 70 26 100v144c0 18 14 28 32 28h84c18 0 32-10 32-28V100c0-30-30-38-30-52Z";
const INSIDE = "M59 50C59 64 29 72 29 101v142c0 16 13 26 29 26h84c16 0 29-10 29-26V101c0-29-30-37-30-51Z";

const STAR_PATH = (() => {
  const points = Array.from({ length: 10 }, (_, k) => {
    const angle = ((-90 + k * 36) * Math.PI) / 180;
    const r = k % 2 ? 0.45 : 1;
    return `${(Math.cos(angle) * r).toFixed(3)} ${(Math.sin(angle) * r).toFixed(3)}`;
  });
  return `M${points.join("L")}Z`;
})();

// a wave twice the jar's width, slid left by one period on loop
const WAVE = (() => {
  let d = "M0 0";
  for (let x = 0; x < 320; x += 50) d += `Q${x + 12.5} -5 ${x + 25} 0T${x + 50} 0`;
  return `${d}V320H0Z`;
})();

// each star settles just under the level it was poured at, so the jar fills bottom-up
const STARS = Array.from({ length: MAX }, (_, i) => {
  const y = JAR_BOTTOM - ((i + 0.6) / MAX) * (JAR_BOTTOM - JAR_TOP) + (Math.random() - 0.5) * 8;
  const half = y < 108 ? 44 : 58;
  const x = 100 + (Math.random() * 2 - 1) * half;
  return {
    x,
    y,
    dx: 100 - x,
    size: 6 + Math.random() * 5,
    rotate: Math.random() * 72,
    delay: -Math.random() * 2.6,
    pink: Math.random() < 0.3,
  };
});

export default function WishJar() {
  const [count, setCount] = useState(0);
  const jarRef = useRef(null);
  const full = count >= MAX;
  const level = count === 0 ? JAR_BOTTOM + 10 : JAR_BOTTOM - (count / MAX) * (JAR_BOTTOM - JAR_TOP);

  const pour = () => {
    const next = Math.min(count + 1, MAX);
    setCount(next);
    if (next === MAX) {
      const box = jarRef.current.getBoundingClientRect();
      setTimeout(() => burst({ x: box.left + box.width / 2, y: box.top + box.height * 0.2, count: 90, spread: 120, power: 12 }), 700);
    }
  };

  return (
    <section id="jar" className="section">
      <div className="container jar-section">
        <SectionHeader eyebrow="Pour Your Love" title="Wish Jar">
          Click to pour wishes in ✦
        </SectionHeader>
        <Reveal className="jar-wrap">
          <div ref={jarRef} className={`jar${full ? " is-full" : ""}`}>
            <svg viewBox="0 0 200 300" role="img" aria-label={`${count} of ${MAX} wishes in the jar`}>
              <defs>
                <clipPath id="jar-inside">
                  <path d={INSIDE} />
                </clipPath>
                <linearGradient id="jar-liquid-front" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#e9d5ff" stopOpacity="0.95" />
                  <stop offset="0.3" stopColor="#a855f7" stopOpacity="0.88" />
                  <stop offset="1" stopColor="#4c1d95" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="jar-liquid-back" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f5d0fe" stopOpacity="0.8" />
                  <stop offset="1" stopColor="#a21caf" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="jar-glass" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#f5d0fe" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
                <radialGradient id="jar-star-gold">
                  <stop offset="0" stopColor="#fffbea" />
                  <stop offset="1" stopColor="#f6c65b" />
                </radialGradient>
                <radialGradient id="jar-star-pink">
                  <stop offset="0" stopColor="#ffffff" />
                  <stop offset="1" stopColor="#f0abfc" />
                </radialGradient>
                <radialGradient id="jar-star-halo">
                  <stop offset="0" stopColor="#fff2c4" stopOpacity="0.55" />
                  <stop offset="1" stopColor="#fff2c4" stopOpacity="0" />
                </radialGradient>
                <filter id="jar-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <path d={BODY} className="jar-back" />
              <g clipPath="url(#jar-inside)">
                <g className="jar-liquid" style={{ transform: `translateY(${level}px)` }}>
                  <path d={WAVE} className="wave wave-back" fill="url(#jar-liquid-back)" />
                  <path d={WAVE} className="wave wave-front" fill="url(#jar-liquid-front)" />
                </g>
              </g>
              {STARS.slice(0, count).map((s, i) => (
                <g key={i} className="jar-star" style={{ "--drop": `${-(s.y - 12)}px`, "--dx": `${s.dx}px` }}>
                  <g transform={`translate(${s.x} ${s.y})`}>
                    <g className="jar-star-bob" style={{ animationDelay: `${s.delay}s` }}>
                      <circle r={s.size * 1.7} fill="url(#jar-star-halo)" />
                      <path
                        d={STAR_PATH}
                        transform={`rotate(${s.rotate}) scale(${s.size})`}
                        fill={s.pink ? "url(#jar-star-pink)" : "url(#jar-star-gold)"}
                      />
                    </g>
                  </g>
                </g>
              ))}
              <path d="M44 116c-4 38-4 88 0 124" className="jar-shine" />
              <path d="M157 124c2 14 2 28 0 40" className="jar-shine jar-shine-thin" />
              <path d={BODY} className="jar-outline" stroke="url(#jar-glass)" filter="url(#jar-glow)" />
              <rect x="50" y="38" width="100" height="13" rx="6.5" className="jar-rim" />
            </svg>
          </div>
          <p className="jar-count">
            <strong>{count}</strong> / {MAX} wishes poured in
            {full && <span className="jar-full">✨ Overflowing with love!</span>}
          </p>
          <button type="button" className="btn btn-primary btn-lg" onClick={pour} disabled={full}>
            {full ? "🌟 Jar is Full!" : "⭐ Pour a Wish"}
          </button>
          {full && (
            <button type="button" className="text-btn" onClick={() => setCount(0)}>
              ↺ Empty the jar &amp; pour again
            </button>
          )}
        </Reveal>
      </div>
    </section>
  );
}
