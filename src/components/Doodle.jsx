// Hand-drawn marks. Paths use pathLength="1" so CSS can "draw" them in with one dash.
const PATHS = {
  heart: {
    viewBox: "0 0 60 56",
    d: ["M30 50C14 38 5 29 6 18 7 9 15 4 22 6c4 1 7 4 8 8 2-5 6-8 11-8 8 0 14 7 13 15-1 11-10 20-24 29"],
  },
  star: {
    viewBox: "0 0 60 60",
    d: ["M30 6l6 16 17 1-13 11 5 17-15-10-15 10 5-17L7 23l17-1z"],
  },
  sparkle: {
    viewBox: "0 0 40 40",
    d: ["M20 3v34M3 20h34M9 9l22 22M31 9L9 31"],
  },
  swirl: {
    viewBox: "0 0 80 40",
    d: ["M4 30c10-22 24-22 22-8-2 12-14 8-8-2 8-14 26-14 34-2 6 9 12 10 22 2"],
  },
  arrow: {
    viewBox: "0 0 90 70",
    d: ["M6 8c26 0 50 12 62 44", "M54 44l14 10 6-17"],
  },
  arrowUp: {
    viewBox: "0 0 70 90",
    d: ["M40 84C18 66 16 38 34 8", "M22 18L34 6l10 15"],
  },
  underline: {
    viewBox: "0 0 300 24",
    d: ["M4 16C60 6 130 4 200 8c30 2 60 5 94 2", "M22 20c60-6 140-8 240-4"],
  },
};

export default function Doodle({ type, className = "", style }) {
  const shape = PATHS[type];
  return (
    <svg className={`doodle doodle-${type} ${className}`} viewBox={shape.viewBox} style={style} aria-hidden="true">
      {shape.d.map((d, i) => (
        <path key={i} d={d} pathLength="1" style={{ "--i": i }} />
      ))}
    </svg>
  );
}
