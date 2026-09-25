import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

export function useInView({ threshold = 0.12, once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (once) obs.disconnect();
      } else if (!once) {
        setInView(false);
      }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, once]);

  return [ref, inView];
}

export function useMediaQuery(query) {
  const subscribe = useCallback((notify) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", notify);
    return () => mql.removeEventListener("change", notify);
  }, [query]);
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");

// iOS routes Web Audio through the ringer switch, which would mute the song — keep it on plain <audio> there
const isIOS = () =>
  /iP(hone|od|ad)/.test(navigator.userAgent) || (navigator.userAgent.includes("Mac") && "ontouchend" in document);

// One shared <audio> for the hero button, the player section and the floating dock
export function useAudioPlayer() {
  const audioRef = useRef(null);
  const analyserRef = useRef(null);
  const contextRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setPlaying(true);
    const onStop = () => setPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onStop);
    audio.addEventListener("ended", onStop);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onStop);
      audio.removeEventListener("ended", onStop);
    };
  }, []);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.paused) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!contextRef.current && Ctx && !isIOS()) {
      try {
        const ctx = new Ctx();
        contextRef.current = ctx;
        const source = ctx.createMediaElementSource(audio);
        try {
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 128;
          analyser.smoothingTimeConstant = 0.8;
          source.connect(analyser);
          analyser.connect(ctx.destination);
          analyserRef.current = analyser;
        } catch {
          source.connect(ctx.destination);
        }
      } catch {
        // No Web Audio — the equaliser falls back to its CSS animation
      }
    }
    contextRef.current?.resume?.();
    audio.play().catch(() => {});
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) play();
    else audio.pause();
  }, [play]);

  return { audioRef, analyserRef, playing, play, toggle };
}
