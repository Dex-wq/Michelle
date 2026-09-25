// Canvas fireworks over the page — some bursts are heart-shaped. Runs only while sparks are alive.
const COLORS = ["#c084fc", "#f0abfc", "#f6d58e", "#ffffff", "#a78bfa", "#f9a8d4", "#e879f9"];
const GRAVITY = 0.045;

let canvas = null;
let ctx = null;
let rockets = [];
let sparks = [];
let raf = 0;
let width = 0;
let height = 0;

const pick = (list) => list[Math.floor(Math.random() * list.length)];

function setup() {
  if (canvas) return;
  canvas = document.createElement("canvas");
  canvas.className = "fireworks-canvas";
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

function explode(rocket) {
  const heart = Math.random() < 0.35;
  const count = heart ? 90 : 70 + Math.floor(Math.random() * 40);
  const main = pick(COLORS);
  const accent = pick(COLORS);
  const size = 0.8 + Math.random() * 0.5;
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    let vx;
    let vy;
    if (heart) {
      const hx = 16 * Math.sin(t) ** 3;
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      vx = hx * 0.26 * size;
      vy = hy * 0.26 * size;
    } else {
      const speed = (2 + Math.random() * 3.4) * size;
      vx = Math.cos(t) * speed;
      vy = Math.sin(t) * speed;
    }
    sparks.push({
      x: rocket.x,
      y: rocket.y,
      px: rocket.x,
      py: rocket.y,
      vx,
      vy,
      drag: heart ? 0.975 : 0.985,
      gravity: heart ? GRAVITY * 0.4 : GRAVITY,
      life: 1,
      decay: 0.011 + Math.random() * 0.009,
      color: i % 3 ? main : accent,
      width: 1.4 + Math.random() * 1.2,
    });
  }
}

function tick() {
  // fade the previous frame instead of clearing it, which leaves soft trails
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "rgba(0,0,0,0.24)";
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = "lighter";
  ctx.lineCap = "round";

  rockets = rockets.filter((r) => {
    r.px = r.x;
    r.py = r.y;
    r.vy += 0.12;
    r.x += r.vx;
    r.y += r.vy;
    ctx.strokeStyle = "rgba(255, 236, 200, 0.9)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(r.px, r.py);
    ctx.lineTo(r.x, r.y);
    ctx.stroke();
    if (r.vy >= -0.5 || r.y <= r.targetY) {
      explode(r);
      return false;
    }
    return true;
  });

  sparks = sparks.filter((s) => s.life > 0);
  for (const s of sparks) {
    s.px = s.x;
    s.py = s.y;
    s.vx *= s.drag;
    s.vy = s.vy * s.drag + s.gravity;
    s.x += s.vx;
    s.y += s.vy;
    s.life -= s.decay;
    ctx.globalAlpha = Math.max(0, s.life);
    ctx.strokeStyle = s.color;
    ctx.lineWidth = s.width;
    ctx.beginPath();
    ctx.moveTo(s.px, s.py);
    ctx.lineTo(s.x, s.y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  if (rockets.length || sparks.length) {
    raf = requestAnimationFrame(tick);
  } else {
    raf = 0;
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, width, height);
  }
}

function launch() {
  const targetY = height * (0.12 + Math.random() * 0.3);
  rockets.push({
    x: width * (0.12 + Math.random() * 0.76),
    y: height + 10,
    px: 0,
    py: 0,
    vx: (Math.random() - 0.5) * 1.4,
    vy: -Math.sqrt(2 * 0.12 * (height + 10 - targetY)),
    targetY,
  });
  if (!raf) raf = requestAnimationFrame(tick);
}

export function fireworks({ count = 12, duration = 5000 } = {}) {
  setup();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const n = reduce ? 3 : count;
  for (let i = 0; i < n; i++) setTimeout(launch, (i / n) * duration + Math.random() * 350);
}
