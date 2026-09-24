import { useCallback, useEffect, useRef, useState } from "react";
import { WISHES } from "../content";
import { useInView } from "../hooks";
import SectionHeader from "./SectionHeader";

const DISTANT = [
  { left: "13%", top: "16%", scale: 0.32, delay: "0s" },
  { left: "80%", top: "9%", scale: 0.26, delay: "-2s" },
  { left: "64%", top: "32%", scale: 0.38, delay: "-4s" },
  { left: "31%", top: "38%", scale: 0.22, delay: "-1s" },
  { left: "90%", top: "44%", scale: 0.2, delay: "-3s" },
];

export default function Lanterns() {
  const [lanterns, setLanterns] = useState([]);
  const [released, setReleased] = useState(0);
  const counter = useRef(0);
  const lastX = useRef(50);
  const timers = useRef([]);
  const [stageRef, stageInView] = useInView({ threshold: 0.45 });

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const launch = useCallback(() => {
    const id = ++counter.current;
    // alternate sides of the sky so consecutive wishes don't stack on each other
    const x = lastX.current < 50 ? 56 + Math.random() * 24 : 20 + Math.random() * 24;
    lastX.current = x;
    const lantern = {
      id,
      wish: WISHES[(id - 1) % WISHES.length],
      x,
      duration: 9 + Math.random() * 2.5,
      sway: 6 + Math.random() * 12,
      scale: 0.9 + Math.random() * 0.25,
    };
    setLanterns((l) => [...l, lantern]);
    setReleased(id);
    timers.current.push(
      setTimeout(() => setLanterns((l) => l.filter((ln) => ln.id !== id)), lantern.duration * 1000 + 200),
    );
  }, []);

  // send the first lantern up on its own so the sky shows what the button does
  useEffect(() => {
    if (!stageInView) return;
    const t = setTimeout(launch, 700);
    return () => clearTimeout(t);
  }, [stageInView, launch]);

  return (
    <section id="wishes" className="section lantern-section">
      <div className="container">
        <SectionHeader eyebrow="Make a Wish" heart>
          Each lantern carries a wish into the universe ✦
        </SectionHeader>
      </div>
      <div className="lantern-stage" ref={stageRef}>
        {DISTANT.map((d, i) => (
          <div
            key={i}
            className="lantern-distant"
            aria-hidden="true"
            style={{ left: d.left, top: d.top, "--scale": d.scale, animationDelay: d.delay }}
          >
            <div className="lantern-body" />
          </div>
        ))}
        {lanterns.map((ln) => (
          <div
            key={ln.id}
            className="lantern"
            aria-hidden="true"
            style={{ left: `${ln.x}%`, "--duration": `${ln.duration}s`, "--sway": `${ln.sway}px`, "--scale": ln.scale }}
          >
            <div className="lantern-sway">
              <div className="lantern-body" />
              <p className="lantern-wish">{ln.wish}</p>
            </div>
          </div>
        ))}
        <svg className="hills" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0 150C160 96 300 112 440 128c160 18 280-44 460-36 180 8 300-20 420-4 60 8 100 16 120 20v112H0Z"
            fill="#140b2b"
          />
          <path
            d="M0 186c180-36 340-16 520-20 180-4 300 28 480 16 160-10 300-22 440-12v50H0Z"
            fill="#09051a"
          />
        </svg>
        <div className="lantern-launch">
          <button type="button" className="btn btn-primary btn-lg" onClick={launch}>
            🏮 Release a Lantern
          </button>
          <p className="lantern-count">
            {released ? `${released} wish${released === 1 ? "" : "es"} sent to the sky` : "Tap to send a wish up"}
          </p>
          <p className="sr-only" aria-live="polite">
            {lanterns.at(-1)?.wish}
          </p>
        </div>
      </div>
    </section>
  );
}
