// Draws the default app icon: a marquee sign with a bulb border and a center
// star, in neutral navy/gold. Deliberately not tied to any one school's
// colors (see src/theme/schools.ts) — swapping in a real school-themed icon
// later means dropping in a new PNG here and rebuilding, not changing this
// script. No image library, just raw PNG bytes.
const zlib = require('zlib'), fs = require('fs');
const N = 1024, px = Buffer.alloc(N * N * 3);
const set = (x, y, [r, g, b]) => { if (x < 0 || x >= N || y < 0 || y >= N) return; const i = (y * N + x) * 3; px[i] = r; px[i + 1] = g; px[i + 2] = b; };
const fillRect = (x0, y0, x1, y1, c) => { for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) set(x, y, c); };
const fillCircle = (cx, cy, r, c) => { for (let y = Math.floor(cy - r); y < cy + r; y++) for (let x = Math.floor(cx - r); x < cx + r; x++) if ((x - cx) ** 2 + (y - cy) ** 2 < r * r) set(x, y, c); };

function fillRoundedRect(x0, y0, x1, y1, r, c) {
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const inTopLeft = x < x0 + r && y < y0 + r && (x - (x0 + r)) ** 2 + (y - (y0 + r)) ** 2 > r * r;
      const inTopRight = x >= x1 - r && y < y0 + r && (x - (x1 - r)) ** 2 + (y - (y0 + r)) ** 2 > r * r;
      const inBotLeft = x < x0 + r && y >= y1 - r && (x - (x0 + r)) ** 2 + (y - (y1 - r)) ** 2 > r * r;
      const inBotRight = x >= x1 - r && y >= y1 - r && (x - (x1 - r)) ** 2 + (y - (y1 - r)) ** 2 > r * r;
      if (inTopLeft || inTopRight || inBotLeft || inBotRight) continue;
      set(x, y, c);
    }
  }
}

function fillPolygon(points, c) {
  const ys = points.map((p) => p[1]);
  const yMin = Math.floor(Math.min(...ys)), yMax = Math.ceil(Math.max(...ys));
  for (let y = yMin; y <= yMax; y++) {
    const xs = [];
    for (let i = 0; i < points.length; i++) {
      const [x1, y1] = points[i], [x2, y2] = points[(i + 1) % points.length];
      if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y)) {
        xs.push(x1 + ((y - y1) / (y2 - y1)) * (x2 - x1));
      }
    }
    xs.sort((a, b) => a - b);
    for (let i = 0; i < xs.length; i += 2) {
      for (let x = Math.round(xs[i]); x < Math.round(xs[i + 1] ?? xs[i]); x++) set(x, y, c);
    }
  }
}

function star(cx, cy, outerR, innerR, points) {
  const verts = [];
  for (let i = 0; i < points * 2; i++) {
    const angle = -Math.PI / 2 + (i * Math.PI) / points;
    const r = i % 2 === 0 ? outerR : innerR;
    verts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  return verts;
}

const bg = [20, 22, 28];
const panel = [24, 42, 66];
const gold = [228, 178, 48];

fillRect(0, 0, N, N, bg);

// Outer border (gold), inner panel (navy) painted on top to leave a frame.
const bx0 = 110, by0 = 260, bx1 = 914, by1 = 760, br = 72;
fillRoundedRect(bx0, by0, bx1, by1, br, gold);
fillRoundedRect(bx0 + 16, by0 + 16, bx1 - 16, by1 - 16, br - 12, panel);

// Marquee bulbs along the top and bottom edges of the frame.
const bulbR = 15;
const bulbCount = 11;
for (let i = 0; i < bulbCount; i++) {
  const t = i / (bulbCount - 1);
  const x = bx0 + 70 + t * (bx1 - bx0 - 140);
  fillCircle(x, by0 + 2, bulbR, gold);
  fillCircle(x, by1 - 2, bulbR, gold);
}

// Center star.
fillPolygon(star(512, 512, 170, 68, 5), gold);

const raw = Buffer.alloc((N * 3 + 1) * N);
for (let y = 0; y < N; y++) { raw[y * (N * 3 + 1)] = 0; px.copy(raw, y * (N * 3 + 1) + 1, y * N * 3, (y + 1) * N * 3); }
const crcTable = (() => { const t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc = (b) => { let r = 0xffffffff; for (const x of b) r = crcTable[(r ^ x) & 255] ^ (r >>> 8); return (r ^ 0xffffffff) >>> 0; };
const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(N, 0); ihdr.writeUInt32BE(N, 4); ihdr[8] = 8; ihdr[9] = 2;
fs.mkdirSync('assets', { recursive: true });
fs.writeFileSync('assets/icon.png', Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]));
console.log('Wrote assets/icon.png');
