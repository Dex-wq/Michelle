import { useEffect, useState } from "react";
import { STATS } from "../content";
import { useInView, useReducedMotion } from "../hooks";
import Reveal from "./Reveal";

const TILTS = [-2.5, 1.8, -1.2, 2.4];

// plain numbers tick up from zero the first time they're seen
function CountUp({ value }) {
  const [ref, inView] = useInView({ threshold: 0.6 });
  const reduced = useReducedMotion();
  const target = /^\d+$/.test(value) ? Number(value) : null;
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || target === null || reduced) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 1400);
      setN(Math.round(target * (1 - (1 - t) ** 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, reduced]);

  return (
    <span ref={ref} className="fact-num">
      {target === null || reduced ? value : n}
    </span>
  );
}

// little index cards, pinned up like a moodboard
export default function Stats() {
  return (
    <section className="section facts-section" aria-label="A few facts about you">
      <div className="container facts-grid">
        {STATS.map((s, i) => (
          <Reveal key={s.label} className="reveal-pin" delay={i * 140}>
            <div className="fact-card" style={{ "--tilt": `${TILTS[i % TILTS.length]}deg`, "--i": i }}>
              {i % 2 === 0 && <span className="tape tape-a fact-tape" aria-hidden="true" />}
              <span className="fact-icon" aria-hidden="true">
                {s.icon}
              </span>
              <CountUp value={s.num} />
              <span className="fact-label">{s.label}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
