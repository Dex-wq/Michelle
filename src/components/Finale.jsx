import { useEffect, useRef, useState } from "react";
import { AGE, FRIEND_NAME } from "../content";
import { burst } from "../confetti";
import { fireworks } from "../fireworks";
import { splitTrailingEmoji } from "../utils";
import Doodle from "./Doodle";
import Reveal from "./Reveal";

// Listens for a breath on the mic: blowing is loud, broadband, low-frequency noise
async function listenForBlow(onBlow) {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: false },
  });
  const Ctx = window.AudioContext || window.webkitAudioContext;
  const ctx = new Ctx();
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  ctx.createMediaStreamSource(stream).connect(analyser);
  const data = new Uint8Array(analyser.frequencyBinCount);
  let loud = 0;
  let raf = 0;
  const stop = () => {
    cancelAnimationFrame(raf);
    stream.getTracks().forEach((t) => t.stop());
    ctx.close();
  };
  const tick = () => {
    analyser.getByteFrequencyData(data);
    const low = data.length >> 2;
    let sum = 0;
    for (let i = 1; i < low; i++) sum += data[i];
    loud = sum / (low - 1) > 150 ? loud + 1 : Math.max(0, loud - 1);
    if (loud > 9) {
      stop();
      onBlow();
      return;
    }
    raf = requestAnimationFrame(tick);
  };
  tick();
  return stop;
}

function Cake({ out, name }) {
  return (
    <svg className={`cake${out ? " is-out" : ""}`} viewBox="0 0 260 250" role="img" aria-label="A birthday cake with 2 and 1 candles">
      <defs>
        <pattern id="candle-stripes" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
          <rect width="10" height="10" fill="#fff4f8" />
          <rect width="5" height="10" fill="#ff8fb8" />
        </pattern>
        <radialGradient id="flame-fill" cx="50%" cy="70%" r="60%">
          <stop offset="0" stopColor="#fffbe8" />
          <stop offset="0.45" stopColor="#ffd66b" />
          <stop offset="1" stopColor="#ff8a3d" />
        </radialGradient>
        <radialGradient id="flame-glow">
          <stop offset="0" stopColor="#ffcf7a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffcf7a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="130" cy="228" rx="116" ry="15" fill="rgba(0,0,0,.35)" />
      <ellipse cx="130" cy="222" rx="112" ry="14" fill="#f4ecdf" />
      <ellipse cx="130" cy="219" rx="104" ry="10" fill="#fffaf2" />

      <rect x="42" y="134" width="176" height="84" rx="14" fill="#c9a4ff" />
      <rect x="42" y="190" width="176" height="28" rx="12" fill="#b58bf5" />
      <rect x="40" y="126" width="180" height="22" rx="11" fill="#fff4f8" />
      {[56, 82, 118, 152, 186, 204].map((x, i) => (
        <rect key={x} x={x} y="138" width="12" height={[20, 30, 16, 26, 18, 24][i]} rx="6" fill="#fff4f8" />
      ))}
      {[
        [66, 176, 20, "#ffe08a"], [98, 196, 70, "#fff"], [150, 180, 120, "#ff8fb8"],
        [182, 198, 30, "#ffe08a"], [120, 204, 160, "#fff"], [200, 170, 80, "#ff8fb8"], [54, 202, 140, "#fff"],
      ].map(([x, y, r, c]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="9" height="3.4" rx="1.7" fill={c} transform={`rotate(${r} ${x + 4} ${y + 2})`} />
      ))}
      <text x="130" y="184" textAnchor="middle" className="cake-name">
        {name}
      </text>

      {[
        { digit: String(AGE)[0], x: 106 },
        { digit: String(AGE)[1] ?? "", x: 156 },
      ].map(({ digit, x }) => (
        <g key={x}>
          <text x={x} y="129" textAnchor="middle" className="candle-digit">
            {digit}
          </text>
          <line x1={x} y1="80" x2={x} y2="70" stroke="#3a2c24" strokeWidth="2.4" strokeLinecap="round" />
          <g className="flame" style={{ transformOrigin: `${x}px 70px` }}>
            <circle cx={x} cy="58" r="22" fill="url(#flame-glow)" />
            <path d={`M${x} 42c5 8 8 13 7 19-1 5-4 8-7 8s-6-3-7-8c-1-6 2-11 7-19z`} fill="url(#flame-fill)" />
          </g>
          <path className="smoke" d={`M${x} 68c-5-7 5-11 0-18s5-11 0-18`} />
        </g>
      ))}
    </svg>
  );
}

export default function Finale() {
  const [blown, setBlown] = useState(false);
  const [mic, setMic] = useState("idle"); // idle → listening → failed
  const buttonRef = useRef(null);
  const stopListening = useRef(null);
  const [name, emoji] = splitTrailingEmoji(FRIEND_NAME);

  useEffect(() => () => stopListening.current?.(), []);

  const celebrate = () => {
    if (blown) {
      fireworks({ count: 6, duration: 2500 });
      return;
    }
    setBlown(true);
    stopListening.current?.();
    const box = buttonRef.current.getBoundingClientRect();
    burst({ x: box.left + box.width / 2, y: box.top + box.height / 2, count: 150, spread: 100, power: 16 });
    fireworks({ count: 14, duration: 6000 });
    setTimeout(() => {
      burst({ x: 0, y: window.innerHeight, angle: -58, spread: 36, count: 80, power: 22 });
      burst({ x: window.innerWidth, y: window.innerHeight, angle: -122, spread: 36, count: 80, power: 22 });
    }, 350);
  };

  const listen = async () => {
    setMic("listening");
    try {
      stopListening.current = await listenForBlow(() => {
        setMic("idle");
        celebrate();
      });
    } catch {
      setMic("failed");
    }
  };

  return (
    <section id="finale" className="section finale">
      <Reveal className="container finale-inner">
        <p className="kicker finale-kicker">one last thing…</p>
        <div className="finale-cake">
          <Cake out={blown} name={name} />
        </div>
        <h2 className="finale-title">
          Happy birthday,
          <span className="finale-name">
            {name}
            {emoji && <span className="finale-emoji">{emoji}</span>}
          </span>
        </h2>
        <p className="finale-text">
          <span>The stars aligned on the day you were born. The universe exhaled.</span>
          <span>And the world became a little more magical because you&apos;re in it❤️.</span>
        </p>
        {!blown && <p className="finale-hint">make a wish first, then…</p>}
        <button
          ref={buttonRef}
          type="button"
          className={`btn btn-pink btn-xl${blown ? "" : " is-inviting"}`}
          onClick={celebrate}
        >
          {blown ? `🎊 Happy ${AGE} !! 🎊` : "✨ Ya Mwisho bas ✨"}
        </button>
        {!blown && navigator.mediaDevices?.getUserMedia && (
          <button type="button" className="text-btn finale-mic" onClick={listen} disabled={mic === "listening"}>
            {mic === "listening"
              ? "listening… blow out your candles 🌬️"
              : mic === "failed"
                ? "couldn't reach the mic — just tap the button 💜"
                : "or blow them out for real 🎤"}
          </button>
        )}
        {blown && (
          <p className="finale-note">
            You are so endlessly loved 💜
            <span className="finale-sign">
              nakupenda sana
              <Doodle type="heart" className="finale-heart" />
            </span>
          </p>
        )}
      </Reveal>
    </section>
  );
}
