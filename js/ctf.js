/* The flag hunt: 10 pieces hidden around the page. Players paste the whole flag into the
   keygen's License Key. Three kinds of pieces:
   - text pieces (scrambled in config.js), revealed by playing with the page
   - DevTools pieces (a DOM comment, the console, Local Storage)
   - picture pieces: stored only as pixels, never as text, so view-source / Ctrl+F can't find
     them. The 3D scene draws them (voxel letters, writing on the smiley's head, 1998-only ink).
   The whole flag is checked against a SHA-256 hash, so the flag itself is not in the source. */
(function () {
  const EPU = window.EPU;
  const C = window.SITE.ctf || { key: 'x', parts: [], where: {} };
  const STORE = 'epu.ctf.found';
  const xor = (s, key) => [...s].map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))).join('');

  // compact SHA-256 (hex) so the check also works where crypto.subtle is unavailable
  function sha256(str) {
    const K = new Uint32Array([
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
      0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
      0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
      0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ]);
    const H = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]);
    const msg = new TextEncoder().encode(str);
    const blocks = (msg.length + 9 + 63) >> 6;
    const buf = new Uint8Array(blocks * 64);
    buf.set(msg);
    buf[msg.length] = 0x80;
    const dv = new DataView(buf.buffer);
    dv.setUint32(buf.length - 8, Math.floor((msg.length * 8) / 2 ** 32));
    dv.setUint32(buf.length - 4, (msg.length * 8) >>> 0);
    const W = new Uint32Array(64);
    const r = (x, n) => (x >>> n) | (x << (32 - n));
    for (let blk = 0; blk < blocks; blk++) {
      for (let i = 0; i < 16; i++) W[i] = dv.getUint32(blk * 64 + i * 4);
      for (let i = 16; i < 64; i++) {
        const s0 = r(W[i - 15], 7) ^ r(W[i - 15], 18) ^ (W[i - 15] >>> 3);
        const s1 = r(W[i - 2], 17) ^ r(W[i - 2], 19) ^ (W[i - 2] >>> 10);
        W[i] = W[i - 16] + s0 + W[i - 7] + s1;
      }
      let [a, b, c, d, e, f, g, h] = H;
      for (let i = 0; i < 64; i++) {
        const t1 = (h + (r(e, 6) ^ r(e, 11) ^ r(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + W[i]) >>> 0;
        const t2 = ((r(a, 2) ^ r(a, 13) ^ r(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) >>> 0;
        h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
      }
      H[0] += a; H[1] += b; H[2] += c; H[3] += d; H[4] += e; H[5] += f; H[6] += g; H[7] += h;
    }
    return [...H].map((x) => x.toString(16).padStart(8, '0')).join('');
  }

  const ctf = (EPU.ctf = {
    parts: C.parts.map((p) => {
      if (p == null) return null; // picture piece
      try {
        return xor(atob(p), C.key);
      } catch (e) {
        return '?';
      }
    }),
    pictures: {},
    where: C.where || {},
    found: new Set(),
    solved: false,
    sha256
  });
  ctf.total = ctf.parts.length;
  ctf.check = (s) => !!C.hash && sha256(s.trim()) === C.hash;

  // picture pieces: base64 bitmaps → 0/1 arrays
  for (const n in C.pictures || {}) {
    const p = C.pictures[n];
    const raw = atob(p.bits);
    const bits = new Uint8Array(p.w * p.h);
    for (let i = 0; i < bits.length; i++) bits[i] = (raw.charCodeAt(i >> 3) >> (7 - (i & 7))) & 1;
    ctf.pictures[n] = { w: p.w, h: p.h, bits };
  }
  ctf.picture = (place) => ctf.pictures[ctf.where[place]];
  ctf.isPicture = (n) => ctf.parts[n - 1] == null;

  /* For whoever updates config.js. In the browser console:
       EPU.ctf.encode(["ECSC{", "piece2", …], { 2: 5, 6: 4, 7: 4 })
     The second argument lists the picture pieces as { pieceNumber: charactersPerRow }.
     It prints the new `ctf` values to paste into config.js. Pieces must be plain ASCII. */
  ctf.encode = (pieces, pictures = {}) => {
    const out = { key: C.key, parts: [], pictures: {}, hash: sha256(pieces.join('')), where: ctf.where };
    pieces.forEach((p, i) => {
      if (pictures[i + 1]) {
        out.parts.push(null);
        out.pictures[i + 1] = rasterize(p, pictures[i + 1]);
      } else out.parts.push(btoa(xor(p, C.key)));
    });
    console.log(JSON.stringify(out, null, 2));
    return out;
  };
  function rasterize(text, perRow) {
    const rows = [];
    for (let i = 0; i < text.length; i += perRow) rows.push(text.slice(i, i + perRow));
    const w = Math.max(...rows.map((row) => row.length)) * 8, h = rows.length * 9 - 1;
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const x = c.getContext('2d');
    x.fillStyle = '#fff';
    x.font = '8px "Press Start 2P"';
    x.textBaseline = 'top';
    rows.forEach((row, i) => x.fillText(row, 0, i * 9));
    const d = x.getImageData(0, 0, w, h).data;
    const bytes = new Uint8Array(Math.ceil((w * h) / 8));
    for (let i = 0; i < w * h; i++) if (d[i * 4 + 3] > 127) bytes[i >> 3] |= 128 >> (i & 7);
    return { w, h, bits: btoa(String.fromCharCode(...bytes)) };
  }

  // progress survives a reload (per visitor, this browser only)
  try {
    JSON.parse(localStorage.getItem(STORE) || '[]').forEach((n) => ctf.found.add(n));
    ctf.solved = localStorage.getItem(STORE + '.solved') === '1';
  } catch (e) { /* storage blocked: progress just isn't remembered */ }
  const save = () => {
    try {
      localStorage.setItem(STORE, JSON.stringify([...ctf.found]));
      if (ctf.solved) localStorage.setItem(STORE + '.solved', '1');
    } catch (e) { /* ignore */ }
  };

  // reveal the piece hidden at `place` (a key of ctf.where)
  ctf.reveal = (place) => {
    const n = ctf.where[place];
    if (!n || n > ctf.total || ctf.found.has(n)) return;
    ctf.found.add(n);
    save();
    EPU.emit('ctf:update', n);
    EPU.emit('ctf:found', n);
  };
  ctf.solve = () => {
    if (ctf.solved) return;
    ctf.solved = true;
    for (let n = 1; n <= ctf.total; n++) ctf.found.add(n);
    save();
    EPU.emit('ctf:update');
    EPU.emit('ctf:solved');
  };

  // DevTools-only pieces. Nothing on screen can notice them being found,
  // so their keygen slot stays dark until the whole flag is entered.
  ctf.plant = () => {
    const put = (place, fn) => {
      const n = ctf.where[place];
      if (n && n <= ctf.total && ctf.parts[n - 1]) fn(n, ctf.parts[n - 1]);
    };
    put('dom', (n, p) => {
      const row = document.querySelector('.kg-row.key');
      if (row) row.parentNode.insertBefore(document.createComment(` flag ${n}/${ctf.total}: ${p} `), row);
    });
    put('console', (n, p) => console.log(`%c ☠ flag ${n}/${ctf.total} → ${p} `, 'font: 14px monospace; color: #000; background: #ffe14f; padding: 4px'));
    put('storage', (n, p) => {
      try {
        localStorage.setItem(`flag_${n}_of_${ctf.total}`, p);
      } catch (e) { /* ignore */ }
    });
  };

  // things happening on the page (the picture pieces are revealed by the 3D scene itself)
  EPU.on('stars:all', () => ctf.reveal('stars'));
  EPU.on('risen', (on) => on && ctf.reveal('risen'));
  EPU.on('sticker:peeled', () => ctf.reveal('sticker'));
})();
