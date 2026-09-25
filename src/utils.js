const TRAILING_EMOJI = /(?:\p{Extended_Pictographic}|\p{Emoji_Modifier}|️|‍|\s)+$/u;

// "Michelle💜" → ["Michelle", "💜"], so gradient text doesn't swallow the emoji
export function splitTrailingEmoji(text = "") {
  const match = text.match(TRAILING_EMOJI);
  if (!match || !/\p{Extended_Pictographic}/u.test(match[0])) return [text, ""];
  return [text.slice(0, match.index).trimEnd(), match[0].trim()];
}

// 21 → "21st", 22 → "22nd", 13 → "13th"
export function ordinal(n) {
  const suffix = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${suffix[(v - 20) % 10] || suffix[v] || suffix[0]}`;
}

// 64px radial glow used by the canvas scenes — drawing a sprite is far cheaper than shadowBlur
export function glowSprite(hex, size = 64) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const half = size / 2;
  const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.14, `rgba(${r},${g},${b},1)`);
  grad.addColorStop(0.42, `rgba(${r},${g},${b},0.28)`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return canvas;
}
