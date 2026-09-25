import { AGE, FRIEND_NAME, PHOTO_SRC, SONG_TITLE, TAGLINE } from "../content";
import { ordinal, splitTrailingEmoji } from "../utils";
import Doodle from "./Doodle";

export default function Hero({ playing, onToggle }) {
  const [name] = splitTrailingEmoji(FRIEND_NAME);

  return (
    <section id="hero" className="hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="hero-kicker">heri ya kuzaliwa ✿</p>
          <h1 className="hero-title">
            <span className="hero-line">Happy {ordinal(AGE)},</span>
            <span className="hero-name">
              {name}.
              <Doodle type="underline" className="hero-underline" />
            </span>
          </h1>
          <p className="hero-tagline">{TAGLINE}</p>
          <div className="hero-actions">
            <a className="btn btn-paper is-inviting" href="#letter">
              I wrote you something <span aria-hidden="true">→</span>
            </a>
            <button type="button" className="btn btn-ghost" onClick={onToggle}>
              {playing ? "❚❚  pause" : `▶  ${SONG_TITLE}`}
            </button>
          </div>
          <p className="hero-note">
            <Doodle type="arrowUp" className="hero-note-arrow" />
            volume up for this one
          </p>
        </div>

        <div className="hero-visual">
          <figure className="polaroid hero-polaroid">
            <span className="tape tape-a" aria-hidden="true" />
            <span className="tape tape-b tape-pink" aria-hidden="true" />
            {PHOTO_SRC ? (
              <img src={PHOTO_SRC} alt={name} />
            ) : (
              <div className="polaroid-fallback" aria-hidden="true">
                🌸
              </div>
            )}
            <figcaption>the birthday girl ♡</figcaption>
          </figure>
          <span className="sticker hero-sticker" aria-hidden="true">
            <b>{AGE}</b>
            <small>today!</small>
          </span>
          <p className="hero-callout" aria-hidden="true">
            that&apos;s you!
            <Doodle type="arrow" className="hero-callout-arrow" />
          </p>
          <Doodle type="heart" className="hero-doodle hero-doodle-heart" />
          <Doodle type="star" className="hero-doodle hero-doodle-star" />
          <Doodle type="sparkle" className="hero-doodle hero-doodle-sparkle" />
        </div>
      </div>

      <a className="scroll-cue" href="#letter" aria-label="Scroll to the letter">
        scroll
        <span className="scroll-cue-line" />
      </a>
    </section>
  );
}
