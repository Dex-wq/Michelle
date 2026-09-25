import { useEffect, useState } from "react";
import { LETTER, LETTER_DATE } from "../content";
import { useInView, useReducedMotion } from "../hooks";
import Reveal from "./Reveal";
import Doodle from "./Doodle";
import SectionHeader from "./SectionHeader";

const PARAGRAPHS = LETTER.split(/\n+/)
  .map((p) => p.replace(/\s+/g, " ").trim())
  .filter(Boolean);
const STARTS = PARAGRAPHS.map((_, i) => PARAGRAPHS.slice(0, i).join("").length);
const TEXT = PARAGRAPHS.join("");
const TOTAL = TEXT.length;
const PARAGRAPH_BREAKS = new Set(STARTS.slice(1));

// pause a little longer on punctuation and between paragraphs, like someone writing
function delayBefore(typed) {
  if (PARAGRAPH_BREAKS.has(typed)) return 360;
  const prev = TEXT[typed - 1] ?? "";
  if (prev === ",") return 80;
  if (".!?…".includes(prev) && prev) return 140;
  return 17;
}

export default function Letter() {
  const reduced = useReducedMotion();
  const [letterRef, inView] = useInView({ threshold: 0.2 });
  const [typed, setTyped] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const count = reduced || skipped ? TOTAL : typed;
  const done = count >= TOTAL;
  const caretAt = done ? -1 : PARAGRAPHS.findLastIndex((_, i) => STARTS[i] <= count);

  useEffect(() => {
    if (!inView || done) return;
    const t = setTimeout(() => setTyped((n) => n + 1), delayBefore(count));
    return () => clearTimeout(t);
  }, [inView, done, count]);

  return (
    <section id="letter" className="section letter-section">
      <div className="container narrow">
        <SectionHeader kicker="okay — read this first" />
        <Reveal className="reveal-pin letter-pin">
          <article ref={letterRef} className="letter">
            <span className="tape tape-a letter-tape" aria-hidden="true" />
            <span className="letter-date" aria-hidden="true">
              {LETTER_DATE}
            </span>
            <div className="sr-only">
              {PARAGRAPHS.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {/* the untyped rest stays in the layout (hidden) so the card never jumps while typing */}
            <div className="letter-body" aria-hidden="true">
              {PARAGRAPHS.map((p, i) => {
                const shown = Math.min(p.length, Math.max(0, count - STARTS[i]));
                const role = i === 0 ? "letter-lead" : i === PARAGRAPHS.length - 1 ? "letter-signature" : undefined;
                return (
                  <p key={i} className={role}>
                    {p.slice(0, shown)}
                    {i === caretAt && <span className="caret" />}
                    <span className="ghost">{p.slice(shown)}</span>
                  </p>
                );
              })}
            </div>
            <Doodle type="heart" className="letter-heart" />
          </article>
        </Reveal>
        <div className="letter-actions">
          {!done && (
            <button type="button" className="text-btn" onClick={() => setSkipped(true)}>
              too slow? show me all of it
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
