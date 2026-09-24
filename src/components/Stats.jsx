import { STATS } from "../content";
import Reveal from "./Reveal";

export default function Stats() {
  return (
    <section className="section stats-section" aria-label="A few facts about you">
      <div className="container stats-grid">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 90}>
            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">
                {s.icon}
              </span>
              <span className="stat-num">{s.num}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
