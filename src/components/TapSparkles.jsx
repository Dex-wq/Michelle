import { useEffect } from "react";
import { burst } from "../confetti";
import { useMediaQuery, useReducedMotion } from "../hooks";

const INTERACTIVE = "button, a, canvas, [role='button'], .intro";

// Phones get no cursor trail, so a tap on the page pops a few tiny hearts instead
export default function TapSparkles() {
  const touch = useMediaQuery("(hover: none), (pointer: coarse)");
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!touch || reduced) return;
    const onTap = (e) => {
      if (e.target.closest?.(INTERACTIVE)) return;
      burst({ x: e.clientX, y: e.clientY, count: 12, spread: 360, power: 4.5, scale: 0.55, shapes: ["heart", "circle"] });
    };
    window.addEventListener("click", onTap);
    return () => window.removeEventListener("click", onTap);
  }, [touch, reduced]);

  return null;
}
