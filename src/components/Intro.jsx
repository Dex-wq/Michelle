import { useEffect, useRef, useState } from "react";
import { AGE, FRIEND_NAME } from "../content";
import { burst } from "../confetti";
import { ordinal, splitTrailingEmoji } from "../utils";
import Doodle from "./Doodle";

// little hearts and sparkles drifting up behind the envelope
const FLOATERS = [
  { x: "6%", size: 22, dur: 13, delay: -2, char: "♡", color: "var(--pink)" },
  { x: "15%", size: 14, dur: 10, delay: -7, char: "✦", color: "var(--butter)" },
  { x: "24%", size: 28, dur: 15, delay: -11, char: "♡", color: "var(--lilac)" },
  { x: "36%", size: 12, dur: 11, delay: -4, char: "✦", color: "var(--pink-soft)" },
  { x: "47%", size: 18, dur: 14, delay: -9, char: "♡", color: "var(--pink)" },
  { x: "58%", size: 13, dur: 9, delay: -1, char: "✦", color: "var(--lilac)" },
  { x: "67%", size: 24, dur: 16, delay: -6, char: "♡", color: "var(--pink-soft)" },
  { x: "77%", size: 15, dur: 12, delay: -13, char: "✦", color: "var(--butter)" },
  { x: "86%", size: 20, dur: 13, delay: -3, char: "♡", color: "var(--lilac)" },
  { x: "94%", size: 12, dur: 10, delay: -8, char: "✦", color: "var(--pink)" },
];

// Sealed envelope that greets her first. Opening it starts the song (a tap is what lets
// browsers play audio) and then reveals the page.
export default function Intro({ onOpen, onReveal }) {
  const [stage, setStage] = useState("closed"); // closed → opening → leaving → gone
  const envelopeRef = useRef(null);
  const timers = useRef([]);
  const [name] = splitTrailingEmoji(FRIEND_NAME);
  const hidden = stage === "gone";

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  // keep the page still underneath until the envelope is gone
  useEffect(() => {
    if (hidden) return;
    const root = document.documentElement;
    root.classList.add("is-locked");
    return () => root.classList.remove("is-locked");
  }, [hidden]);

  const open = () => {
    if (stage !== "closed") return;
    setStage("opening");
    onOpen();
    const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
    later(() => {
      const box = envelopeRef.current.getBoundingClientRect();
      burst({ x: box.left + box.width / 2, y: box.top + box.height * 0.3, count: 70, spread: 150, power: 12, shapes: ["heart", "heart", "circle"] });
    }, 950);
    later(() => {
      setStage("leaving");
      onReveal();
    }, 2100);
    later(() => setStage("gone"), 3000);
  };

  if (hidden) return null;
  return (
    <div className={`intro is-${stage}`} role="dialog" aria-modal="true" aria-label={`A birthday surprise for ${name}`}>
      <div className="intro-glow" aria-hidden="true" />
      <div className="intro-floaters" aria-hidden="true">
        {FLOATERS.map((f, i) => (
          <span
            key={i}
            style={{ left: f.x, color: f.color, "--size": `${f.size}px`, "--dur": `${f.dur}s`, animationDelay: `${f.delay}s` }}
          >
            {f.char}
          </span>
        ))}
      </div>
      <div className="intro-inner">
        <p className="intro-kicker">psst… {name.toLowerCase()}</p>
        <p className="intro-line">this one&apos;s for you</p>
        <p className="intro-loved">
          you are loved
          <Doodle type="heart" className="intro-loved-heart" />
        </p>
        <button ref={envelopeRef} type="button" className="envelope" onClick={open} aria-label="Open your birthday surprise">
          <span className="envelope-back" aria-hidden="true" />
          <span className="envelope-card" aria-hidden="true">
            <span className="envelope-card-kicker">happy</span>
            <span className="envelope-card-age">{ordinal(AGE)}</span>
            <span className="envelope-card-name">{name} ♡</span>
          </span>
          <span className="envelope-front" aria-hidden="true">
            <span className="envelope-to">for {name}</span>
          </span>
          <span className="envelope-flap" aria-hidden="true" />
          <span className="envelope-seal" aria-hidden="true">
            {name.charAt(0).toUpperCase()}
          </span>
        </button>
        <p className="intro-hint">tap to open</p>
      </div>
    </div>
  );
}
