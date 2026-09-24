import { useRef } from "react";
import { AGE, FRIEND_NAME, PHOTO_SRC, SONG_TITLE, TAGLINE } from "../content";
import { splitTrailingEmoji } from "../utils";
import ParticleGalaxy from "./ParticleGalaxy";

const SPARKLES = [
  { top: "6%", left: "-16%", size: 18, color: "#f6d58e", delay: "0s" },
  { top: "26%", right: "-18%", size: 13, color: "#f0abfc", delay: "-1.2s" },
  { top: "64%", right: "-14%", size: 20, color: "#f6d58e", delay: "-2.1s" },
  { bottom: "-9%", left: "30%", size: 12, color: "#c4b5fd", delay: "-0.6s" },
  { top: "44%", left: "-20%", size: 11, color: "#f0abfc", delay: "-1.7s" },
];

const PETALS = [
  { top: "20%", left: "-9%", delay: "0s" },
  { top: "84%", right: "-8%", delay: "-1.6s" },
  { top: "2%", right: "4%", delay: "-3s" },
];

export default function Hero({ playing, onToggle }) {
  const portraitRef = useRef(null);
  const [name, emoji] = splitTrailingEmoji(FRIEND_NAME);

  return (
    <section id="hero" className="hero">
      <ParticleGalaxy anchorRef={portraitRef} />

      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">Happy Birthday ❤️</p>
          <h1 className="hero-name">
            <span className="hero-name-glow">
              <span className="text-shimmer">{name}</span>
            </span>
            {emoji && (
              <span className="hero-name-emoji" aria-hidden="true">
                {emoji}
              </span>
            )}
          </h1>
          <p className="hero-tagline">{TAGLINE}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#letter">
              Read your letter <span aria-hidden="true">💌</span>
            </a>
            <button type="button" className="btn btn-ghost" onClick={onToggle}>
              {playing ? "⏸  Pause the song" : `▶  ${SONG_TITLE}`}
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="portrait" ref={portraitRef}>
            <div className="portrait-glow" aria-hidden="true" />
            <div className="portrait-ring" aria-hidden="true" />
            <div className="orbit orbit-1" aria-hidden="true" />
            <div className="orbit orbit-2" aria-hidden="true" />
            <div className="orbit orbit-3" aria-hidden="true" />
            <div className="portrait-frame">
              {PHOTO_SRC ? (
                <img className="portrait-photo" src={PHOTO_SRC} alt={name} />
              ) : (
                <div className="portrait-photo portrait-fallback" aria-hidden="true">
                  🌸
                </div>
              )}
            </div>
            <span className="portrait-crown" aria-hidden="true">
              👑
            </span>
            <div className="seal" aria-hidden="true">
              <svg className="seal-ring" viewBox="0 0 100 100">
                <defs>
                  <path id="seal-path" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" />
                </defs>
                <text>
                  <textPath href="#seal-path" textLength="236" lengthAdjust="spacing">
                    HAPPY BIRTHDAY ✦ HAPPY BIRTHDAY ✦
                  </textPath>
                </text>
              </svg>
              <span className="seal-age">{AGE}</span>
            </div>
            {SPARKLES.map(({ size, color, delay, ...pos }, i) => (
              <span
                key={i}
                className="sparkle"
                aria-hidden="true"
                style={{ ...pos, fontSize: size, color, animationDelay: delay }}
              >
                ✦
              </span>
            ))}
            {PETALS.map(({ delay, ...pos }, i) => (
              <span key={i} className="petal" aria-hidden="true" style={{ ...pos, animationDelay: delay }}>
                🌸
              </span>
            ))}
          </div>
        </div>
      </div>

      <a className="scroll-cue" href="#letter" aria-label="Scroll to the letter">
        <span className="scroll-cue-line" />
        scroll
      </a>
    </section>
  );
}
