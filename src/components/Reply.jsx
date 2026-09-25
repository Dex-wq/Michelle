import { PS_NOTE, REPLY_MESSAGE, WHATSAPP_NUMBER } from "../content";
import Reveal from "./Reveal";

const REPLY_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(REPLY_MESSAGE)}`;

// a postcard p.s. — and a way to write back
export default function Reply() {
  return (
    <section id="reply" className="section reply-section">
      <div className="container narrow">
        <Reveal className="reveal-pin ps-pin">
          <div className="ps-card">
            <span className="tape tape-pink ps-tape" aria-hidden="true" />
            <span className="ps-stamp" aria-hidden="true">
              <b>♡</b>
              <small>21</small>
            </span>
            <p className="ps-kicker">p.s.</p>
            <p className="ps-text">{PS_NOTE.text}</p>
            <p className="ps-sign">— {PS_NOTE.sign}</p>
          </div>
        </Reveal>
        {WHATSAPP_NUMBER && (
          <Reveal className="reply-actions" delay={250}>
            <a className="btn btn-pink btn-lg is-inviting" href={REPLY_LINK} target="_blank" rel="noopener noreferrer">
              💬 Write back to me
            </a>
            <p className="reply-note">it opens WhatsApp, straight to me</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
