import { useEffect, useState } from "react";

// Floating play/pause pill that appears once the hero scrolls away
export default function MusicDock({ playing, onToggle }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const obs = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0.05 });
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  return (
    <button
      type="button"
      className={`music-dock${visible ? " is-visible" : ""}${playing ? " is-playing" : ""}`}
      onClick={onToggle}
      aria-label={playing ? "Pause the song" : "Play the song"}
      tabIndex={visible ? 0 : -1}
    >
      {playing ? (
        <span className="dock-bars" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
      ) : (
        <svg className="dock-play" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.2-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
        </svg>
      )}
    </button>
  );
}
