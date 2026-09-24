import { useEffect, useRef } from "react";
import { useMediaQuery, useReducedMotion } from "../hooks";

const INTERACTIVE = "button, a, canvas, [role='button']";

// Star cursor with a glitter trail — mouse/trackpad only, touch keeps the normal behaviour
export default function SparkleCursor() {
  const enabled = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = useReducedMotion();
  const starRef = useRef(null);
  const trailRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    const star = starRef.current;
    const canvas = trailRef.current;
    const ctx = canvas.getContext("2d");
    const sparks = [];
    let raf = 0;
    root.classList.add("has-sparkle-cursor");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= 0.028;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.03;
        ctx.globalAlpha = s.life * 0.35;
        ctx.fillStyle = `hsl(${s.hue} 95% 75%)`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 2.6 * s.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = s.life;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * s.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = sparks.length ? requestAnimationFrame(draw) : 0;
    };

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      star.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      star.classList.add("is-visible");
      star.classList.toggle("is-hovering", Boolean(e.target.closest?.(INTERACTIVE)));
      if (reduced || Math.random() > 0.55) return;
      sparks.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        r: 1 + Math.random() * 1.8,
        life: 1,
        hue: 265 + Math.random() * 65,
      });
      if (sparks.length > 70) sparks.shift();
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const onLeave = () => star.classList.remove("is-visible");
    const onDown = () => star.classList.add("is-pressed");
    const onUp = () => star.classList.remove("is-pressed");

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    root.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-sparkle-cursor");
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, reduced]);

  if (!enabled) return null;
  return (
    <>
      <canvas ref={trailRef} className="cursor-trail" aria-hidden="true" />
      <div ref={starRef} className="cursor-star" aria-hidden="true">
        <svg viewBox="0 0 28 28">
          <path
            d="M14 1.5 16.4 10 25 12.2 17.3 15.6 18.6 25 14 19 9.4 25 10.7 15.6 3 12.2 11.6 10Z"
            fill="#e9d5ff"
            stroke="#a855f7"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
}
