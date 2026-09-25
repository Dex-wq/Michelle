import { NOTES } from "../content";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const TILTS = [-3, 2, -1.5, 2.5, -2, 1.2];
const COLORS = ["#ffd6e5", "#e3d7ff", "#fff0b8", "#ffdcc8", "#d6f0ff", "#ffe0f0"];

// sticky notes stuck up on the wall — read them whenever
export default function Notes() {
  return (
    <section id="notes" className="section">
      <div className="container">
        <SectionHeader kicker="for the days you forget" title="Little reminders" />
        <div className="notes-grid">
          {NOTES.map((n, i) => (
            <Reveal key={n.text} className="reveal-pin" delay={250 + (i % 3) * 160}>
              <figure
                className="sticky"
                style={{ "--tilt": `${TILTS[i % TILTS.length]}deg`, "--note": COLORS[i % COLORS.length], "--i": i }}
              >
                <span className={`tape ${i % 2 ? "tape-b" : "tape-a"} sticky-tape`} aria-hidden="true" />
                <blockquote>{n.text}</blockquote>
                <figcaption>— {n.sign}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
