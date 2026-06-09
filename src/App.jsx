import { useState, useEffect, useRef } from "react";

// ══════════════════════════════════════════════════════════
//  CUSTOMISE HERE
// ══════════════════════════════════════════════════════════
const FRIEND_NAME = "Michelle💜"; // e.g. "Emily"
const PHOTO_SRC = "/Michelle1.jpeg"; // e.g. "/her-photo.jpg" — drop file in public/ folder
const AUDIO_SRC = "/Lovr.mp3.mp3"; // 🎵 ADD YOUR AUDIO — drop file in public/ folder e.g. "/her-song.mp3"

const WISHES = [
  "May every dream you chase manifest fully ✨",
  "You are the rarest star in the galaxy 💜",
  "The universe conspired just to create you 🌌",
  "Your kindness is a superpower 🦋",
  "You make the world so much more beautiful 🌸",
  "Every room you enter becomes magical 💫",
  "You are someone's(my) answered prayer 🙏",
  "Your laugh is the best sound in existence 🎶",
  "The stars are jealous of how you shine forshoooooo!⭐",
  "You are pure cosmic love 💖",
  "Born to be legendary, always 👑",
  "The world is richer because you exist 🌍",
];

const QUOTES = [
  { text: "You are not a drop in the ocean. You are the entire ocean in a drop.", author: "Rumi" },
  { text: "Some souls just understand each other upon meeting.", author: "N.R. Hart" },
  { text: "In the chaos of life, you are my constellation.", author: "For You" },
  { text: "She is clothed in strength and dignity, and she laughs without fear.", author: "Proverbs 31" },
  { text: "The most beautiful thing in the world is a heart that loves freely.", author: `For ${FRIEND_NAME}` },
  { text: "She was the universe's favourite secret, finally revealed.", author: "Written in Stardust" },
];

const LETTER = `To the person who knows exactly what I mean before I've finished the sentence…\n\n You are the kind of rare that people write poems about, The kind of soul whose light makes others see more clearly, believe more deeply, and strive to become the best version of themselves.\n\nYou deserve love in its most purest form.You deserve the world and I pray God grants you just that\n\nOn this day that the universe decided to gift you to us: I hope you feel every single ounce of the love that surrounds you. \n\nYou are adored.\n\n You are chosen.\n\n You are so deeply seen.\n\n I pray that God blesses you and keeps you safe.\n\n That He may order your steps.\n\nThat everything you touch to do may be blessed.\n\nThat He may grant you your Heart's Desire.\n\nI pray that He may Cover you with His wings,Protect you fully and watch over you.\n\n Na hiyo pass list ya 3rd year lazima upatikane ndani.\n\n I LOVE YOU \n\n May this be your best year yet.\n\n Happy 21, Michelle. 💜`;

// ══════════════════════════════════════════════════════════
//  GLOBAL STYLES injected once
// ══════════════════════════════════════════════════════════
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Lora:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #080415; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #080415; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(#7C3AED,#D946EF); border-radius: 3px; }
  * { cursor: none !important; }

  @keyframes twinkle   { 0%,100%{opacity:.15} 50%{opacity:1} }
  @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  @keyframes floatSlow { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-18px) rotate(2deg)} }
  @keyframes orbit     { to{transform:rotate(360deg)} }
  @keyframes orbitRev  { to{transform:rotate(-360deg)} }
  @keyframes pulseRing { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.15);opacity:1} }
  @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes sparkFade { 0%{opacity:1;transform:scale(1) translateY(0)} 100%{opacity:0;transform:scale(0) translateY(-16px)} }
  @keyframes heartRise { 0%{opacity:.9;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-120px) scale(.4)} }
  @keyframes lanternUp { 0%{opacity:1;transform:translateX(-50%) translateY(0) rotate(0deg)} 100%{opacity:0;transform:translateX(-50%) translateY(-600px) rotate(8deg)} }
  @keyframes shimmer   { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes glowPulse { 0%,100%{box-shadow:0 0 40px #7C3AED,0 0 80px #4C1D9544,0 0 120px #4C1D9522} 50%{box-shadow:0 0 60px #A855F7,0 0 120px #7C3AED66,0 0 200px #7C3AED22} }
  @keyframes nameReveal{ 0%{clip-path:inset(0 100% 0 0);opacity:0} 100%{clip-path:inset(0 0% 0 0);opacity:1} }
  @keyframes fadeUp    { 0%{opacity:0;transform:translateY(30px)} 100%{opacity:1;transform:translateY(0)} }
  @keyframes bar0{0%{height:8px}100%{height:64px}}
  @keyframes bar1{0%{height:20px}100%{height:52px}}
  @keyframes bar2{0%{height:12px}100%{height:76px}}
  @keyframes bar3{0%{height:30px}100%{height:58px}}
  @keyframes bar4{0%{height:6px}100%{height:68px}}
  @keyframes bar5{0%{height:16px}100%{height:44px}}
  @keyframes confettiPop {
    0%   { transform: translate(0,0) scale(1) rotate(0deg); opacity:1; }
    100% { transform: translate(var(--cx),var(--cy)) scale(0) rotate(720deg); opacity:0; }
  }
  @keyframes auraRotate { to { transform: rotate(360deg); } }
  @keyframes nebulaDrift { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,-15px) scale(1.05)} }
  @keyframes starBob { 0%{transform:translateY(0)} 100%{transform:translateY(-7px)} }
  @keyframes scrollHint { 0%,100%{opacity:.3;transform:translateY(0)} 50%{opacity:.9;transform:translateY(6px)} }
`;

// ══════════════════════════════════════════════════════════
//  CUSTOM CURSOR
// ══════════════════════════════════════════════════════════
function CustomCursor() {
  const [pos, setPos]     = useState({ x: -200, y: -200 });
  const [trail, setTrail] = useState([]);
  const tick = useRef(0);

  useEffect(() => {
    const onMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      tick.current++;
      if (tick.current % 2 === 0) {
        const id = Date.now() + Math.random();
        setTrail(t => [...t.slice(-28), { id, x: e.clientX, y: e.clientY, hue: 260 + Math.random() * 80 }]);
        setTimeout(() => setTrail(t => t.filter(s => s.id !== id)), 600);
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      {trail.map((s, i) => (
        <div key={s.id} style={{
          position: "fixed", left: s.x - 4, top: s.y - 4,
          width: 8, height: 8, borderRadius: "50%",
          background: `hsl(${s.hue},90%,70%)`,
          boxShadow: `0 0 8px hsl(${s.hue},90%,70%)`,
          pointerEvents: "none", zIndex: 99997,
          animation: "sparkFade .6s ease-out forwards",
          opacity: (i + 1) / trail.length,
        }} />
      ))}
      <div style={{
        position: "fixed", left: pos.x - 14, top: pos.y - 14,
        width: 28, height: 28, pointerEvents: "none", zIndex: 99999,
        transition: "left .04s linear, top .04s linear",
        filter: "drop-shadow(0 0 8px #C084FC)",
      }}>
        <svg viewBox="0 0 28 28"><path d="M14 2 L16 10.5 L24 12 L16 15 L17.5 23.5 L14 18 L10.5 23.5 L12 15 L4 12 L12 10.5 Z" fill="#C084FC" stroke="#8B5CF6" strokeWidth=".6"/></svg>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════
//  STAR FIELD
// ══════════════════════════════════════════════════════════
function StarField({ count = 160 }) {
  const stars = useRef(Array.from({ length: count }, () => ({
    x: Math.random() * 100, y: Math.random() * 100,
    s: .4 + Math.random() * 2,
    del: Math.random() * 6, dur: 2 + Math.random() * 4,
    c: Math.random() < .15 ? "#D946EF" : Math.random() < .3 ? "#C084FC" : Math.random() < .5 ? "#A855F7" : "#e8e0ff",
  })));
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {stars.current.map((s, i) => (
        <div key={i} style={{
          position: "absolute", left: `${s.x}%`, top: `${s.y}%`,
          width: s.s, height: s.s, borderRadius: "50%",
          background: s.c, boxShadow: `0 0 ${s.s * 3}px ${s.c}`,
          animation: `twinkle ${s.dur}s ${s.del}s infinite`,
        }} />
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  NEBULA BLOBS (atmospheric background)
// ══════════════════════════════════════════════════════════
function Nebula() {
  const blobs = [
    { top: "10%", left: "5%",  w: 500, h: 400, color: "#3b0764", delay: "0s" },
    { top: "40%", right: "5%", w: 420, h: 350, color: "#4a1272", delay: "2s" },
    { top: "70%", left: "20%", w: 380, h: 300, color: "#2d1060", delay: "1s" },
    { top: "20%", left: "50%", w: 300, h: 260, color: "#5b1a8a", delay: "3s" },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {blobs.map((b, i) => (
        <div key={i} style={{
          position: "absolute", top: b.top, left: b.left, right: b.right,
          width: b.w, height: b.h, borderRadius: "50%",
          background: `radial-gradient(ellipse, ${b.color}88 0%, transparent 70%)`,
          filter: "blur(60px)",
          animation: `nebulaDrift ${8 + i * 2}s ${b.delay} ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  PARTICLE GALAXY CANVAS
// ══════════════════════════════════════════════════════════
function ParticleGalaxy() {
  const canvasRef = useRef(null);
  const mouse     = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    const COLS   = ["#8B5CF6","#A855F7","#C084FC","#7C3AED","#D946EF","#e8e0ff","#DDD6FE","#f0abfc"];

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const N = 220;
    const pts = Array.from({ length: N }, (_, i) => {
      const angle = (i / N) * Math.PI * 2 * 5;
      const r     = 50 + (i / N) * Math.min(canvas.width, canvas.height) * .42;
      return {
        bx: canvas.width  / 2 + Math.cos(angle) * r,
        by: canvas.height / 2 + Math.sin(angle) * r,
        x:  canvas.width  / 2 + Math.cos(angle) * r,
        y:  canvas.height / 2 + Math.sin(angle) * r,
        vx: 0, vy: 0,
        sz: .6 + Math.random() * 2.8,
        col: COLS[i % COLS.length],
        tw: Math.random() * Math.PI * 2,
        sp: .008 + Math.random() * .018,
      };
    });

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      mouse.current = { x: cx - r.left, y: cy - r.top };
    };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onMove, { passive: true });

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.tw += p.sp;
        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        const f  = Math.max(0, (180 - d) / 180);
        p.vx = (p.vx + f * dx * .045 + (p.bx - p.x) * .04) * .87;
        p.vy = (p.vy + f * dy * .045 + (p.by - p.y) * .04) * .87;
        p.x += p.vx; p.y += p.vy;
        const alpha = .4 + .6 * Math.sin(p.tw);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.shadowColor = p.col;
        ctx.shadowBlur  = 10;
        ctx.fillStyle   = p.col;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "all" }} />;
}

// ══════════════════════════════════════════════════════════
//  FLOATING HEARTS (ambient)
// ══════════════════════════════════════════════════════════
function FloatingHearts() {
  const [hearts, setHearts] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      setHearts(h => [...h.slice(-14), {
        id, x: 5 + Math.random() * 90,
        size: 14 + Math.random() * 18,
        dur: 3 + Math.random() * 3,
        icon: Math.random() < .5 ? "💜" : Math.random() < .6 ? "🤍" : "💗",
      }]);
      setTimeout(() => setHearts(h => h.filter(x => x.id !== id)), 6000);
    }, 900);
    return () => clearInterval(interval);
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 30, overflow: "hidden" }}>
      {hearts.map(h => (
        <div key={h.id} style={{
          position: "absolute", bottom: 0, left: `${h.x}%`,
          fontSize: h.size,
          animation: `heartRise ${h.dur}s ease-out forwards`,
        }}>{h.icon}</div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  SECTION WRAPPER (fade-in on scroll)
// ══════════════════════════════════════════════════════════
function FadeSection({ children, style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: .12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(32px)",
      transition: "opacity .9s ease, transform .9s ease",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  HERO SECTION
// ══════════════════════════════════════════════════════════
function HeroSection() {
  const [nameVisible, setNameVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setNameVisible(true), 600); return () => clearTimeout(t); }, []);

  return (
    <section style={{
      minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(ellipse at 50% 30%, #2D1B4E 0%, #160a30 45%, #080415 100%)",
    }}>
      <Nebula />
      <StarField count={200} />
      <div style={{ position: "absolute", inset: 0, zIndex: 2 }}><ParticleGalaxy /></div>

      {/* PHOTO FRAME */}
      <div style={{ position: "relative", zIndex: 10, marginBottom: 40 }}>
        {/* Outer aura rings */}
        {[220, 200, 180].map((sz, i) => (
          <div key={i} style={{
            position: "absolute",
            top: `calc(50% - ${sz / 2}px)`, left: `calc(50% - ${sz / 2}px)`,
            width: sz, height: sz, borderRadius: "50%",
            border: `1px solid rgba(168,85,247,${.15 - i * .04})`,
            animation: `pulseRing ${2.5 + i * .5}s ${i * .3}s ease-in-out infinite`,
          }} />
        ))}
        {/* Rotating gradient aura */}
        <div style={{
          position: "absolute", inset: -24, borderRadius: "50%",
          background: "conic-gradient(from 0deg, #7C3AED, #D946EF, #A855F7, #C084FC, #7C3AED)",
          filter: "blur(16px)", opacity: .55,
          animation: "auraRotate 6s linear infinite",
        }} />
        {/* Orbiting dots */}
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{
            position: "absolute", inset: -20, borderRadius: "50%",
            animation: `${i % 2 === 0 ? "orbit" : "orbitRev"} ${4 + i * .7}s linear infinite`,
          }}>
            <div style={{
              position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
              width: 9, height: 9, borderRadius: "50%",
              background: ["#C084FC","#D946EF","#A855F7","#8B5CF6","#f0e6ff"][i],
              boxShadow: `0 0 14px ${["#C084FC","#D946EF","#A855F7","#8B5CF6","#f0e6ff"][i]}`,
            }} />
          </div>
        ))}
        {/* Crown */}
        <div style={{
          position: "absolute", top: -52, left: "50%", transform: "translateX(-50%)",
          fontSize: 44, animation: "float 2.5s ease-in-out infinite",
          filter: "drop-shadow(0 0 18px #C084FC)",
          zIndex: 5,
        }}>👑</div>
        {/* Photo circle */}
        <div style={{
          width: 190, height: 190, borderRadius: "50%",
          border: "3px solid #A855F7",
          background: PHOTO_SRC
            ? `url(${PHOTO_SRC}) center/cover`
            : "linear-gradient(135deg, #4C1D95 0%, #7C3AED 50%, #2D1B4E 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 70, userSelect: "none",
          animation: "glowPulse 3s ease-in-out infinite",
          position: "relative", zIndex: 3,
          overflow: "hidden",
        }}>
          {!PHOTO_SRC && <span style={{ filter: "drop-shadow(0 0 12px #fff)" }}>🌸</span>}
        </div>
        {/* Floating petals */}
        {[0,45,90,135,180,225,270,315].map((deg, i) => (
          <div key={i} style={{
            position: "absolute", top: "50%", left: "50%",
            transform: `rotate(${deg}deg) translateY(-118px) translateX(-50%)`,
            fontSize: 13,
            animation: `floatSlow ${2.2 + i * .25}s ${i * .18}s ease-in-out infinite`,
            pointerEvents: "none", zIndex: 4,
          }}>🌸</div>
        ))}
      </div>

      {/* NAME */}
      <div style={{
        zIndex: 10, textAlign: "center", position: "relative",
        opacity: nameVisible ? 1 : 0, transition: "opacity 1.8s ease",
      }}>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "clamp(11px, 2vw, 14px)", letterSpacing: "0.5em",
          color: "#C084FC", textTransform: "uppercase", marginBottom: 10,
          textShadow: "0 0 20px #C084FC88",
        }}>✦ &nbsp; Happy Birthday❤️ &nbsp; ✦</p>
        <h1 style={{
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: "clamp(48px, 11vw, 110px)",
          fontWeight: 900, lineHeight: 1,
          background: "linear-gradient(135deg, #C084FC 0%, #A855F7 25%, #f0e6ff 55%, #D946EF 80%, #C084FC 100%)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          animation: "shimmer 4s linear infinite",
          letterSpacing: ".05em",
        }}>{FRIEND_NAME}</h1>
        <p style={{
          fontFamily: "'Lora', serif", fontStyle: "italic",
          fontSize: "clamp(12px, 1.8vw, 16px)", color: "#DDD6FEaa",
          letterSpacing: ".25em", textTransform: "uppercase", marginTop: 14,
        }}>The universe's most beautiful star radiant enough to be admired, yet rare enough to be unforgettable. </p>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: "absolute", bottom: 28, zIndex: 10,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
      }}>
        <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, transparent, #A855F7)", animation: "scrollHint 1.8s ease-in-out infinite" }} />
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: ".35em", color: "#A855F766", textTransform: "uppercase" }}>scroll</p>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════
//  TYPEWRITER LETTER
// ══════════════════════════════════════════════════════════
function TypewriterSection() {
  const [displayed, setDisplayed] = useState("");
  const [idx, setIdx]             = useState(0);
  const [started, setStarted]     = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: .25 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started || idx >= LETTER.length) return;
    const delay = LETTER[idx] === "\n" ? 380 : LETTER[idx] === "," ? 90 : LETTER[idx] === "." ? 120 : 22;
    const t = setTimeout(() => { setDisplayed(d => d + LETTER[idx]); setIdx(i => i + 1); }, delay);
    return () => clearTimeout(t);
  }, [idx, started]);

  return (
    <section ref={ref} style={{
      padding: "100px 24px", position: "relative", overflow: "hidden",
      background: "linear-gradient(180deg, #080415 0%, #110828 50%, #080415 100%)",
    }}>
      <StarField count={80} />
      <FadeSection>
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(10px, 1.8vw, 13px)", letterSpacing: ".45em",
            color: "#A855F7", textTransform: "uppercase", textAlign: "center", marginBottom: 40,
          }}>✦ &nbsp; A Letter From the Stars &nbsp; ✦</p>
          <div style={{
            background: "linear-gradient(135deg, rgba(44,27,78,.55), rgba(76,29,149,.25))",
            border: "1px solid rgba(124,58,237,.35)",
            borderRadius: 28, padding: "clamp(28px,5vw,56px) clamp(24px,5vw,56px)",
            boxShadow: "0 0 80px rgba(76,29,149,.25), inset 0 0 60px rgba(124,58,237,.07)",
            backdropFilter: "blur(18px)",
            position: "relative", overflow: "hidden",
          }}>
            {/* top-left deco */}
            <div style={{ position: "absolute", top: 20, left: 20, fontSize: 22, opacity: .4 }}>✦</div>
            <div style={{ position: "absolute", top: 20, right: 20, fontSize: 22, opacity: .4 }}>✦</div>
            <div style={{ textAlign: "center", fontSize: 36, marginBottom: 28 }}>💌</div>
            <p style={{
              fontFamily: "'Lora', serif", fontStyle: "italic",
              fontSize: "clamp(14px, 1.9vw, 18px)", lineHeight: 1.95,
              color: "#DDD6FE", whiteSpace: "pre-line", letterSpacing: ".015em",
            }}>
              {displayed}
              <span style={{
                display: "inline-block", width: 2, height: "1.1em",
                background: "#C084FC", marginLeft: 3, verticalAlign: "text-bottom",
                animation: idx < LETTER.length ? "blink .7s step-end infinite" : "none",
                boxShadow: "0 0 10px #C084FC",
              }} />
            </p>
          </div>
        </div>
      </FadeSection>
    </section>
  );
}

// ══════════════════════════════════════════════════════════
//  CONSTELLATION CANVAS
// ══════════════════════════════════════════════════════════
function ConstellationSection() {
  const canvasRef = useRef(null);
  const starsRef  = useRef([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");

    const redraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const s = starsRef.current;
      // lines
      for (let i = 1; i < s.length; i++) {
        const dx = s[i].x - s[i-1].x, dy = s[i].y - s[i-1].y;
        if (Math.sqrt(dx*dx+dy*dy) < 220) {
          const g = ctx.createLinearGradient(s[i-1].x, s[i-1].y, s[i].x, s[i].y);
          g.addColorStop(0, "#8B5CF688"); g.addColorStop(1, "#D946EF88");
          ctx.strokeStyle = g; ctx.lineWidth = 1.5;
          ctx.shadowColor = "#8B5CF6"; ctx.shadowBlur = 10;
          ctx.beginPath(); ctx.moveTo(s[i-1].x, s[i-1].y); ctx.lineTo(s[i].x, s[i].y); ctx.stroke();
        }
      }
      // stars
      s.forEach((st, i) => {
        ctx.save();
        ctx.shadowColor = "#C084FC"; ctx.shadowBlur = 22;
        ctx.fillStyle = "#f0e6ff";
        ctx.beginPath(); ctx.arc(st.x, st.y, 4.5, 0, Math.PI*2); ctx.fill();
        ctx.shadowBlur = 8; ctx.fillStyle = "#D946EF";
        ctx.beginPath(); ctx.arc(st.x, st.y, 2, 0, Math.PI*2); ctx.fill();
        // label
        if (i === 0) {
          ctx.fillStyle = "#C084FC88"; ctx.font = "11px Inter,sans-serif";
          ctx.fillText("✦ start", st.x + 8, st.y - 8);
        }
        ctx.restore();
      });
    };

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; redraw(); };
    resize();
    window.addEventListener("resize", resize);

    const onClick = (e) => {
      const r = canvas.getBoundingClientRect();
      starsRef.current.push({ x: e.clientX - r.left, y: e.clientY - r.top });
      setCount(starsRef.current.length);
      redraw();
    };
    canvas.addEventListener("click", onClick);
    return () => { cancelAnimationFrame(0); window.removeEventListener("resize", resize); canvas.removeEventListener("click", onClick); };
  }, []);

  const clear = () => { starsRef.current = []; setCount(0); const c = canvasRef.current; c.getContext("2d").clearRect(0,0,c.width,c.height); };

  return (
    <section style={{ padding: "100px 24px", background: "#080415", position: "relative" }}>
      <StarField count={60} />
      <FadeSection style={{ position: "relative", zIndex: 2 }}>
        <p style={{ textAlign: "center", fontFamily: "'Inter',sans-serif", fontSize: 12, letterSpacing: ".45em", color: "#A855F7", textTransform: "uppercase", marginBottom: 12 }}>✦ Interactive ✦</p>
        <h2 style={{ textAlign: "center", fontFamily: "'Cinzel Decorative',serif", fontSize: "clamp(22px,4vw,40px)", fontWeight: 700, marginBottom: 12,
          background: "linear-gradient(90deg,#C084FC,#A855F7,#f0e6ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          Draw Her Constellation
        </h2>
        <p style={{ textAlign: "center", color: "#A855F788", fontFamily: "'Inter',sans-serif", fontSize: 14, marginBottom: 36 }}>
          Click anywhere on the canvas to place stars &amp; draw a constellation just for her
          {count > 0 && <span style={{ color: "#C084FC", marginLeft: 10 }}>— {count} star{count > 1 ? "s" : ""} placed ✦</span>}
        </p>
        <div style={{ maxWidth: 860, margin: "0 auto", borderRadius: 28, overflow: "hidden", position: "relative",
          border: "1px solid rgba(124,58,237,.35)", boxShadow: "0 0 60px rgba(76,29,149,.35)",
          background: "radial-gradient(ellipse at center, #150730 0%, #080415 100%)" }}>
          <StarField count={50} />
          <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: 420, position: "relative", zIndex: 2 }} />
        </div>
        {count > 0 && (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button onClick={clear} style={{
              padding: "9px 28px", borderRadius: 20, border: "1px solid #7C3AED44",
              background: "transparent", color: "#A855F7", cursor: "pointer",
              fontFamily: "'Inter',sans-serif", fontSize: 12, letterSpacing: ".12em",
            }}>Clear &amp; Start Over</button>
          </div>
        )}
      </FadeSection>
    </section>
  );
}

// ══════════════════════════════════════════════════════════
//  WISH LANTERNS
// ══════════════════════════════════════════════════════════
function WishLanterns() {
  const [lanterns, setLanterns] = useState([]);
  const counter = useRef(0);

  const launch = () => {
    const id   = ++counter.current;
    const wish = WISHES[(id - 1) % WISHES.length];
    setLanterns(l => [...l, { id, x: 15 + Math.random() * 70, wish, tilt: (Math.random() - .5) * 12 }]);
    setTimeout(() => setLanterns(l => l.filter(ln => ln.id !== id)), 6000);
  };

  return (
    <section style={{ padding: "100px 24px 140px", minHeight: "55vh", position: "relative", overflow: "hidden",
      background: "linear-gradient(180deg,#080415 0%,#110828 100%)" }}>
      <Nebula /><StarField count={100} />
      <FadeSection style={{ position: "relative", zIndex: 2 }}>
        <p style={{ textAlign:"center", fontFamily:"'Inter',sans-serif", fontSize:12, letterSpacing:".45em", color:"#A855F7", textTransform:"uppercase", marginBottom:12 }}>✦ Make a Wish ✦</p>
        <h2 style={{ textAlign:"center", fontFamily:"'Cinzel Decorative',serif", fontSize:"clamp(22px,4vw,40px)", fontWeight:700, marginBottom:12,
          background:"linear-gradient(90deg,#C084FC,#A855F7)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
          ❤️
        </h2>
        <p style={{ textAlign:"center", color:"#A855F788", fontFamily:"'Inter',sans-serif", fontSize:14, marginBottom:44 }}>
          Each lantern carries a wish into the universe ✦
        </p>
        <div style={{ textAlign: "center" }}>
          <button onClick={launch} style={{
            padding: "17px 52px", borderRadius: 60, fontSize: 15, fontWeight: 700,
            fontFamily: "'Inter',sans-serif", letterSpacing: ".08em",
            background: "linear-gradient(135deg,#7C3AED,#A855F7,#D946EF)",
            border: "none", color: "#fff", cursor: "pointer",
            boxShadow: "0 0 40px rgba(124,58,237,.6), 0 4px 20px rgba(0,0,0,.4)",
            transition: "transform .15s, box-shadow .15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform="scale(1.05)"; e.currentTarget.style.boxShadow="0 0 60px rgba(168,85,247,.8)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 0 40px rgba(124,58,237,.6)"; }}
          >🏮 &nbsp; Release a Lantern</button>
        </div>
      </FadeSection>
      {/* Launched lanterns */}
      {lanterns.map(ln => (
        <div key={ln.id} style={{
          position: "absolute", left: `${ln.x}%`, bottom: 60,
          animation: "lanternUp 6s ease-out forwards",
          pointerEvents: "none", zIndex: 20,
          transform: "translateX(-50%)", textAlign: "center",
        }}>
          <div style={{ fontSize: 44, filter: "drop-shadow(0 0 24px #C084FC)" }}>🏮</div>
          <div style={{
            marginTop: 8, padding: "7px 14px", borderRadius: 14, maxWidth: 150,
            background: "linear-gradient(135deg,rgba(44,27,78,.9),rgba(76,29,149,.8))",
            border: "1px solid rgba(168,85,247,.4)",
            color: "#DDD6FE", fontSize: 11, lineHeight: 1.5,
            backdropFilter: "blur(10px)",
            boxShadow: "0 0 20px rgba(124,58,237,.4)",
          }}>{ln.wish}</div>
        </div>
      ))}
    </section>
  );
}

// ══════════════════════════════════════════════════════════
//  WISH JAR
// ══════════════════════════════════════════════════════════
function WishJar() {
  const [count, setCount] = useState(0);
  const MAX = 20;
  const pct = Math.min(count / MAX, 1);
  const starData = useRef(Array.from({ length: MAX }, () => ({
    x: 18 + Math.random() * 64, delay: Math.random() * .8, sz: 9 + Math.random() * 10,
  })));

  return (
    <section style={{ padding:"100px 24px", background:"linear-gradient(180deg,#080415,#110828)", display:"flex", flexDirection:"column", alignItems:"center" }}>
      <StarField count={60} />
      <FadeSection style={{ position:"relative", zIndex:2, display:"flex", flexDirection:"column", alignItems:"center", width:"100%" }}>
        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, letterSpacing:".45em", color:"#A855F7", textTransform:"uppercase", marginBottom:12 }}>✦ Pour Your Love ✦</p>
        <h2 style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"clamp(22px,4vw,40px)", fontWeight:700, marginBottom:12, textAlign:"center",
          background:"linear-gradient(90deg,#A855F7,#f0e6ff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
          Wish Jar
        </h2>
        <p style={{ color:"#A855F788", fontFamily:"'Inter',sans-serif", fontSize:14, marginBottom:52, textAlign:"center" }}>
          Click to pour wishes in ✦
        </p>
        {/* Jar SVG */}
        <div style={{ position:"relative", width:200, height:290, marginBottom:36 }}>
          <svg viewBox="0 0 200 290" style={{ position:"absolute", inset:0, width:"100%", height:"100%", overflow:"visible" }}>
            <defs>
              <clipPath id="jc">
                <path d="M38 58 Q22 90 22 210 Q22 262 100 262 Q178 262 178 210 Q178 90 162 58 Z" />
              </clipPath>
              <linearGradient id="jfill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A855F7" stopOpacity=".85"/>
                <stop offset="100%" stopColor="#4C1D95" stopOpacity=".95"/>
              </linearGradient>
              <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            {/* fill liquid */}
            <rect x="22" y={262 - pct * 200} width="156" height={pct * 200} clipPath="url(#jc)" fill="url(#jfill)" style={{ transition:"y .6s ease, height .6s ease" }}/>
            {/* stars inside */}
            {Array.from({ length: Math.round(pct * MAX) }).map((_, i) => (
              <text key={i} x={22 + starData.current[i].x * 1.56}
                y={262 - pct * 200 + 18 + i * 9}
                fontSize={starData.current[i].sz}
                style={{ animation:`starBob 2s ${starData.current[i].delay}s ease-in-out infinite alternate` }}
              >⭐</text>
            ))}
            {/* glass shine */}
            <path d="M50 70 Q45 130 48 210" stroke="rgba(255,255,255,.12)" strokeWidth="8" fill="none" strokeLinecap="round"/>
            {/* jar outline */}
            <path d="M55 48 L145 48 L162 58 Q178 90 178 210 Q178 264 100 264 Q22 264 22 210 Q22 90 38 58 Z"
              stroke="#A855F7" strokeWidth="2.5" fill="none" filter="url(#glow)"/>
            {/* lid */}
            <path d="M44 48 L156 48 L162 36 L38 36 Z" stroke="#C084FC" strokeWidth="2" fill="none"/>
            <rect x="72" y="28" width="56" height="10" rx="5" stroke="#C084FC" strokeWidth="1.5" fill="none"/>
          </svg>
        </div>
        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"#C084FC", marginBottom:28 }}>
          {count} / {MAX} wishes poured in
          {count >= MAX && <span style={{ color:"#D946EF", marginLeft:10, fontWeight:600 }}>✨ Overflowing with love!</span>}
        </p>
        <button onClick={() => setCount(c => Math.min(c + 1, MAX))} disabled={count >= MAX} style={{
          padding:"15px 44px", borderRadius:60, fontSize:14, fontWeight:700, letterSpacing:".07em",
          fontFamily:"'Inter',sans-serif",
          background: count >= MAX ? "rgba(44,27,78,.5)" : "linear-gradient(135deg,#4C1D95,#7C3AED)",
          border:"1px solid rgba(124,58,237,.5)", color: count >= MAX ? "#6b4fa0" : "#f0e6ff",
          cursor: count >= MAX ? "not-allowed" : "pointer",
          boxShadow: count >= MAX ? "none" : "0 0 30px rgba(124,58,237,.5)",
          transition:"all .3s",
        }}>
          {count >= MAX ? "🌟 Jar is Full!" : "⭐ Pour a Wish"}
        </button>
      </FadeSection>
    </section>
  );
}

// ══════════════════════════════════════════════════════════
//  MUSIC VISUALIZER — NOW WITH ACTUAL AUDIO PLAYBACK 🎵
// ══════════════════════════════════════════════════════════
function MusicVisualizer() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const BARS = 40;

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {
        // If browser blocks autoplay, still show visualizer
        setPlaying(true);
      });
      setPlaying(true);
    }
  };

  // Listen for actual pause/end events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => setPlaying(false);
    const onPause = () => setPlaying(false);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  return (
    <section style={{ padding:"80px 24px", background:"#080415", display:"flex", flexDirection:"column", alignItems:"center" }}>
      {/* Hidden audio element */}
      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" loop />

      <FadeSection style={{ width:"100%", display:"flex", flexDirection:"column", alignItems:"center" }}>
        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, letterSpacing:".45em", color:"#A855F7", textTransform:"uppercase", marginBottom:12 }}>✦ The Vibe ✦</p>
        <h2 style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"clamp(20px,3.5vw,36px)", fontWeight:700, marginBottom:12, textAlign:"center",
          background:"linear-gradient(90deg,#C084FC,#A855F7)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
          You are an embodiment of love❤️
        </h2>
        <p style={{ color:"#A855F788", fontFamily:"'Inter',sans-serif", fontSize:13, marginBottom:40, textAlign:"center" }}>
          Every song was written thinking of someone like you ✦
        </p>
        <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:90, marginBottom:36 }}>
          {Array.from({ length: BARS }, (_, i) => (
            <div key={i} style={{
              width: "clamp(4px,1.2vw,7px)", borderRadius:"3px 3px 0 0",
              background:`linear-gradient(to top,#4C1D95,#7C3AED ${40 + (i % 5)*10}%,#C084FC)`,
              height: playing ? undefined : `${12 + Math.abs(Math.sin(i*.45+1))*62}px`,
              animation: playing ? `bar${i%6} ${.45+(i%7)*.09}s ${i*.028}s ease-in-out infinite alternate` : "none",
              boxShadow: playing ? `0 0 10px #8B5CF6` : "none",
              transition: "height .4s",
            }}/>
          ))}
        </div>
        <button onClick={toggle} style={{
          padding:"13px 36px", borderRadius:60, fontSize:14, fontWeight:700, letterSpacing:".07em",
          fontFamily:"'Inter',sans-serif",
          background: playing ? "linear-gradient(135deg,#4C1D95,#7C3AED)" : "transparent",
          border:`2px solid ${playing ? "#7C3AED" : "rgba(124,58,237,.5)"}`,
          color:"#C084FC", cursor:"pointer",
          boxShadow: playing ? "0 0 36px rgba(124,58,237,.6)" : "none",
          transition:"all .3s",
        }}>
          {playing ? "⏸ ❤️  " : "▶  So this is love"}
        </button>
      </FadeSection>
    </section>
  );
}

// ══════════════════════════════════════════════════════════
//  QUOTES CAROUSEL
// ══════════════════════════════════════════════════════════
function QuotesCarousel() {
  const [idx, setIdx]   = useState(0);
  const [fade, setFade] = useState(true);

  const go = (next) => {
    setFade(false);
    setTimeout(() => { setIdx(next); setFade(true); }, 350);
  };

  useEffect(() => {
    const t = setInterval(() => go((idx + 1) % QUOTES.length), 5000);
    return () => clearInterval(t);
  }, [idx]);

  return (
    <section style={{ padding:"100px 24px", background:"linear-gradient(180deg,#110828 0%,#080415 100%)", display:"flex", flexDirection:"column", alignItems:"center" }}>
      <StarField count={70} />
      <FadeSection style={{ position:"relative", zIndex:2, width:"100%", display:"flex", flexDirection:"column", alignItems:"center" }}>
        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, letterSpacing:".45em", color:"#A855F7", textTransform:"uppercase", marginBottom:12 }}>✦ ✦</p>
        <h2 style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"clamp(22px,4vw,40px)", fontWeight:700, marginBottom:56, textAlign:"center",
          background:"linear-gradient(90deg,#f0e6ff,#C084FC)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
          ❤️
        </h2>
        <div style={{ maxWidth:740, textAlign:"center", minHeight:160, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
          opacity: fade ? 1 : 0, transition:"opacity .35s ease", padding:"0 24px" }}>
          <div style={{ fontSize:48, color:"#7C3AED", fontFamily:"Georgia,serif", lineHeight:.5, marginBottom:24, opacity:.7 }}>"</div>
          <p style={{ fontFamily:"'Lora',serif", fontStyle:"italic", fontSize:"clamp(17px,2.8vw,24px)", lineHeight:1.75, color:"#f0e6ff", marginBottom:24 }}>
            {QUOTES[idx].text}
          </p>
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"#A855F7", letterSpacing:".2em", textTransform:"uppercase" }}>
            — {QUOTES[idx].author}
          </p>
        </div>
        {/* Dot nav */}
        <div style={{ display:"flex", gap:10, marginTop:44, alignItems:"center" }}>
          {QUOTES.map((_, i) => (
            <button key={i} onClick={() => go(i)} style={{
              width: i===idx ? 28 : 8, height:8, borderRadius:4,
              background: i===idx ? "linear-gradient(90deg,#A855F7,#D946EF)" : "rgba(76,29,149,.6)",
              border:"none", cursor:"pointer",
              boxShadow: i===idx ? "0 0 14px #A855F7" : "none",
              transition:"all .35s",
            }}/>
          ))}
        </div>
      </FadeSection>
    </section>
  );
}

// ══════════════════════════════════════════════════════════
//  STATS / FUN FACTS ROW
// ══════════════════════════════════════════════════════════
function StatsRow() {
  const stats = [
    { icon: "💜", num: "∞", label: "Reasons you're loved" },
    { icon: "⭐", num: "1/∞", label: "Chance of someone like you" },
    { icon: "🌌", num: "21", label: "Years of pure magic" },
    { icon: "🎂", num: "1", label: "Day the stars aligned" },
  ];
  return (
    <section style={{ padding:"80px 24px", background:"#080415" }}>
      <FadeSection>
        <div style={{ maxWidth:900, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:24 }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              textAlign:"center", padding:"36px 24px",
              background:"linear-gradient(145deg,rgba(44,27,78,.5),rgba(76,29,149,.2))",
              border:"1px solid rgba(124,58,237,.25)", borderRadius:20,
              transition:"transform .3s, box-shadow .3s",
              animation:`fadeUp .6s ${i*.1}s both`,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-6px)"; e.currentTarget.style.boxShadow="0 20px 60px rgba(124,58,237,.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}
            >
              <div style={{ fontSize:32, marginBottom:12 }}>{s.icon}</div>
              <div style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"clamp(20px,3vw,28px)", color:"#C084FC",
                marginBottom:8, textShadow:"0 0 20px #A855F766" }}>{s.num}</div>
              <div style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"#A855F788", letterSpacing:".1em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </FadeSection>
    </section>
  );
}

// ══════════════════════════════════════════════════════════
//  FINALE
// ══════════════════════════════════════════════════════════
function FinaleSection() {
  const [burst, setBurst]       = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [clicked, setClicked]   = useState(false);

  const boom = () => {
    setClicked(true); setBurst(true);
    const pieces = Array.from({ length: 80 }, (_, i) => {
      const angle = (i / 80) * 360;
      const dist  = 80 + Math.random() * 200;
      return {
        id: i,
        cx: `${Math.cos(angle * Math.PI / 180) * dist}px`,
        cy: `${Math.sin(angle * Math.PI / 180) * dist - 120}px`,
        color: ["#C084FC","#A855F7","#D946EF","#8B5CF6","#f0e6ff","#7C3AED","#e879f9"][i % 7],
        size: 6 + Math.random() * 10,
        delay: Math.random() * .4,
        shape: Math.random() < .4 ? "2px" : "50%",
      };
    });
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 3000);
    setTimeout(() => setBurst(false), 200);
  };

  return (
    <section style={{ padding:"120px 24px 140px", position:"relative", overflow:"hidden",
      background:"radial-gradient(ellipse at 50% 50%, #2D1B4E 0%,#160a30 40%,#080415 100%)" }}>
      <Nebula /><StarField count={180} />
      {confetti.map(c => (
        <div key={c.id} style={{
          position:"absolute", left:"50%", top:"50%",
          width:c.size, height:c.size, borderRadius:c.shape,
          background:c.color, pointerEvents:"none", zIndex:20,
          boxShadow:`0 0 10px ${c.color}`,
          "--cx": c.cx, "--cy": c.cy,
          animation:`confettiPop 2.2s ${c.delay}s ease-out forwards`,
        }}/>
      ))}
      <FadeSection style={{ position:"relative", zIndex:5, textAlign:"center" }}>
        <div style={{ fontSize:72, animation:"float 2.8s ease-in-out infinite", marginBottom:32, display:"inline-block",
          filter:"drop-shadow(0 0 30px #C084FC)" }}>🎂</div>
        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, letterSpacing:".45em", color:"#A855F7", textTransform:"uppercase", marginBottom:20 }}>
          ✦ &nbsp; For an amazing person &nbsp; ✦
        </p>
        <h2 style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"clamp(30px,7vw,76px)", fontWeight:900, lineHeight:1.1, marginBottom:28,
          background:"linear-gradient(135deg,#C084FC 0%,#D946EF 35%,#A855F7 65%,#f0e6ff 100%)",
          backgroundSize:"200% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          animation:"shimmer 3s linear infinite",
        }}>
          Happy Happy Birthday,<br/>{FRIEND_NAME}
        </h2>
        <p style={{ fontFamily:"'Lora',serif", fontStyle:"italic",
          fontSize:"clamp(14px,2.2vw,20px)", color:"#C084FC", maxWidth:600, margin:"0 auto 56px", lineHeight:1.85 }}>
          The stars aligned on the day you were born. The universe exhaled.<br/>
          And the world became a little more magical because you're in it❤️.
        </p>
        <button onClick={boom} style={{
          padding:"20px 64px", borderRadius:80, fontSize:16, fontWeight:800,
          fontFamily:"'Inter',sans-serif", letterSpacing:".08em",
          background: burst
            ? "linear-gradient(135deg,#D946EF,#C084FC,#7C3AED)"
            : "linear-gradient(135deg,#7C3AED,#A855F7,#D946EF)",
          border:"none", color:"#fff", cursor:"pointer",
          boxShadow:"0 0 50px rgba(124,58,237,.7), 0 6px 30px rgba(0,0,0,.5)",
          transition:"transform .15s",
          transform: burst ? "scale(.95)" : "scale(1)",
        }}
          onMouseEnter={e => e.currentTarget.style.boxShadow="0 0 80px rgba(217,70,239,.9)"}
          onMouseLeave={e => e.currentTarget.style.boxShadow="0 0 50px rgba(124,58,237,.7)"}
        >
          {clicked ? "🎊 Happy 21 !! 🎊" : "✨ Ya Mwisho bas ✨"}
        </button>
        {clicked && (
          <p style={{ fontFamily:"'Lora',serif", fontStyle:"italic", color:"#A855F7", marginTop:32, fontSize:16,
            animation:"fadeUp .8s both" }}>
            You are so endlessly loved 💜
          </p>
        )}
      </FadeSection>
    </section>
  );
}

// ══════════════════════════════════════════════════════════
//  APP
// ══════════════════════════════════════════════════════════
export default function App() {
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <CustomCursor />
      <FloatingHearts />
      <div id="hero">  <HeroSection /></div>
      <div id="letter"><TypewriterSection /></div>
                       <StatsRow />
                       <ConstellationSection />
                       <WishLanterns />
                       <WishJar />
                       <MusicVisualizer />
                       <QuotesCarousel />
      <div id="finale"><FinaleSection /></div>
    </>
  );
}