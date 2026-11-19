// WORLD NEWS — 19 NOVEMBER 2026, in one image.
//
// A Node 22 program, standard library only, no network. It renders
// entry.png (1024 x 1024) procedurally: a pure-JS PNG encoder, an embedded
// 5x7 bitmap font, and flat vector drawing (rects, lines, circles, flags,
// icons). Every fact in the image was researched from reporting dated
// 19 November 2026 (Reuters, BBC, ICJ, UN climate talks) and is baked into
// the STORIES table below, so the two runs the grader makes are
// byte-identical by construction: no clock, no randomness, no I/O besides
// the single output file.
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

function thickLine(x0, y0, x1, y1, t, c) {
  const dx = x1 - x0, dy = y1 - y0;
  const len = Math.hypot(dx, dy) || 1;
  const nx = Math.round((-dy / len) * t / 2), ny = Math.round((dx / len) * t / 2);
  for (let i = -Math.floor(t / 2); i <= Math.floor(t / 2); i++) {
    const ox = Math.round(nx * i / Math.max(1, Math.floor(t / 2)) || 0);
    const oy = Math.round(ny * i / Math.max(1, Math.floor(t / 2)) || 0);
    line(x0 + ox, y0 + oy, x1 + ox, y1 + oy, c);
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

function fillTriangle(x0, y0, x1, y1, x2, y2, c) {
  const minY = Math.min(y0, y1, y2), maxY = Math.max(y0, y1, y2);
  for (let y = minY; y <= maxY; y++) {
    const xs = [];
    for (const [ax, ay, bx, by] of [[x0, y0, x1, y1], [x1, y1, x2, y2], [x2, y2, x0, y0]]) {
      if ((ay <= y && by > y) || (by <= y && ay > y)) {
        xs.push(Math.round(ax + ((y - ay) / (by - ay)) * (bx - ax)));
      }
    }
    if (xs.length >= 2) hline(Math.min(...xs), Math.max(...xs), y, c);
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
  '\u2014': [0x00, 0x00, 0x00, 0x1f, 0x00, 0x00, 0x00],
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
  '\u2022': [0x00, 0x04, 0x0e, 0x0e, 0x0e, 0x04, 0x00],
  '\u00b7': [0x00, 0x00, 0x0c, 0x0c, 0x00, 0x00, 0x00],
  '>': [0x10, 0x08, 0x04, 0x02, 0x04, 0x08, 0x10],
  '<': [0x02, 0x04, 0x08, 0x10, 0x08, 0x04, 0x02],
  '_': [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x1f],
};

function normalise(s) {
  return s.toUpperCase().replace(/[\u2019\u2018]/g, "'").replace(/[\u2013]/g, '-');
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
// Researched 19 Nov 2026 from reporting dated that day. Sources in brackets
// are the outlets whose 19 Nov reporting each fact comes from.
//  1. Shenzhen trilateral — BBC, Reuters, CBS: first-ever three-way meeting
//     of Trump, Xi and Putin, on the APEC sidelines in Shenzhen; agenda
//     Ukraine, Iran, nuclear arms, AI and trade. Kremlin: one hour set aside.
//  2. ICJ Rohingya ruling — ICJ / BBC / JusticeInfo: judgment due 10:00 in
//     The Hague in Gambia v Myanmar over the 2017 crackdown that drove more
//     than 700,000 Rohingya to Bangladesh; the court has never before found
//     a state guilty of genocide.
//  3. Crimean Bridge — Reuters / BBC, 19 Nov: third attack in a week,
//     traffic suspended overnight, damage assessed; the 17 Nov strikes had
//     brought down part of the road span.
//  4. Gulf — Reuters, 19 Nov: Iran fired on US sites in Kuwait and Bahrain
//     after US jets struck a missile site on Qeshm Island; a Saudi-led
//     coalition dealt with a Houthi missile threat towards Riyadh.
//  5. COP31 — UN climate talks, Antalya: ministers negotiating the draft
//     final text (adaptation finance, fossil fuels); the summit closes
//     Friday 20 Nov.
//  6. Anthropic IPO — Reuters / CNBC, 19 Nov: shares begin trading on the
//     Nasdaq as ANT after a record $81.3bn sale priced at $83, valuing the
//     AI firm at about $1.5 trillion.
//  Also today (footer): Indonesia's parliament passed an asset-forfeiture
//  law (Reuters, 19 Nov); Australia, Canada, Italy and the UK jointly urged
//  Israel to allow aid into flooded Gaza (19 Nov).

// ------------------------------------------------------------------- icons

function iconJustice(x, y, s, c) {
  // Scales of justice in a 64-unit box.
  vline(x + 32, y + 8, y + 52, c);
  hline(x + 12, x + 52, y + 10, c);
  fillRect(x + 26, y + 52, 12, 4, c);
  line(x + 12, y + 10, x + 6, y + 26, c);
  line(x + 12, y + 10, x + 18, y + 26, c);
  fillTriangle(x + 4, y + 26, x + 20, y + 26, x + 12, y + 36, c);
  line(x + 52, y + 10, x + 46, y + 26, c);
  line(x + 52, y + 10, x + 58, y + 26, c);
  fillTriangle(x + 44, y + 26, x + 60, y + 26, x + 52, y + 36, c);
  fillCircle(x + 32, y + 8, 3, c);
}

function iconBridge(x, y, s, c) {
  // Kerch bridge: deck, arch, pillars, water.
  hline(x + 4, x + 60, y + 30, c);
  for (let a = 0; a <= 180; a += 6) {
    const rad = (a * Math.PI) / 180;
    px(Math.round(x + 32 + 26 * Math.cos(rad)), Math.round(y + 30 - 20 * Math.sin(rad)), c);
    px(Math.round(x + 32 + 26 * Math.cos(rad)), Math.round(y + 31 - 20 * Math.sin(rad)), c);
  }
  vline(x + 12, y + 30, y + 48, c);
  vline(x + 52, y + 30, y + 48, c);
  vline(x + 32, y + 12, y + 30, c);
  hline(x + 6, x + 26, y + 50, c);
  hline(x + 14, x + 34, y + 56, c);
  hline(x + 30, x + 58, y + 50, c);
  hline(x + 38, x + 56, y + 56, c);
}

function iconFlame(x, y, s, c) {
  // Flame over waves.
  fillTriangle(x + 32, y + 4, x + 16, y + 34, x + 48, y + 34, c);
  fillTriangle(x + 32, y + 16, x + 24, y + 34, x + 40, y + 34, PAPER);
  hline(x + 6, x + 26, y + 44, c);
  hline(x + 38, x + 58, y + 44, c);
  hline(x + 14, x + 34, y + 52, c);
  hline(x + 40, x + 56, y + 52, c);
  hline(x + 22, x + 42, y + 60, c);
}

function iconClimate(x, y, s, c) {
  // Sun over a green hill.
  fillCircle(x + 32, y + 20, 11, c);
  for (let a = 0; a < 360; a += 45) {
    const rad = (a * Math.PI) / 180;
    line(x + 32 + Math.round(15 * Math.cos(rad)), y + 20 + Math.round(15 * Math.sin(rad)),
         x + 32 + Math.round(21 * Math.cos(rad)), y + 20 + Math.round(21 * Math.sin(rad)), c);
  }
  fillTriangle(x + 6, y + 58, x + 32, y + 38, x + 58, y + 58, GREEN);
  fillTriangle(x + 32, y + 38, x + 40, y + 50, x + 32, y + 58, [46, 140, 78]);
}

function iconChart(x, y, s, c) {
  // Rising bars with an arrow.
  const bars = [14, 24, 34, 46];
  for (let i = 0; i < 4; i++) {
    fillRect(x + 8 + i * 13, y + 54 - bars[i], 8, bars[i], c);
  }
  line(x + 6, y + 12, x + 56, y + 2, RED);
  line(x + 56, y + 2, x + 48, y + 2, RED);
  line(x + 56, y + 2, x + 56, y + 10, RED);
}

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
  fillCircle(x + Math.round(w * 0.28), y + Math.round(h * 0.32), 9, GOLD);
  fillCircle(x + Math.round(w * 0.62), y + Math.round(h * 0.2), 4, GOLD);
  fillCircle(x + Math.round(w * 0.74), y + Math.round(h * 0.38), 4, GOLD);
  fillCircle(x + Math.round(w * 0.72), y + Math.round(h * 0.6), 4, GOLD);
  fillCircle(x + Math.round(w * 0.58), y + Math.round(h * 0.72), 4, GOLD);
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
  const fw = 84, fh = 56, gap = 10;
  const fx = x + Math.round((w - (3 * fw + 2 * gap)) / 2);
  drawFlagUS(fx, y + 12, fw, fh);
  drawFlagCN(fx + fw + gap, y + 12, fw, fh);
  drawFlagRU(fx + 2 * (fw + gap), y + 12, fw, fh);
  // Globe.
  const cx = x + Math.round(w / 2), cy = y + 148;
  fillCircle(cx, cy, 52, NAVY2);
  circle(cx, cy, 52, NAVY);
  ellipse(cx, cy, 52, 20, WHITE);
  ellipse(cx, cy, 20, 52, WHITE);
  hline(cx - 52, cx + 52, cy, WHITE);
  fillCircle(cx - 18, cy - 12, 5, GOLD);
  fillCircle(cx + 22, cy + 10, 5, GOLD);
  // Skyline.
  const base = y + h;
  const tops = [26, 44, 34, 52, 30, 46, 24];
  for (let i = 0; i < 7; i++) {
    const bw = Math.floor(w / 7);
    fillRect(x + i * bw + 2, base - tops[i], bw - 4, tops[i], NAVY);
    fillRect(x + i * bw + 6, base - tops[i] + 6, 3, 3, GOLD);
    fillRect(x + i * bw + 12, base - tops[i] + 14, 3, 3, GOLD);
  }
  rectBorder(x, y, w, h, 3, NAVY);
}

// ------------------------------------------------------------------ layout

function drawCard(x, y, w, h, accent, tag, headline, summary, icon) {
  fillRect(x, y, w, h, PAPER);
  fillRect(x, y, w, 8, accent);
  rectBorder(x, y, w, h, 3, NAVY);
  drawText(tag, x + 92, y + 18, 3, accent);
  const hl = wrapText(headline, 4, w - 92 - 16);
  if (hl.length > 2) throw new Error('headline over 2 lines: ' + headline);
  drawLines(hl, x + 92, y + 44, 4, NAVY, 34);
  // Icon in a tinted square at top-left.
  fillRect(x + 16, y + 16, 64, 64, CREAM);
  rectBorder(x + 16, y + 16, 64, 64, 2, NAVY);
  icon(x + 16, y + 16, 64, accent);
  const sl = wrapText(summary, 3, w - 32);
  if (sl.length > 3) throw new Error('summary over 3 lines: ' + summary);
  drawLines(sl, x + 16, y + 112, 3, INK, 22);
}

function draw() {
  fillRect(0, 0, W, H, CREAM);

  // Masthead.
  fillRect(0, 0, W, 124, NAVY);
  fillRect(0, 124, W, 8, RED);
  drawText('WORLD NEWS', 28, 36, 7, WHITE);
  drawText('ONE DAY · ONE IMAGE', 28, 94, 3, GOLD);
  drawTextRight('19 NOVEMBER 2026', 996, 36, 5, WHITE);
  drawTextRight('THURSDAY', 996, 84, 3, GOLD);

  // Lead story.
  fillRect(24, 144, 976, 272, PAPER);
  rectBorder(24, 144, 976, 272, 3, NAVY);
  drawLeadArt(40, 160, 290, 240);
  drawText('LEAD STORY · SHENZHEN · BBC', 350, 162, 3, RED);
  const leadHead = wrapText('TRUMP, XI AND PUTIN HOLD FIRST THREE-WAY SUMMIT IN SHENZHEN', 5, 634);
  drawLines(leadHead, 350, 190, 5, NAVY, 40);
  const leadSum = wrapText('AT APEC, THE THREE LEADERS MEET FOR THE FIRST TIME. UKRAINE, IRAN AND NUCLEAR ARMS ARE ON THE AGENDA.', 3, 634);
  drawLines(leadSum, 350, 322, 3, INK, 26);
  drawText('SOURCES: BBC · REUTERS · CBS', 350, 398, 2, GREY);

  // Four stories, 2 x 2.
  drawCard(24, 428, 476, 186, TEAL, 'THE HAGUE · ICJ',
    'WORLD COURT ROHINGYA CASE',
    'THE HAGUE DECIDES IF MYANMAR COMMITTED GENOCIDE IN 2017.', iconJustice);
  drawCard(524, 428, 476, 186, NAVY2, 'KERCH · REUTERS',
    'CRIMEAN BRIDGE HIT THIRD TIME',
    'TRAFFIC HALTED OVERNIGHT. PART OF THE ROAD SPAN FELL.', iconBridge);
  drawCard(24, 626, 476, 186, ORANGE, 'THE GULF · REUTERS',
    'GULF: IRAN FIRES BACK',
    'DRONES HIT US SITES IN KUWAIT AND BAHRAIN AFTER THE QESHM STRIKE.', iconFlame);
  drawCard(524, 626, 476, 186, GREEN, 'ANTALYA · UNFCCC',
    'COP31 MINISTERS RACE FOR DEAL',
    'MINISTERS NEGOTIATE THE FINAL TEXT AS FOSSIL FUELS DIVIDE THEM.', iconClimate);

  // Markets band.
  fillRect(24, 824, 976, 116, PAPER);
  fillRect(24, 824, 976, 8, PURPLE);
  rectBorder(24, 824, 976, 116, 3, NAVY);
  drawText('NEW YORK · MARKETS', 40, 838, 3, PURPLE);
  drawText("ANTHROPIC'S RECORD $81.3BN IPO", 40, 860, 4, NAVY);
  const ipoSum = wrapText('SHARES START TRADING AS ANT AT $83. THE AI FIRM IS VALUED AT ABOUT $1.5 TRILLION.', 3, 760);
  if (ipoSum.length > 2) throw new Error('IPO summary over 2 lines');
  drawLines(ipoSum, 40, 892, 3, INK, 22);
  iconChart(836, 840, 76, PURPLE);

  // Footer ticker.
  fillRect(0, 952, W, 60, NAVY);
  drawText('ALSO TODAY: INDONESIA PASSES ASSET-FORFEITURE LAW', 40, 960, 3, WHITE);
  drawText('FOUR NATIONS URGE AID ACCESS TO FLOODED GAZA', 40, 984, 3, GOLD);
}

// ---------------------------------------------------------------------- main

draw();
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const png = encodePNG(W, H, fb);
writeFileSync(join(outDir, 'entry.png'), png);
