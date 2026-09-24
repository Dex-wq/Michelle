import { useEffect, useRef } from "react";
import { glowSprite } from "../utils";

const COLORS = ["#8b5cf6", "#a855f7", "#c084fc", "#7c3aed", "#d946ef", "#e8e0ff", "#ddd6fe", "#f0abfc"];

// Slowly turning spiral galaxy centred on `anchorRef`; particles lean towards the pointer
export default function ParticleGalaxy({ anchorRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sprites = COLORS.map((c) => glowSprite(c));
    const count = window.innerWidth < 700 ? 150 : 230;
    const pts = Array.from({ length: count }, (_, i) => ({
      t: i / count,
      size: 0.8 + Math.random() * 2.6,
      sprite: sprites[i % sprites.length],
      phase: Math.random() * Math.PI * 2,
      speed: 0.01 + Math.random() * 0.02,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      placed: false,
    }));
    const pointer = { x: -9999, y: -9999 };
    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;
    let maxR = 0;
    let turn = 0;
    let raf = 0;

    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const box = canvas.getBoundingClientRect();
      const anchor = anchorRef.current?.getBoundingClientRect();
      cx = anchor ? anchor.left + anchor.width / 2 - box.left : w / 2;
      cy = anchor ? anchor.top + anchor.height / 2 - box.top : h / 2;
      maxR = Math.min(w, h) * 0.46;
    };

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      if (!reduced) turn += 0.0009;
      for (const p of pts) {
        const angle = p.t * Math.PI * 10 + turn;
        const r = 70 + p.t * maxR;
        const bx = cx + Math.cos(angle) * r;
        const by = cy + Math.sin(angle) * r * 0.92;
        if (!p.placed) {
          p.x = bx;
          p.y = by;
          p.placed = true;
        }
        p.phase += p.speed;
        const dx = pointer.x - p.x;
        const dy = pointer.y - p.y;
        const pull = Math.max(0, (180 - Math.hypot(dx, dy)) / 180);
        p.vx = (p.vx + pull * dx * 0.04 + (bx - p.x) * 0.04) * 0.86;
        p.vy = (p.vy + pull * dy * 0.04 + (by - p.y) * 0.04) * 0.86;
        p.x += p.vx;
        p.y += p.vy;
        const s = p.size * 7;
        ctx.globalAlpha = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(p.phase));
        ctx.drawImage(p.sprite, p.x - s / 2, p.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = () => {
      frame();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf && !reduced) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const relayout = () => {
      layout();
      if (!raf) frame();
    };

    const onMove = (e) => {
      const box = canvas.getBoundingClientRect();
      pointer.x = e.clientX - box.left;
      pointer.y = e.clientY - box.top;
    };
    const onRelease = (e) => {
      if (e.pointerType !== "mouse") pointer.x = pointer.y = -9999;
    };
    const onLeave = () => {
      pointer.x = pointer.y = -9999;
    };

    relayout();
    const resizeObs = new ResizeObserver(relayout);
    resizeObs.observe(canvas);
    const viewObs = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    viewObs.observe(canvas);
    // the portrait settles after its entrance animation and web fonts can shift it — re-centre then
    const settle = setTimeout(relayout, 1700);
    document.fonts?.ready.then(relayout);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onRelease);
    window.addEventListener("pointercancel", onRelease);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      stop();
      clearTimeout(settle);
      resizeObs.disconnect();
      viewObs.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onRelease);
      window.removeEventListener("pointercancel", onRelease);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [anchorRef]);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
