import { useEffect, useRef, useState } from "react";
import { BIRTH_YEAR, FRIEND_NAME } from "../content";
import { glowSprite, splitTrailingEmoji } from "../utils";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const LINK_DISTANCE = 220;
const SEGMENT_MS = 230;
const BACKGROUND_STARS = Array.from({ length: 90 }, () => ({
  x: Math.random(),
  y: Math.random(),
  r: 0.4 + Math.random() * 1.1,
  phase: Math.random() * Math.PI * 2,
  speed: 0.5 + Math.random() * 1.5,
}));

// twelve stars on a heart curve — her constellation, drawn one line at a time
const HEART = Array.from({ length: 12 }, (_, i) => {
  const t = (i / 12) * Math.PI * 2;
  return {
    x: Math.sin(t) ** 3,
    y: (-(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) - 2.75) / 14.25,
  };
});

// rAF timestamps can trail the click's performance.now(), so progress is clamped to 0–1
const progress = (now, born, ms) => Math.min(1, Math.max(0, (now - born) / ms));
const easeOut = (t) => 1 - (1 - t) ** 3;
const easeOutBack = (t) => 1 + 2.7 * (t - 1) ** 3 + 1.7 * (t - 1) ** 2;

export default function Constellation() {
  const canvasRef = useRef(null);
  const starsRef = useRef([]); // her own stars, stored 0–1 so they survive resizes
  const [count, setCount] = useState(0);
  const [heartDrawn, setHeartDrawn] = useState(false);
  const [name] = splitTrailingEmoji(FRIEND_NAME);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pink = glowSprite("#f0abfc");
    const gold = glowSprite("#f6d58e");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const label = name.toUpperCase();
    let w = 0;
    let h = 0;
    let raf = 0;
    let heartStart = null;
    let doneTimer = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const line = (a, b, t, from, to) => {
      const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      grad.addColorStop(0, from);
      grad.addColorStop(1, to);
      ctx.strokeStyle = grad;
      const ex = a.x + (b.x - a.x) * t;
      const ey = a.y + (b.y - a.y) * t;
      for (const [width, alpha] of [[6, 0.14], [1.4, 0.95]]) {
        ctx.lineWidth = width;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(ex, ey);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const star = (p, pop, twinkle, sprite, size) => {
      const glow = size * pop * twinkle;
      ctx.drawImage(sprite, p.x - glow / 2, p.y - glow / 2, glow, glow);
      const ray = size * 0.24 * pop * twinkle;
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
    };

    const draw = (now) => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";

      ctx.fillStyle = "#ece6ff";
      for (const s of BACKGROUND_STARS) {
        ctx.globalAlpha = 0.18 + 0.4 * (0.5 + 0.5 * Math.sin((now / 1000) * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // star-chart rings
      const cx = w / 2;
      const cy = h * 0.47;
      const R = Math.min(w * 0.28, h * 0.34);
      ctx.setLineDash([2, 7]);
      ctx.strokeStyle = "rgba(196,181,253,.12)";
      ctx.lineWidth = 1;
      for (const k of [1.55, 2.3]) {
        ctx.beginPath();
        ctx.arc(cx, cy, R * k, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // her constellation
      if (heartStart !== null) {
        const heart = HEART.map((p) => ({ x: cx + p.x * R, y: cy + p.y * R * 0.92 }));
        heart.forEach((a, i) => {
          const t = easeOut(progress(now, heartStart + i * SEGMENT_MS, SEGMENT_MS));
          if (t > 0) line(a, heart[(i + 1) % heart.length], t, "#a78bfa", "#f0abfc");
        });
        heart.forEach((p, i) => {
          const pop = Math.max(0, easeOutBack(progress(now, heartStart + i * SEGMENT_MS, 420)));
          if (pop > 0) star(p, pop, 0.85 + 0.15 * Math.sin(now / 520 + i * 1.9), pink, 34);
        });
        const shown = progress(now, heartStart + HEART.length * SEGMENT_MS, 700);
        if (shown > 0) {
          ctx.globalAlpha = shown;
          ctx.fillStyle = "#f5d0fe";
          ctx.font = "700 12px 'DM Sans', sans-serif";
          if ("letterSpacing" in ctx) ctx.letterSpacing = "3px";
          const title = `✦ ${label}`;
          let lx = cx + R * 0.78;
          const lw = ctx.measureText(title).width;
          if (lx + lw > w - 14) lx = w - 14 - lw;
          const ly = cy - R * 1.02;
          ctx.fillText(title, lx, ly);
          if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
          ctx.fillStyle = "rgba(246,213,142,.85)";
          ctx.font = "600 19px Caveat, cursive";
          ctx.fillText(`est. ${BIRTH_YEAR}`, lx + 14, ly + 20);
          ctx.globalAlpha = 1;
        }
      }

      // the stars she adds
      const pts = starsRef.current.map((s) => ({ x: s.x * w, y: s.y * h, born: s.born }));
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        if (Math.hypot(b.x - a.x, b.y - a.y) > LINK_DISTANCE) continue;
        line(a, b, easeOut(progress(now, b.born, 550)), "#f6d58e", "#fff4d6");
      }
      pts.forEach((p, i) => {
        const pop = Math.max(0, easeOutBack(progress(now, p.born, 450)));
        star(p, pop, 0.85 + 0.15 * Math.sin(now / 480 + i * 2.3), gold, 30);
      });
      if (pts.length) {
        ctx.fillStyle = "rgba(246,213,142,.85)";
        ctx.font = "600 18px Caveat, cursive";
        ctx.fillText("yours ♡", pts[0].x + 12, pts[0].y - 12);
      }
    };

    const loop = (now) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (heartStart === null) {
        heartStart = reduced ? -1e9 : performance.now() + 350;
        doneTimer = setTimeout(() => setHeartDrawn(true), reduced ? 0 : 350 + HEART.length * SEGMENT_MS + 700);
      }
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
    const viewObs = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold: 0.35 });
    viewObs.observe(canvas);
    return () => {
      stop();
      clearTimeout(doneTimer);
      resizeObs.disconnect();
      viewObs.disconnect();
    };
  }, [name]);

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
        <SectionHeader kicker="I drew you a constellation" title={`The ${name} Constellation`} align="left">
          It&apos;s yours now. Tap anywhere in the sky to add stars of your own.
        </SectionHeader>
        <Reveal>
          <div className="sky-card">
            <span className="tape tape-a sky-tape-l" aria-hidden="true" />
            <span className="tape tape-b sky-tape-r" aria-hidden="true" />
            <canvas ref={canvasRef} className="sky-canvas" onClick={addStar} aria-label={`The ${name} constellation — tap to add your own stars`} />
            {heartDrawn && count === 0 && (
              <div className="sky-hint" aria-hidden="true">
                <span className="sky-hint-ring" />
                Tap anywhere to add your own stars
              </div>
            )}
          </div>
          <div className="sky-toolbar">
            {count > 0 && (
              <>
                <span className="chip">
                  ✦ {count} star{count > 1 ? "s" : ""} of your own
                </span>
                <button type="button" className="btn btn-ghost btn-sm" onClick={undo}>
                  ↶ Undo
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={clear}>
                  Clear mine
                </button>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
