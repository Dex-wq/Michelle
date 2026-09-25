import { useEffect, useRef } from "react";
import { FRIEND_NAME, SONG_TITLE } from "../content";
import { splitTrailingEmoji } from "../utils";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const BARS = 28;
const IDLE = Array.from({ length: BARS }, (_, i) => 0.14 + Math.abs(Math.sin(i * 0.5 + 1)) * 0.46);

// a mixtape with her name on it; the reels turn while the song plays
export default function Music({ playing, onToggle, analyserRef }) {
  const eqRef = useRef(null);
  const [name] = splitTrailingEmoji(FRIEND_NAME);

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
        <SectionHeader kicker="turn it up for this one" title="You are an embodiment of love❤️" />
        <Reveal>
          <div className={`deck${playing ? " is-playing" : ""}`}>
            <div className="cassette" aria-hidden="true">
              <span className="cassette-screw s1" />
              <span className="cassette-screw s2" />
              <span className="cassette-screw s3" />
              <span className="cassette-screw s4" />
              <div className="cassette-label">
                <span className="cassette-side">A</span>
                <span className="cassette-title">{SONG_TITLE} ♡</span>
                <span className="cassette-for">for {name}</span>
                <div className="cassette-window">
                  <span className="reel reel-left" />
                  <span className="reel reel-right" />
                </div>
              </div>
              <div className="cassette-foot">
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>

            <div className="deck-controls">
              <button type="button" className="btn btn-pink btn-lg" onClick={onToggle}>
                {playing ? "❚❚  Pause" : "▶  Play it"}
              </button>
              <div className="eq" ref={eqRef} aria-hidden="true">
                {IDLE.map((height, i) => (
                  <span key={i} className="eq-bar" style={{ "--idle": height, "--delay": `${-i * 0.07}s` }} />
                ))}
              </div>
              <p className="deck-status">{playing ? "now playing — side A" : "press play, I'll wait"}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
