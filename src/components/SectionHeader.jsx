import { useId } from "react";
import { splitTrailingEmoji } from "../utils";
import Reveal from "./Reveal";

export function HeartMark() {
  const id = `heart-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg className="heart-mark" viewBox="0 0 48 44" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f5d0fe" />
          <stop offset="0.5" stopColor="#c084fc" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <path
        d="M24 42C10 32 2 24 2 13.5 2 6.5 7.5 1.5 14 1.5c4.5 0 8 2.5 10 6 2-3.5 5.5-6 10-6 6.5 0 12 5 12 12C46 24 38 32 24 42Z"
        fill={`url(#${id})`}
      />
      <path d="M12 8.5c-2.6 1-4 3.4-4 6" stroke="rgba(255,255,255,.6)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export default function SectionHeader({ eyebrow, title = "", heart = false, children }) {
  const [text, emoji] = splitTrailingEmoji(title);
  const EyebrowTag = text ? "p" : "h2";
  return (
    <Reveal className="section-header">
      {eyebrow && <EyebrowTag className="eyebrow">{eyebrow}</EyebrowTag>}
      {heart && <HeartMark />}
      {text && (
        <h2 className="section-title">
          <span className="text-gradient">{text}</span>
          {emoji && <span className="title-emoji" aria-hidden="true">{emoji}</span>}
        </h2>
      )}
      {children && <p className="section-lead">{children}</p>}
    </Reveal>
  );
}
