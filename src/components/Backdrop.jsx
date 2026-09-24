// One fixed sky behind the whole page, so sections flow into each other without seams
const STAR_COLORS = ["#ffffff", "#ffffff", "#ece6ff", "#d8b4fe", "#f5d0fe", "#c4b5fd"];

const STARS = Array.from({ length: 150 }, () => {
  const roll = Math.random();
  return {
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: roll < 0.72 ? 1 + Math.random() * 0.8 : roll < 0.95 ? 1.8 + Math.random() * 0.8 : 2.8 + Math.random(),
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    duration: 2.5 + Math.random() * 4.5,
    delay: -Math.random() * 7,
  };
});

const SHOOTING_STARS = [
  { top: "12%", left: "82%", delay: "3s" },
  { top: "30%", left: "40%", delay: "9s" },
  { top: "6%", left: "56%", delay: "15s" },
];

export default function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="nebula nebula-1" />
      <div className="nebula nebula-2" />
      <div className="nebula nebula-3" />
      {STARS.map((s, i) => (
        <span
          key={i}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: s.color,
            "--glow": s.color,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
      {SHOOTING_STARS.map((s, i) => (
        <span key={i} className="shooting-star" style={{ top: s.top, left: s.left, animationDelay: s.delay }} />
      ))}
    </div>
  );
}
