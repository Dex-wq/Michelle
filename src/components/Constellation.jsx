import { useEffect, useRef, useState } from "react";
import { glowSprite } from "../utils";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const LINK_DISTANCE = 220;
const BACKGROUND_STARS = Array.from({ length: 90 }, () => ({
  x: Math.random(),
  y: Math.random(),
  r: 0.4 + Math.random() * 1.1,
  phase: Math.random() * Math.PI * 2,
  speed: 0.5 + Math.random() * 1.5,
}));

// rAF timestamps can trail the click's performance.now(), so progress is clamped to 0–1
const progress = (now, born, ms) => Math.min(1, Math.max(0, (now - born) / ms));
const easeOut = (t) => 1 - (1 - t) ** 3;
const easeOutBack = (t) => 1 + 2.7 * (t - 1) ** 3 + 1.7 * (t - 1) ** 2;

export default function Constellation() {
  const canvasRef = useRef(null);
  const starsRef = useRef([]); // positions are 0–1 so the drawing survives resizes
  const [count, setCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const sprite = glowSprite("#c084fc");
    let w = 0;
    let h = 0;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#ece6ff";
      for (const s of BACKGROUND_STARS) {
        ctx.globalAlpha = 0.18 + 0.4 * (0.5 + 0.5 * Math.sin((now / 1000) * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const pts = starsRef.current.map((s) => ({ x: s.x * w, y: s.y * h, born: s.born }));
      ctx.lineCap = "round";
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        if (Math.hypot(b.x - a.x, b.y - a.y) > LINK_DISTANCE) continue;
        const t = easeOut(progress(now, b.born, 550));
        const ex = a.x + (b.x - a.x) * t;
        const ey = a.y + (b.y - a.y) * t;
        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grad.addColorStop(0, "#a78bfa");
        grad.addColorStop(1, "#f0abfc");
        ctx.strokeStyle = grad;
        for (const [width, alpha] of [[6, 0.14], [1.4, 0.95]]) {
          ctx.lineWidth = width;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(ex, ey);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      pts.forEach((p, i) => {
        const pop = Math.max(0, easeOutBack(progress(now, p.born, 450)));
        const twinkle = 0.85 + 0.15 * Math.sin(now / 520 + i * 1.9);
        const glow = 38 * pop * twinkle;
        ctx.drawImage(sprite, p.x - glow / 2, p.y - glow / 2, glow, glow);
        const ray = 9 * pop * twinkle;
        ctx.strokeStyle = "rgba(255,255,255,.7)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x - ray, p.y);
        ctx.lineTo(p.x + ray, p.y);
        ctx.moveTo(p.x, p.y - ray);
        ctx.lineTo(p.x, p.y + ray);
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.2 * pop, 0, Math.PI * 2);
        ctx.fill();
      });

      if (pts.length) {
        ctx.fillStyle = "rgba(240,171,252,.8)";
        ctx.font = "500 11px Outfit, sans-serif";
        ctx.fillText("✦ start", pts[0].x + 12, pts[0].y - 12);
      }
    };

    const loop = (now) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    draw(performance.now());
    const resizeObs = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    resizeObs.observe(canvas);
    const viewObs = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    viewObs.observe(canvas);
    return () => {
      stop();
      resizeObs.disconnect();
      viewObs.disconnect();
    };
  }, []);

  const addStar = (e) => {
    const box = canvasRef.current.getBoundingClientRect();
    starsRef.current.push({
      x: (e.clientX - box.left) / box.width,
      y: (e.clientY - box.top) / box.height,
      born: performance.now(),
    });
    setCount(starsRef.current.length);
  };
  const undo = () => {
    starsRef.current.pop();
    setCount(starsRef.current.length);
  };
  const clear = () => {
    starsRef.current = [];
    setCount(0);
  };

  return (
    <section id="constellation" className="section">
      <div className="container">
        <SectionHeader eyebrow="Interactive" title="Draw Her Constellation">
          Click anywhere on the canvas to place stars &amp; draw a constellation just for her
        </SectionHeader>
        <Reveal>
          <div className="sky-card">
            <canvas ref={canvasRef} className="sky-canvas" onClick={addStar} aria-label="Constellation canvas" />
            {count === 0 && (
              <div className="sky-hint" aria-hidden="true">
                <span className="sky-hint-ring" />
                Tap anywhere to place the first star
              </div>
            )}
          </div>
          <div className="sky-toolbar">
            {count > 0 && (
              <>
                <span className="chip">
                  ✦ {count} star{count > 1 ? "s" : ""} placed
                </span>
                <button type="button" className="btn btn-ghost btn-sm" onClick={undo}>
                  ↶ Undo
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={clear}>
                  Clear &amp; Start Over
                </button>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
