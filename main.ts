// WORLD NEWS — 19 NOVEMBER 2026, in one image. Version 2.
//
// A Node 22 program, standard library only, no network. It renders
// entry.png (1024 x 1024) procedurally: a pure-JS PNG encoder, an embedded
// 5x7 bitmap font, and flat vector drawing (rects, lines, circles, flags,
// globe, skyline). Every fact in the image was researched from reporting
// dated 19 November 2026 (Reuters, BBC, AP, IAEA, UN climate talks, and
// others — full citations in BUILD_LOG.md) and is baked into the STORIES
// table below, so the two runs the grader makes are byte-identical by
// construction: no clock, no randomness, no I/O besides the single output
// file. v2 is a full rewrite of v1: 19 stories instead of 6, in a dense
// 3 x 6 grid grouped by region and field, every headline short enough to
// read at 300 px across.
//
// Run:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { deflateSync } from 'node:zlib';

// ---------------------------------------------------------------- PNG out

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

function encodePNG(w, h, rgb) {
  const raw = Buffer.alloc(h * (1 + w * 3));
  for (let y = 0; y < h; y++) {
    raw[y * (1 + w * 3)] = 0; // filter: none
    raw.set(rgb.subarray(y * w * 3, (y + 1) * w * 3), y * (1 + w * 3) + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: RGB
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

// ------------------------------------------------------------ framebuffer

const W = 1024;
const H = 1024;
const fb = new Uint8Array(W * H * 3);

function px(x, y, c) {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 3;
  fb[i] = c[0]; fb[i + 1] = c[1]; fb[i + 2] = c[2];
}

function fillRect(x, y, w, h, c) {
  const x0 = Math.max(0, x), y0 = Math.max(0, y);
  const x1 = Math.min(W, x + w), y1 = Math.min(H, y + h);
  for (let yy = y0; yy < y1; yy++) {
    for (let xx = x0; xx < x1; xx++) {
      const i = (yy * W + xx) * 3;
      fb[i] = c[0]; fb[i + 1] = c[1]; fb[i + 2] = c[2];
    }
  }
}

function rectBorder(x, y, w, h, t, c) {
  fillRect(x, y, w, t, c);
  fillRect(x, y + h - t, w, t, c);
  fillRect(x, y, t, h, c);
  fillRect(x + w - t, y, t, h, c);
}

function hline(x0, x1, y, c) {
  for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) px(x, y, c);
}

function vline(x, y0, y1, c) {
  for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) px(x, y, c);
}

function line(x0, y0, x1, y1, c) {
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx + dy, x = x0, y = y0;
  for (;;) {
    px(x, y, c);
    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x += sx; }
    if (e2 <= dx) { err += dx; y += sy; }
  }
}

function fillCircle(cx, cy, r, c) {
  for (let y = -r; y <= r; y++) {
    const half = Math.floor(Math.sqrt(r * r - y * y));
    for (let x = -half; x <= half; x++) px(cx + x, cy + y, c);
  }
}

function circle(cx, cy, r, c) {
  for (let a = 0; a < 360; a += 2) {
    const rad = (a * Math.PI) / 180;
    px(Math.round(cx + r * Math.cos(rad)), Math.round(cy + r * Math.sin(rad)), c);
  }
}

function ellipse(cx, cy, rx, ry, c) {
  for (let a = 0; a < 360; a += 2) {
    const rad = (a * Math.PI) / 180;
    px(Math.round(cx + rx * Math.cos(rad)), Math.round(cy + ry * Math.sin(rad)), c);
  }
}

// Colours
const CREAM = [246, 239, 221];
const PAPER = [255, 253, 245];
const NAVY = [20, 38, 63];
const NAVY2 = [31, 78, 121];
const RED = [179, 38, 30];
const GOLD = [201, 162, 39];
const TEAL = [15, 118, 110];
const GREEN = [34, 120, 62];
const ORANGE = [200, 90, 20];
const PURPLE = [90, 60, 140];
const INK = [24, 24, 24];
const WHITE = [255, 255, 255];
const SKY = [183, 211, 232];
const GREY = [110, 110, 105];

// ------------------------------------------------------- 5x7 bitmap font
// Each glyph: 7 rows, 5 bits each (bit 4 = leftmost pixel). Text is set in
// capitals; lowercase input is upper-cased by drawText.

const FONT = {
  'A': [0x0e, 0x11, 0x11, 0x1f, 0x11, 0x11, 0x11],
  'B': [0x1e, 0x11, 0x11, 0x1e, 0x11, 0x11, 0x1e],
  'C': [0x0e, 0x11, 0x10, 0x10, 0x10, 0x11, 0x0e],
  'D': [0x1e, 0x11, 0x11, 0x11, 0x11, 0x11, 0x1e],
  'E': [0x1f, 0x10, 0x10, 0x1e, 0x10, 0x10, 0x1f],
  'F': [0x1f, 0x10, 0x10, 0x1e, 0x10, 0x10, 0x10],
  'G': [0x0e, 0x11, 0x10, 0x17, 0x11, 0x11, 0x0f],
  'H': [0x11, 0x11, 0x11, 0x1f, 0x11, 0x11, 0x11],
  'I': [0x0e, 0x04, 0x04, 0x04, 0x04, 0x04, 0x0e],
  'J': [0x07, 0x02, 0x02, 0x02, 0x02, 0x12, 0x0c],
  'K': [0x11, 0x12, 0x14, 0x18, 0x14, 0x12, 0x11],
  'L': [0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x1f],
  'M': [0x11, 0x1b, 0x15, 0x15, 0x11, 0x11, 0x11],
  'N': [0x11, 0x19, 0x15, 0x13, 0x11, 0x11, 0x11],
  'O': [0x0e, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0e],
  'P': [0x1e, 0x11, 0x11, 0x1e, 0x10, 0x10, 0x10],
  'Q': [0x0e, 0x11, 0x11, 0x11, 0x15, 0x12, 0x0d],
  'R': [0x1e, 0x11, 0x11, 0x1e, 0x14, 0x12, 0x11],
  'S': [0x0f, 0x10, 0x10, 0x0e, 0x01, 0x01, 0x1e],
  'T': [0x1f, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04],
  'U': [0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0e],
  'V': [0x11, 0x11, 0x11, 0x11, 0x11, 0x0a, 0x04],
  'W': [0x11, 0x11, 0x11, 0x15, 0x15, 0x15, 0x0a],
  'X': [0x11, 0x11, 0x0a, 0x04, 0x0a, 0x11, 0x11],
  'Y': [0x11, 0x11, 0x0a, 0x04, 0x04, 0x04, 0x04],
  'Z': [0x1f, 0x01, 0x02, 0x04, 0x08, 0x10, 0x1f],
  '0': [0x0e, 0x11, 0x13, 0x15, 0x19, 0x11, 0x0e],
  '1': [0x04, 0x0c, 0x04, 0x04, 0x04, 0x04, 0x0e],
  '2': [0x0e, 0x11, 0x01, 0x06, 0x08, 0x10, 0x1f],
  '3': [0x1f, 0x02, 0x04, 0x02, 0x01, 0x11, 0x0e],
  '4': [0x02, 0x06, 0x0a, 0x12, 0x1f, 0x02, 0x02],
  '5': [0x1f, 0x10, 0x1e, 0x01, 0x01, 0x11, 0x0e],
  '6': [0x06, 0x08, 0x10, 0x1e, 0x11, 0x11, 0x0e],
  '7': [0x1f, 0x01, 0x02, 0x04, 0x08, 0x08, 0x08],
  '8': [0x0e, 0x11, 0x11, 0x0e, 0x11, 0x11, 0x0e],
  '9': [0x0e, 0x11, 0x11, 0x0f, 0x01, 0x02, 0x0c],
  ' ': [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
  '.': [0x00, 0x00, 0x00, 0x00, 0x00, 0x0c, 0x0c],
  ',': [0x00, 0x00, 0x00, 0x00, 0x0c, 0x04, 0x08],
  ':': [0x00, 0x0c, 0x0c, 0x00, 0x0c, 0x0c, 0x00],
  ';': [0x00, 0x0c, 0x0c, 0x00, 0x0c, 0x04, 0x08],
  "'": [0x04, 0x04, 0x08, 0x00, 0x00, 0x00, 0x00],
  '"': [0x0a, 0x0a, 0x0a, 0x00, 0x00, 0x00, 0x00],
  '!': [0x04, 0x04, 0x04, 0x04, 0x04, 0x00, 0x04],
  '?': [0x0e, 0x11, 0x01, 0x06, 0x04, 0x00, 0x04],
  '-': [0x00, 0x00, 0x00, 0x0e, 0x00, 0x00, 0x00],
  '—': [0x00, 0x00, 0x00, 0x1f, 0x00, 0x00, 0x00],
  '(': [0x02, 0x04, 0x08, 0x08, 0x08, 0x04, 0x02],
  ')': [0x08, 0x04, 0x02, 0x02, 0x02, 0x04, 0x08],
  '/': [0x01, 0x02, 0x02, 0x04, 0x08, 0x08, 0x10],
  '%': [0x19, 0x1a, 0x02, 0x04, 0x08, 0x0b, 0x13],
  '$': [0x04, 0x0f, 0x14, 0x0e, 0x05, 0x1e, 0x04],
  '&': [0x0c, 0x12, 0x14, 0x08, 0x15, 0x12, 0x0d],
  '+': [0x00, 0x04, 0x04, 0x0e, 0x04, 0x04, 0x00],
  '=': [0x00, 0x00, 0x1f, 0x00, 0x1f, 0x00, 0x00],
  '*': [0x00, 0x15, 0x0e, 0x15, 0x00, 0x00, 0x00],
  '#': [0x0a, 0x0a, 0x1f, 0x0a, 0x1f, 0x0a, 0x0a],
  '@': [0x0e, 0x11, 0x17, 0x15, 0x16, 0x10, 0x0e],
  '•': [0x00, 0x04, 0x0e, 0x0e, 0x0e, 0x04, 0x00],
  '·': [0x00, 0x00, 0x0c, 0x0c, 0x00, 0x00, 0x00],
  '>': [0x10, 0x08, 0x04, 0x02, 0x04, 0x08, 0x10],
  '<': [0x02, 0x04, 0x08, 0x10, 0x08, 0x04, 0x02],
  '_': [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x1f],
};

function normalise(s) {
  return s.toUpperCase().replace(/[’‘]/g, "'").replace(/[–]/g, '-');
}

function textWidth(s, scale) {
  const t = normalise(s);
  return t.length === 0 ? 0 : t.length * 6 * scale - scale;
}

function drawChar(ch, x, y, scale, c) {
  const g = FONT[ch] || FONT['?'];
  for (let r = 0; r < 7; r++) {
    for (let col = 0; col < 5; col++) {
      if ((g[r] >> (4 - col)) & 1) fillRect(x + col * scale, y + r * scale, scale, scale, c);
    }
  }
}

function drawText(s, x, y, scale, c) {
  const t = normalise(s);
  for (let i = 0; i < t.length; i++) drawChar(t[i], x + i * 6 * scale, y, scale, c);
}

function drawTextRight(s, xRight, y, scale, c) {
  drawText(s, xRight - textWidth(s, scale), y, scale, c);
}

function wrapText(s, scale, maxW) {
  const words = normalise(s).split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const trial = cur === '' ? w : cur + ' ' + w;
    if (textWidth(trial, scale) <= maxW || cur === '') cur = trial;
    else { lines.push(cur); cur = w; }
  }
  if (cur !== '') lines.push(cur);
  return lines;
}

function drawLines(lines, x, y, scale, c, lineH) {
  for (let i = 0; i < lines.length; i++) drawText(lines[i], x, y + i * lineH, scale, c);
}

// ------------------------------------------------------------- the day's news
// Researched 19 Nov 2026 from reporting dated that day. Full outlet + date
// citations for every story live in BUILD_LOG.md. Summary of sources:
//  lead: BBC, Reuters, CBS — first three-way Trump/Xi/Putin summit, APEC.
//  1: ICJ / BBC — Rohingya genocide judgment due 10:00, The Hague.
//  2: Reuters / BBC — Crimean Bridge, third attack in a week.
//  3: Reuters — Iran fires on US sites in Kuwait and Bahrain.
//  4: UN climate talks — COP31 ministers, draft final text, Antalya.
//  5: Reuters / CNBC — Anthropic $81.3bn IPO, trades as ANT at $83.
//  6: USA Today / Le Monde / Rockstar — GTA VI launches, PS5 and Xbox.
//  7: Reuters / AP / IAEA — Yongbyon uranium enrichment expansion.
//  8: Reuters — Fiji declares national disaster, El Nino drought.
//  9: AP — Pakistan kills 22 militants near the Afghan border.
//  10: Reuters — oil refinery blast in Cepu, Java, one worker killed.
//  11: Reuters — migrant boat capsizes off Senegal, dozens missing.
//  12: Reuters — Trump raised ex-Nvidia boss Huang with Xi, briefly.
//  13: BBC — UK gives Ukraine 1,000 long-range drones, £260m package.
//  14: BBC — Uganda landslide survivors seek justice at the UN.
//  15: IMD / The Hindu BusinessLine — Cyclone Akvan, 80,000 evacuated.
//  16: Euronews / Reuters — Odesa strikes, four killed, 13 hurt.
//  17: BBC — Ash Barty into the Tennis Hall of Fame.
//  18: The Guardian — IPCC report delay threatens climate effort.
//  footer: Reuters — Indonesia asset-forfeiture law; Australia, Canada,
//  Italy and the UK urge aid access to flooded Gaza.

// Each cell: [tag, headline (max 2 lines), one-line summary, accent].
// Headlines are kept to 32 characters, summaries to 24, so at scale 3 / 2
// nothing wraps past its allotted lines; the code throws if it ever does.
const STORIES = [
  ['THE HAGUE · ICJ', 'WORLD COURT ROHINGYA CASE', 'RULING ON 2017 CRACKDOWN', TEAL],
  ['KERCH · REUTERS', 'CRIMEAN BRIDGE HIT AGAIN', 'THIRD ATTACK IN A WEEK', NAVY2],
  ['THE GULF · REUTERS', 'IRAN FIRES BACK AT US', 'US SITES HIT IN THE GULF', ORANGE],
  ['ANTALYA · UNFCCC', 'COP31 MINISTERS RACE', 'FINAL TEXT TALKS GO ON', GREEN],
  ['NEW YORK · MARKETS', "ANTHROPIC'S RECORD IPO", '$81.3BN, TRADES AS ANT', PURPLE],
  ['WORLD · CULTURE', 'GTA VI LAUNCHES TODAY', 'OUT ON PS5 AND XBOX', RED],
  ['YONGBYON · IAEA', 'KIM EXPANDS NUCLEAR PLANT', 'IAEA WARNS OF NEW BUILD', NAVY2],
  ['FIJI · REUTERS', 'FIJI DECLARES DISASTER', 'DROUGHT DRIES UP WATER', TEAL],
  ['PAKISTAN · AP', '22 MILITANTS KILLED', 'RAIDS NEAR AFGHAN BORDER', ORANGE],
  ['JAVA · REUTERS', 'REFINERY BLAST KILLS ONE', 'FIRE AT CEPU PLANT', RED],
  ['SENEGAL · REUTERS', 'MIGRANT BOAT CAPSIZES', 'DOZENS MISSING OFF DAKAR', NAVY2],
  ['SHENZHEN · REUTERS', 'TRUMP TALKS AI WITH XI', 'EX-NVIDIA BOSS DISCUSSED', PURPLE],
  ['LONDON · BBC', 'UK SENDS UKRAINE DRONES', '1000 DRONES, 260M POUNDS', GREEN],
  ['UGANDA · BBC', 'LANDSLIDE SURVIVORS', 'SEEK JUSTICE AT THE UN', TEAL],
  ['ODISHA · IMD', 'CYCLONE AKVAN NEARS', '80,000 EVACUATED', ORANGE],
  ['ODESA · EURONEWS', 'ODESA HIT THREE TIMES', 'FOUR KILLED, 13 HURT', RED],
  ['SPORT · BBC', 'ASH BARTY HONOURED', 'TENNIS HALL OF FAME', GREEN],
  ['CLIMATE · GUARDIAN', 'IPCC REPORT DELAYED', 'CLIMATE EFFORT AT RISK', PURPLE],
];

// ------------------------------------------------------- lead illustration

function drawFlagUS(x, y, w, h) {
  fillRect(x, y, w, h, WHITE);
  const stripe = Math.max(2, Math.round(h / 13));
  for (let i = 0; i < 13; i += 2) fillRect(x, y + i * stripe, w, stripe, RED);
  fillRect(x, y, Math.round(w * 0.4), Math.round(h * 0.54), NAVY2);
  for (let r = 0; r < 4; r++) {
    for (let col = 0; col < 5; col++) {
      fillRect(x + 4 + col * 6, y + 4 + r * 6, 2, 2, WHITE);
    }
  }
  rectBorder(x, y, w, h, 2, NAVY);
}

function drawFlagCN(x, y, w, h) {
  fillRect(x, y, w, h, RED);
  fillCircle(x + Math.round(w * 0.28), y + Math.round(h * 0.32), 8, GOLD);
  fillCircle(x + Math.round(w * 0.62), y + Math.round(h * 0.2), 3, GOLD);
  fillCircle(x + Math.round(w * 0.74), y + Math.round(h * 0.38), 3, GOLD);
  fillCircle(x + Math.round(w * 0.72), y + Math.round(h * 0.6), 3, GOLD);
  fillCircle(x + Math.round(w * 0.58), y + Math.round(h * 0.72), 3, GOLD);
  rectBorder(x, y, w, h, 2, NAVY);
}

function drawFlagRU(x, y, w, h) {
  fillRect(x, y, w, h, WHITE);
  fillRect(x, y + Math.round(h / 3), w, Math.round(h / 3), NAVY2);
  fillRect(x, y + Math.round(2 * h / 3), w, h - Math.round(2 * h / 3), RED);
  rectBorder(x, y, w, h, 2, NAVY);
}

function drawLeadArt(x, y, w, h) {
  // Sky, three flags, globe, skyline.
  fillRect(x, y, w, h, SKY);
  const fw = 84, fh = 52, gap = 10;
  const fx = x + Math.round((w - (3 * fw + 2 * gap)) / 2);
  drawFlagUS(fx, y + 8, fw, fh);
  drawFlagCN(fx + fw + gap, y + 8, fw, fh);
  drawFlagRU(fx + 2 * (fw + gap), y + 8, fw, fh);
  // Globe.
  const cx = x + Math.round(w / 2), cy = y + 104;
  fillCircle(cx, cy, 36, NAVY2);
  circle(cx, cy, 36, NAVY);
  ellipse(cx, cy, 36, 14, WHITE);
  ellipse(cx, cy, 14, 36, WHITE);
  hline(cx - 36, cx + 36, cy, WHITE);
  fillCircle(cx - 12, cy - 8, 4, GOLD);
  fillCircle(cx + 15, cy + 7, 4, GOLD);
  // Skyline.
  const base = y + h;
  const tops = [18, 28, 22, 34, 20, 30, 16];
  for (let i = 0; i < 7; i++) {
    const bw = Math.floor(w / 7);
    fillRect(x + i * bw + 2, base - tops[i], bw - 4, tops[i], NAVY);
    fillRect(x + i * bw + 6, base - tops[i] + 5, 3, 3, GOLD);
    fillRect(x + i * bw + 12, base - tops[i] + 11, 3, 3, GOLD);
  }
  rectBorder(x, y, w, h, 3, NAVY);
}

// ------------------------------------------------------------------ layout

function drawCell(x, y, w, h, tag, headline, summary, accent) {
  fillRect(x, y, w, h, PAPER);
  fillRect(x, y, w, 6, accent);
  rectBorder(x, y, w, h, 2, NAVY);
  drawText(tag, x + 12, y + 11, 2, accent);
  const hl = wrapText(headline, 3, w - 24);
  if (hl.length > 2) throw new Error('headline over 2 lines: ' + headline);
  drawLines(hl, x + 12, y + 30, 3, NAVY, 24);
  const sl = wrapText(summary, 2, w - 24);
  if (sl.length > 1) throw new Error('summary over 1 line: ' + summary);
  drawLines(sl, x + 12, y + 80, 2, INK, 16);
}

function draw() {
  fillRect(0, 0, W, H, CREAM);

  // Masthead.
  fillRect(0, 0, W, 100, NAVY);
  fillRect(0, 100, W, 8, RED);
  drawText('WORLD NEWS', 24, 24, 7, WHITE);
  drawText('19 STORIES · FIVE CONTINENTS', 24, 78, 3, GOLD);
  drawTextRight('19 NOVEMBER 2026', 1000, 24, 5, WHITE);
  drawTextRight('THURSDAY', 1000, 66, 3, GOLD);

  // Lead story.
  fillRect(24, 112, 976, 184, PAPER);
  rectBorder(24, 112, 976, 184, 3, NAVY);
  drawLeadArt(40, 128, 280, 152);
  drawText('LEAD STORY · SHENZHEN · BBC', 344, 126, 3, RED);
  const leadHead = wrapText('TRUMP, XI AND PUTIN HOLD FIRST THREE-WAY SUMMIT', 4, 640);
  if (leadHead.length > 2) throw new Error('lead headline over 2 lines');
  drawLines(leadHead, 344, 152, 4, NAVY, 38);
  const leadSum = wrapText('UKRAINE, IRAN AND NUCLEAR ARMS ARE ON THE AGENDA.', 3, 640);
  if (leadSum.length > 2) throw new Error('lead summary over 2 lines');
  drawLines(leadSum, 344, 226, 3, INK, 22);
  drawText('SOURCES: BBC · REUTERS · CBS', 344, 276, 2, GREY);

  // Story grid: 3 columns x 6 rows, 18 cells.
  const cols = [24, 353, 682];
  const rows = [308, 414, 520, 626, 732, 838];
  for (let i = 0; i < STORIES.length; i++) {
    const [tag, headline, summary, accent] = STORIES[i];
    drawCell(cols[i % 3], rows[Math.floor(i / 3)], 317, 96, tag, headline, summary, accent);
  }

  // Footer ticker.
  fillRect(0, 944, W, 80, NAVY);
  drawText('ALSO TODAY: INDONESIA PASSES ASSET-FORFEITURE LAW', 40, 956, 3, WHITE);
  drawText('FOUR NATIONS URGE AID ACCESS TO FLOODED GAZA', 40, 982, 3, GOLD);
}

// ---------------------------------------------------------------------- main

draw();
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const png = encodePNG(W, H, fb);
writeFileSync(join(outDir, 'entry.png'), png);
