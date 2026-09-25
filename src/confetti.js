// Tiny canvas confetti: one fixed canvas, animated only while pieces are alive
const COLORS = ["#c084fc", "#a855f7", "#d946ef", "#f0abfc", "#f6d58e", "#ffffff", "#818cf8", "#f9a8d4"];

let canvas = null;
let ctx = null;
let pieces = [];
let raf = 0;
let width = 0;
let height = 0;

function setup() {
  if (canvas) return;
  canvas = document.createElement("canvas");
  canvas.className = "confetti-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);
}

function heart(size) {
  const s = size / 2;
  ctx.beginPath();
  ctx.moveTo(0, s);
  ctx.bezierCurveTo(-s * 1.3, 0, -s * 0.6, -s * 1.2, 0, -s * 0.4);
  ctx.bezierCurveTo(s * 0.6, -s * 1.2, s * 1.3, 0, 0, s);
  ctx.fill();
}

function tick() {
  ctx.clearRect(0, 0, width, height);
  pieces = pieces.filter((p) => p.life > 0 && p.y < height + 60);
  for (const p of pieces) {
    p.vy += 0.3;
    p.vx *= 0.97;
    p.vy *= 0.97;
    p.x += p.vx + Math.sin(p.flip) * 0.7;
    p.y += p.vy;
    p.rot += p.spin;
    p.flip += p.flipSpeed;
    p.life -= p.decay;

    ctx.save();
    ctx.globalAlpha = Math.min(1, p.life * 1.6);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.scale(1, Math.cos(p.flip));
    ctx.fillStyle = p.color;
    if (p.shape === "heart") heart(p.size * 1.4);
    else if (p.shape === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.42, 0, Math.PI * 2);
      ctx.fill();
    } else ctx.fillRect(-p.size / 2, -p.size * 0.3, p.size, p.size * 0.6);
    ctx.restore();
  }
  raf = pieces.length ? requestAnimationFrame(tick) : 0;
}

export function burst({ x, y, count = 120, angle = -90, spread = 70, power = 14, scale = 1, shapes } = {}) {
  setup();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const n = reduce ? Math.round(count / 4) : count;
  for (let i = 0; i < n; i++) {
    const a = ((angle + (Math.random() - 0.5) * spread) * Math.PI) / 180;
    const v = power * (0.45 + Math.random() * 0.75);
    const roll = Math.random();
    const shape = shapes
      ? shapes[Math.floor(Math.random() * shapes.length)]
      : roll < 0.18 ? "heart" : roll < 0.5 ? "circle" : "rect";
    pieces.push({
      x,
      y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v,
      size: (7 + Math.random() * 7) * scale,
      rot: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.3,
      flip: Math.random() * Math.PI * 2,
      flipSpeed: 0.08 + Math.random() * 0.12,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape,
      life: 1,
      decay: 0.004 + Math.random() * 0.004,
    });
  }
  if (!raf) raf = requestAnimationFrame(tick);
}
