import Reveal from "./Reveal";

// A handwritten kicker over a bold serif title — alignment varies by section
export default function SectionHeader({ kicker, title, align = "center", children }) {
  return (
    <Reveal className={`section-head is-${align}`}>
      {kicker && <p className="kicker">{kicker}</p>}
      {title && <h2 className="title">{title}</h2>}
      {children && <p className="sub">{children}</p>}
    </Reveal>
  );
}
