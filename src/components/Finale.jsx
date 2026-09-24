import { useRef, useState } from "react";
import { AGE, FRIEND_NAME } from "../content";
import { burst } from "../confetti";
import { splitTrailingEmoji } from "../utils";
import Reveal from "./Reveal";

export default function Finale() {
  const [clicked, setClicked] = useState(false);
  const buttonRef = useRef(null);
  const [name, emoji] = splitTrailingEmoji(FRIEND_NAME);

  const celebrate = () => {
    setClicked(true);
    const box = buttonRef.current.getBoundingClientRect();
    burst({ x: box.left + box.width / 2, y: box.top + box.height / 2, count: 170, spread: 100, power: 17 });
    setTimeout(() => {
      burst({ x: 0, y: window.innerHeight, angle: -58, spread: 36, count: 90, power: 22 });
      burst({ x: window.innerWidth, y: window.innerHeight, angle: -122, spread: 36, count: 90, power: 22 });
    }, 280);
  };

  return (
    <section id="finale" className="section finale">
      <Reveal className="container finale-inner">
        <div className="finale-cake" aria-hidden="true">
          🎂
        </div>
        <p className="eyebrow">For an amazing person</p>
        <h2 className="finale-title">
          <span className="text-gradient">Happy Happy Birthday,</span>
          <span className="finale-name">
            <span className="text-shimmer">{name}</span>
            {emoji && (
              <span className="finale-emoji" aria-hidden="true">
                {emoji}
              </span>
            )}
          </span>
        </h2>
        <p className="finale-text">
          The stars aligned on the day you were born. The universe exhaled.
          <br />
          And the world became a little more magical because you&apos;re in it❤️.
        </p>
        <button
          ref={buttonRef}
          type="button"
          className={`btn btn-primary btn-xl${clicked ? "" : " is-inviting"}`}
          onClick={celebrate}
        >
          {clicked ? `🎊 Happy ${AGE} !! 🎊` : "✨ Ya Mwisho bas ✨"}
        </button>
        {clicked && <p className="finale-note">You are so endlessly loved 💜</p>}
      </Reveal>
    </section>
  );
}
