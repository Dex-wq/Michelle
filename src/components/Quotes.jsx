import { useState } from "react";
import { QUOTES } from "../content";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const Chevron = ({ flip }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style={flip ? { transform: "scaleX(-1)" } : undefined}>
    <path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Quotes() {
  const [idx, setIdx] = useState(0);
  const go = (n) => setIdx((n + QUOTES.length) % QUOTES.length);

  return (
    <section id="quotes" className="section">
      <h2 className="sr-only">Words for you</h2>
      <div className="container">
        <SectionHeader heart />
        <Reveal>
          <div className="quote-card">
            <span className="quote-mark" aria-hidden="true">
              “
            </span>
            <div className="quote-stack" aria-live="polite">
              {QUOTES.map((q, i) => (
                <figure key={i} className={`quote${i === idx ? " is-active" : ""}`} aria-hidden={i !== idx}>
                  <blockquote>{q.text}</blockquote>
                  <figcaption>{q.author}</figcaption>
                </figure>
              ))}
            </div>
            <div className="quote-controls">
              <button type="button" className="icon-btn" onClick={() => go(idx - 1)} aria-label="Previous quote">
                <Chevron />
              </button>
              <div className="quote-dots">
                {QUOTES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`quote-dot${i === idx ? " is-active" : ""}`}
                    onClick={() => go(i)}
                    aria-label={`Show quote ${i + 1}`}
                    aria-current={i === idx}
                  >
                    <span className="quote-dot-track">
                      {/* the fill's animation doubles as the autoplay timer — hovering pauses both */}
                      {i === idx && <span className="quote-dot-fill" onAnimationEnd={() => go(idx + 1)} />}
                    </span>
                  </button>
                ))}
              </div>
              <button type="button" className="icon-btn" onClick={() => go(idx + 1)} aria-label="Next quote">
                <Chevron flip />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
