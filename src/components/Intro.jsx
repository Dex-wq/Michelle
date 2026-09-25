import { useEffect, useRef, useState } from "react";
import { AGE, FRIEND_NAME } from "../content";
import { burst } from "../confetti";
import { ordinal, splitTrailingEmoji } from "../utils";

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
      <div className="intro-inner">
        <p className="intro-kicker">psst… {name.toLowerCase()}</p>
        <p className="intro-line">this one&apos;s for you</p>
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
