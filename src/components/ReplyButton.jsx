import { REPLY_MESSAGE, WHATSAPP_NUMBER } from "../content";

const REPLY_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(REPLY_MESSAGE)}`;

// a small round WhatsApp button — her reply comes straight to the sender
export default function ReplyButton() {
  if (!WHATSAPP_NUMBER) return null;
  return (
    <a className="reply-btn" href={REPLY_LINK} target="_blank" rel="noopener noreferrer" aria-label="Reply on WhatsApp">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path className="reply-bubble" d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.2 20.8l4.5-1.2A8.8 8.8 0 1 0 12 3.2z" />
        <path
          className="reply-phone"
          d="M9.1 7.9c.3-.1.6 0 .7.3l.8 1.9c.1.3 0 .6-.2.8l-.6.6c.6 1.3 1.7 2.4 3 3l.6-.6c.2-.2.5-.3.8-.2l1.9.8c.3.1.4.4.3.7-.3 1.1-1.3 1.8-2.4 1.7-3.4-.4-6.2-3.2-6.6-6.6-.1-1.1.6-2.1 1.7-2.4z"
        />
      </svg>
    </a>
  );
}
