import { useEffect, useRef } from "react";
import { FRIEND_NAME, PHOTO_SRC, SONG_TITLE } from "../content";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const BARS = 36;
const IDLE = Array.from({ length: BARS }, (_, i) => 0.12 + Math.abs(Math.sin(i * 0.45 + 1)) * 0.5);

export default function Music({ playing, onToggle, analyserRef }) {
  const eqRef = useRef(null);

  // live, mirrored spectrum when Web Audio is available; otherwise CSS bounces the bars
  useEffect(() => {
    const eq = eqRef.current;
    const bars = [...eq.children];
    const analyser = analyserRef.current;
    if (!playing || !analyser) {
      eq.dataset.live = "false";
      bars.forEach((bar) => (bar.style.transform = ""));
      return;
    }
    eq.dataset.live = "true";
    const data = new Uint8Array(analyser.frequencyBinCount);
    const mid = (BARS - 1) / 2;
    let raf = 0;
    const tick = () => {
      analyser.getByteFrequencyData(data);
      bars.forEach((bar, i) => {
        const distance = Math.abs(i - mid) / mid;
        const bin = Math.min(data.length - 1, 1 + Math.floor(distance ** 1.3 * data.length * 0.7));
        bar.style.transform = `scaleY(${Math.max(0.06, data[bin] / 255)})`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, analyserRef]);

  return (
    <section id="music" className="section">
      <div className="container">
        <SectionHeader eyebrow="The Vibe" title="You are an embodiment of love❤️">
          Every song was written thinking of someone like you ✦
        </SectionHeader>
        <Reveal>
          <div className={`player${playing ? " is-playing" : ""}`}>
            <div className="turntable" aria-hidden="true">
              <div className="vinyl">
                <div
                  className="vinyl-label"
                  style={PHOTO_SRC ? { backgroundImage: `url(${PHOTO_SRC})` } : undefined}
                />
              </div>
              <div className="vinyl-sheen" />
              <div className="tonearm">
                <span className="tonearm-head" />
              </div>
            </div>
            <div className="player-info">
              <p className="player-kicker">
                <span className="player-dot" />
                {playing ? "Now playing" : "Press play"}
              </p>
              <h3 className="player-title">{SONG_TITLE}</h3>
              <p className="player-sub">for {FRIEND_NAME}</p>
              <div className="eq" ref={eqRef} aria-hidden="true">
                {IDLE.map((height, i) => (
                  <span key={i} className="eq-bar" style={{ "--idle": height, "--delay": `${-i * 0.07}s` }} />
                ))}
              </div>
              <button type="button" className="btn btn-primary" onClick={onToggle}>
                {playing ? "⏸  Pause ❤️" : "▶  Play"}
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
