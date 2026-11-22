// Draws the default app icon: a generic pennant flag on a pole. Deliberately
// not tied to any one school's colors (see src/theme/schools.ts) — swapping
// in a real school-themed icon later means dropping in a new PNG here and
// rebuilding, not changing this script. No image library, just raw PNG bytes.
const zlib = require('zlib'), fs = require('fs');
const N = 1024, px = Buffer.alloc(N * N * 3);
const set = (x, y, [r, g, b]) => { if (x < 0 || x >= N || y < 0 || y >= N) return; const i = (y * N + x) * 3; px[i] = r; px[i + 1] = g; px[i + 2] = b; };
const fillRect = (x0, y0, x1, y1, c) => { for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) set(x, y, c); };

const bg = [31, 35, 45];
const pole = [214, 217, 222];
const flag = [212, 160, 23];
const flagShadow = [179, 131, 14];

fillRect(0, 0, N, N, bg);

// Pole: vertical bar left-of-center.
const poleX = 360, poleW = 26, poleTop = 170, poleBot = 880;
fillRect(poleX, poleTop, poleX + poleW, poleBot, pole);
// Finial ball.
for (let y = poleTop - 46; y < poleTop + 10; y++) {
  for (let x = poleX - 28; x < poleX + poleW + 28; x++) {
    const cx = poleX + poleW / 2, cy = poleTop - 18;
    if ((x - cx) ** 2 + (y - cy) ** 2 < 32 * 32) set(x, y, pole);
  }
}

// Triangular pennant flag pointing right, attached near the top of the pole.
const flagTopY = 230, flagBotY = 430, flagLeftX = poleX + poleW, flagTipX = 860;
for (let y = flagTopY; y < flagBotY; y++) {
  const mid = (flagTopY + flagBotY) / 2;
  const t = 1 - Math.abs(y - mid) / (mid - flagTopY); // 0 at edges, 1 at middle
  const rightEdge = flagLeftX + t * (flagTipX - flagLeftX);
  for (let x = flagLeftX; x < rightEdge; x++) {
    const shade = x > rightEdge - 18 ? flagShadow : flag;
    set(x, y, shade);
  }
}

const raw = Buffer.alloc((N * 3 + 1) * N);
for (let y = 0; y < N; y++) { raw[y * (N * 3 + 1)] = 0; px.copy(raw, y * (N * 3 + 1) + 1, y * N * 3, (y + 1) * N * 3); }
const crcTable = (() => { const t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc = (b) => { let r = 0xffffffff; for (const x of b) r = crcTable[(r ^ x) & 255] ^ (r >>> 8); return (r ^ 0xffffffff) >>> 0; };
const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(N, 0); ihdr.writeUInt32BE(N, 4); ihdr[8] = 8; ihdr[9] = 2;
fs.mkdirSync('assets', { recursive: true });
fs.writeFileSync('assets/icon.png', Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]));
console.log('Wrote assets/icon.png');
