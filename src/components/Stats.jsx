import { STATS } from "../content";
import Reveal from "./Reveal";

const TILTS = [-2.5, 1.8, -1.2, 2.4];

// little index cards, pinned up like a moodboard
export default function Stats() {
  return (
    <section className="section facts-section" aria-label="A few facts about you">
      <div className="container facts-grid">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 90}>
            <div className="fact-card" style={{ "--tilt": `${TILTS[i % TILTS.length]}deg` }}>
              {i % 2 === 0 && <span className="tape tape-a fact-tape" aria-hidden="true" />}
              <span className="fact-icon" aria-hidden="true">
                {s.icon}
              </span>
              <span className="fact-num">{s.num}</span>
              <span className="fact-label">{s.label}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
