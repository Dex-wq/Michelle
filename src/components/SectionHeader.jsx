import { Fragment } from "react";
import Reveal from "./Reveal";

// A handwritten kicker over a bold serif title — alignment varies by section.
// The kicker writes itself in, then the title rises word by word.
export default function SectionHeader({ kicker, title, align = "center", children }) {
  return (
    <Reveal className={`section-head is-${align}`}>
      {kicker && <p className="kicker">{kicker}</p>}
      {title && (
        <h2 className="title">
          {title.split(" ").map((word, i) => (
            <Fragment key={i}>
              {i > 0 && " "}
              <span className="word">
                <span style={{ "--w": i }}>{word}</span>
              </span>
            </Fragment>
          ))}
        </h2>
      )}
      {children && <p className="sub">{children}</p>}
    </Reveal>
  );
}
