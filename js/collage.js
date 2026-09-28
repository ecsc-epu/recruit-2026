(function () {
  const EPU = window.EPU;
  const S = window.SITE;
  const { $, $$, svg, esc, clamp, rng } = EPU.util;

  const BOARDS = { land: { w: 1600, h: 900 }, port: { w: 900, h: 1600 } };
  const SEAM_ART = { land: 560, port: 300 };
  const SEAM_Y = { land: 352, port: 876 };
  const SEAM_TILT = 0.06;

  const stage = $('#stage');
  const ui = (EPU.ui = {});
  let zTop = 20;

  function build() {
    const ctf = EPU.ctf;
    const underN = ctf.where.sticker;
    stage.innerHTML = `
      <h1 class="piece p-title">
        <svg class="poster" aria-hidden="true"></svg>
        <span class="sr">${esc(S.club)}: ${esc(S.recruit.big)} ${esc(S.recruit.small)}</span>
      </h1>
      <div class="piece p-date"><svg class="poster" aria-hidden="true"></svg><span class="sr">${esc(S.dateLine)}</span></div>

      <div class="piece p-pirate drag">${pirateSVG()}</div>
      <div class="piece p-bubble" aria-live="polite"><p id="bubbleText"></p></div>

      <div class="piece p-jcard drag">
        <div class="jc-head"><b>${esc(S.short)}</b><span>MIXTAPE VOL.2 · 2026</span><i>C-60</i></div>
        <div class="jc-cols">
          <div><h2>SIDE A · TRACKS</h2><ol class="jc-tracks">${S.tracks
            .map((t, i) => `<li data-i="${i}"><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t">${esc(t.name)}</span><span class="m">${esc(t.time || '')}</span></li>`)
            .join('')}</ol></div>
          <div><h2>SIDE B · DATES</h2><ul class="jc-dates">${S.dates
            .map((d) => `<li><span class="n">${esc(d.d)}</span><span class="t">${esc(d.t)}</span></li>`)
            .join('')}</ul></div>
        </div>
        <div class="jc-foot"><span>★ <b id="jcCount">0/${S.tracks.length}</b></span><span>DOLBY B NR · HI-BIAS</span></div>
      </div>

      <div class="piece p-recruit"><svg class="poster" aria-hidden="true"></svg></div>

      <section class="piece p-keygen win" aria-label="Đăng ký">
        <div class="win-title">
          <span class="wi">💾</span><span class="wt">${esc(S.keygen.title)}</span>
          <span class="wb"><i data-w="min" title="minimize">_</i><i data-w="max" title="maximize">□</i><i data-w="close" title="close">×</i></span>
        </div>
        <div class="kg-body">
          <div class="kg-banner">
            <canvas class="kg-plasma" width="96" height="30"></canvas>
            ${S.photo ? `<img class="kg-photo" src="${esc(S.photo)}" alt="">` : ''}
            <canvas class="kg-scope" width="240" height="56"></canvas>
            <span class="kg-logo">keygen</span>
            <span class="kg-crack">${esc(S.keygen.credit)}</span>
          </div>
          <label class="kg-row"><span>${esc(S.keygen.nameLabel)}</span><input id="kgName" autocomplete="name" spellcheck="false" maxlength="40" placeholder="${esc(S.keygen.namePlaceholder)}"></label>
          <label class="kg-row"><span>${esc(S.keygen.idLabel)}</span><input id="kgId" autocomplete="off" spellcheck="false" maxlength="20" placeholder="${esc(S.keygen.idPlaceholder)}"></label>
          <label class="kg-row"><span>${esc(S.keygen.emailLabel)}</span><input id="kgMail" type="email" inputmode="email" autocomplete="email" spellcheck="false" maxlength="80" placeholder="${esc(S.keygen.emailPlaceholder)}"></label>
          <label class="kg-row"><span>${esc(S.keygen.phoneLabel)}</span><input id="kgPhone" type="tel" inputmode="tel" autocomplete="tel" maxlength="20" placeholder="${esc(S.keygen.phonePlaceholder)}"></label>
          <label class="kg-row"><span>${esc(S.keygen.trackLabel)}</span><select id="kgTrack"><option value="">${esc(S.keygen.trackPlaceholder)}</option>${S.form.tracks.map((t) => `<option>${esc(t)}</option>`).join('')}</select></label>
          <label class="kg-row key"><span>${esc(S.keygen.keyLabel)}</span><input id="kgKey" autocomplete="off" spellcheck="false" maxlength="160" placeholder="${esc(S.keygen.keyPlaceholder)}"></label>
          <div class="kg-parts" role="group" aria-label="flag pieces">${Array.from({ length: ctf.total }, (_, i) => `<i data-n="${i + 1}">${i + 1}</i>`).join('')}<b id="kgPartsN"></b></div>
          <div class="kg-foot">
            <button class="kg-go" id="kgGo">${esc(S.keygen.button)}</button>
            <p class="kg-status" id="kgStatus">Input System ID!</p>
          </div>
          <p class="kg-meta">TRIAL EXPIRES IN <b id="kgTrial">--</b></p>
          <p class="kg-links">${S.links.map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join(' · ')}</p>
          <p class="kg-credit">♪ ${esc(S.music.artist)} · ${esc(S.music.title)}</p>
        </div>
      </section>

      ${underN ? `<div class="piece p-under" aria-hidden="true"><b>${underN}/${ctf.total}</b><span>${esc(ctf.parts[underN - 1])}</span></div>` : ''}
      <div class="piece p-splat1 drag"><svg class="splat" viewBox="0 0 220 160" aria-label="${esc(S.stickers.splat1.join(' '))}"></svg></div>
      <div class="piece p-splat2 drag"><svg class="splat" viewBox="0 0 170 130" aria-label="${esc(S.stickers.splat2.join(' '))}"></svg></div>
      <div class="piece p-vhs drag">${
        S.logo ? `<img src="${esc(S.logo)}" alt="${esc(S.short)} logo">` : `<b>${esc(S.stickers.vhs[0])}</b><span>${esc(S.stickers.vhs[1])}</span>`
      }</div>
      <div class="piece p-advisory drag"><b>${esc(S.stickers.advisory[0])}</b><strong>${esc(S.stickers.advisory[1])}</strong><b>${esc(S.stickers.advisory[2])}</b></div>
    `;

    let top = $('#stage-top');
    if (!top) {
      top = document.createElement('div');
      top.id = 'stage-top';
      document.body.appendChild(top);
    }
    top.appendChild($('.p-bubble'));

    splat($('.p-splat1 svg'), 11, 220, 160, S.stickers.splat1, 'splat-a');
    splat($('.p-splat2 svg'), 5, 170, 130, S.stickers.splat2, 'splat-b');
    $('#ghost').innerHTML = Array.from({ length: 6 }, () => `<div>${esc(S.ghost).repeat(3)}</div>`).join('');

    $$('.piece.drag').forEach((p) => draggable(p, p));
    draggable($('.p-keygen'), $('.p-keygen .win-title'));

    pirate();
    keygen();
    tracks();
    seamHandle();
  }

  function pirateSVG() {
    return `<svg viewBox="0 0 280 350" class="pirate" aria-label="MS Paint pirate">
      <g filter="url(#fSticker)">
        <g class="pir-sword">
          <path d="M84 186 L42 230" class="ln"/>
          <path d="M46 226 L6 300 L18 306 L56 234 Z" fill="#000"/>
          <path d="M28 216 L66 246" class="ln" stroke-width="9"/>
        </g>
        <g class="pir-hook">
          <path d="M196 182 L232 132" class="ln"/>
          <path d="M232 132 C 262 112, 262 72, 234 64" class="ln" stroke-width="9" fill="none"/>
        </g>
        <path d="M100 150 L180 150 L212 176 L196 198 L182 188 L184 248 L96 248 L98 188 L84 198 L68 176 Z" fill="#000"/>
        <g class="pir-skull">
          <circle cx="140" cy="194" r="14" fill="#ff7ad9"/>
          <rect x="132" y="202" width="16" height="10" rx="2" fill="#ff7ad9"/>
          <circle cx="135" cy="193" r="3.4" fill="#000"/><circle cx="145" cy="193" r="3.4" fill="#000"/>
          <path d="M118 214 L162 234 M162 214 L118 234" stroke="#ff7ad9" stroke-width="5" stroke-linecap="round"/>
        </g>
        <path d="M96 248 L184 248 L190 288 L146 288 L140 268 L134 288 L90 288 Z" fill="#d9b8ff" class="ln" stroke-width="5"/>
        <path d="M112 288 L104 320 M168 288 L178 320" class="ln"/>
        <ellipse cx="96" cy="330" rx="26" ry="12" fill="#fff" class="ln" stroke-width="6"/>
        <ellipse cx="188" cy="330" rx="26" ry="12" fill="#fff" class="ln" stroke-width="6"/>
        <g class="pir-head">
          <circle cx="140" cy="104" r="44" fill="#fff" class="ln"/>
          <path d="M96 84 L184 116" class="ln" stroke-width="5"/>
          <circle cx="122" cy="98" r="12" fill="#000"/>
          <circle cx="158" cy="97" r="5.5" fill="#000"/>
          <path d="M116 120 Q140 144 166 118" class="ln" fill="none"/>
          <path d="M62 80 C 80 22, 200 22, 218 80 C 190 64, 90 64, 62 80 Z" fill="#000"/>
          <path d="M100 52 C 110 10, 170 10, 180 52 Z" fill="#000"/>
          <path d="M132 36 l8 -8 l8 8 l-8 8 Z" fill="#fff"/>
        </g>
      </g>
    </svg>`;
  }

  function pirate() {
    const P = S.pirate;
    const ctf = EPU.ctf;
    const p = $('.p-pirate');
    const txt = $('#bubbleText');
    const bubble = $('.p-bubble');
    const order = Object.keys(ctf.where).sort((a, b) => ctf.where[a] - ctf.where[b]);
    const about = [...P.about, P.schedule.replace('{dates}', S.dates.map((d) => `${d.d} ${d.t}`).join(' · '))];
    let typing = 0, hintI = 0, aboutI = 0, streak = 0;
    ui.talked = false;

    const hop = () => {
      p.classList.remove('hop');
      void p.offsetWidth;
      p.classList.add('hop');
    };
    const say = (line) => {
      clearInterval(typing);
      bubble.classList.add('on');
      txt.textContent = '';
      const chars = [...line];
      let k = 0;
      typing = setInterval(() => {
        txt.textContent += chars[k] || '';
        if (k % 3 === 0 && chars[k] !== ' ') EPU.audio.sfx('talk');
        if (++k >= chars.length) clearInterval(typing);
      }, 22);
    };
    const fill = (t, n) => t.replace(/\{n\}/g, n).replace(/\{total\}/g, ctf.total).replace(/\{part\}/g, ctf.parts[n - 1] || '');
    ui.fill = fill;

    ui.say = (line) => {
      hop();
      say(line);
    };
    ui.sayIntro = () => say(P.intro);

    p.addEventListener('tap', () => {
      ui.talked = true;
      hop();
      if (ctf.where.pirate && !ctf.found.has(ctf.where.pirate)) return ctf.reveal('pirate');
      if (streak >= 2) {
        streak = 0;
        return say(about[aboutI++ % about.length]);
      }
      streak++;
      const missing = order.filter((k) => !ctf.found.has(ctf.where[k]) && P.hints[k]);
      if (ctf.solved || !missing.length) return say(ctf.solved ? P.solved : P.allFound);
      say(P.hints[missing[hintI++ % missing.length]]);
    });
    EPU.on('ctf:found', (n) => ui.say(fill(ctf.isPicture(n) ? P.foundPicture : P.found, n)));
    EPU.on('ctf:solved', () => ui.say(P.solved));
  }

  function splat(root, seed, w, h, lines, cls) {
    const r = rng(seed);
    const cx = w / 2, cy = h / 2, R = Math.min(w, h * 1.3) * 0.36;
    const n = 30;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      let rr = R * (0.84 + r() * 0.2);
      if (r() < 0.25) rr = R * (1.15 + r() * 0.4);
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.74]);
    }
    const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    let d = `M${mid(pts[n - 1], pts[0]).map((v) => v.toFixed(1)).join(' ')}`;
    for (let i = 0; i < n; i++) {
      const m = mid(pts[i], pts[(i + 1) % n]);
      d += ` Q${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)}`;
    }
    root.classList.add(cls);
    root.appendChild(svg('path', { d: d + 'Z', class: 'splat-body' }));
    for (let i = 0; i < 9; i++) {
      const a = r() * Math.PI * 2;
      const rr = R * (1.3 + r() * 0.5);
      root.appendChild(svg('circle', { cx: cx + Math.cos(a) * rr, cy: cy + Math.sin(a) * rr * 0.74, r: 1.5 + r() * 5, class: 'splat-body' }));
    }
    const g = svg('g', { class: 'splat-text' });
    root.appendChild(g);
    root._fit = () => {
      g.innerHTML = '';
      const boxW = R * 1.55;
      fitLines(g, lines.map((t, i) => ({ text: t, font: i === 1 && cls === 'splat-a' ? 'Nosifer' : 'Anton' })), cx - boxW / 2, cy - R * 0.55, boxW, R * 1.1, 0.12);
    };
  }

  const mctx = document.createElement('canvas').getContext('2d');
  function measure(text, font) {
    mctx.font = `100px ${font}`;
    const m = mctx.measureText(text);
    return { l: m.actualBoundingBoxLeft, r: m.actualBoundingBoxRight, a: m.actualBoundingBoxAscent, d: m.actualBoundingBoxDescent };
  }

  function fitLines(g, lines, bx, by, bw, bh, gapRatio = 0.08) {
    const ms = lines.map((ln) => ({ ...ln, m: measure(ln.text, ln.font) }));
    let ks = ms.map((ln) => bw / (ln.m.l + ln.m.r));
    const gap = bh * gapRatio;
    const total = ms.reduce((a, ln, i) => a + (ln.m.a + ln.m.d) * ks[i], 0) + gap * (ms.length - 1);
    const shrink = Math.min(1, bh / total);
    ks = ks.map((k) => k * shrink);
    let y = by + (bh - total * shrink) / 2;
    return ms.map((ln, i) => {
      const k = ks[i];
      const w = (ln.m.l + ln.m.r) * k;
      const x = bx + (bw - w) / 2 + ln.m.l * k;
      const base = y + ln.m.a * k;
      const t = svg('text', { x: x.toFixed(1), y: base.toFixed(1), 'font-size': (100 * k).toFixed(2), 'font-family': ln.font, class: ln.cls || '' });
      t.textContent = ln.text;
      g.appendChild(t);
      y += (ln.m.a + ln.m.d) * k + gap * shrink;
      return { ...ln, k, x, base, w };
    });
  }

  function lettersDrips(g, line, count, seed, scale = 1) {
    const r = rng(seed);
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    const m = line.m;
    const pad = 4;
    c.width = Math.ceil(m.l + m.r) + pad * 2;
    c.height = Math.ceil(m.a + m.d) + pad * 2;
    ctx.font = `100px ${line.font}`;
    ctx.fillText(line.text, m.l + pad, m.a + pad);
    const data = ctx.getImageData(0, Math.round(m.a + pad - 4), c.width, 1).data;
    const runs = [];
    let start = -1;
    for (let x = 0; x <= c.width; x++) {
      const ink = x < c.width && data[x * 4 + 3] > 140;
      if (ink && start < 0) start = x;
      if (!ink && start >= 0) {
        if (x - start > 5) runs.push([start, x]);
        start = -1;
      }
    }
    for (let i = 0; i < count && runs.length; i++) {
      const [a, b] = runs.splice(Math.floor(r() * runs.length), 1)[0];
      const px = a + (b - a) * (0.3 + r() * 0.4);
      const x = line.x + (px - m.l - pad) * line.k;
      const w = Math.min((b - a) * 0.55, 13) * line.k * scale;
      g.appendChild(drip(x, line.base - 5 * line.k, w, (18 + r() * 55) * line.k * scale));
    }
  }

  function drip(x, y, w, len) {
    const d = svg('g', { class: 'drip' });
    const hw = w / 2;
    d.appendChild(svg('path', { d: `M${x - hw} ${y} V${y + len} A${hw} ${hw} 0 0 0 ${x + hw} ${y + len} V${y} Z` }));
    d.appendChild(svg('circle', { cx: x, cy: y + len + hw * 0.2, r: hw * 1.25 }));
    return d;
  }

  function fitPosters() {
    const L = EPU.layout;
    const pieces = [
      ['.p-title', (g, w, h) => fitLines(g, (S.title[L.mode] || S.title[L.mode === 'port' ? 'portrait' : 'landscape']).map((t) => ({ text: t, font: 'Anton' })), 0, 0, w, h, 0.05)],
      ['.p-date', (g, w, h) => fitLines(g, [{ text: S.dateLine, font: 'Anton' }], 0, 0, w, h)],
      ['.p-recruit', (g, w, h) => {
        const lines = fitLines(g, [{ text: S.recruit.big, font: 'Anton', cls: 'big' }, { text: S.recruit.small, font: 'Anton', cls: 'small' }], 0, 0, w, h * 0.78, 0.07);
        const back = svg('g', { class: 'drips' }), front = svg('g', { class: 'drips' });
        g.insertBefore(back, g.querySelectorAll('text')[1]);
        g.appendChild(front);
        lettersDrips(back, lines[0], 9, 3);
        lettersDrips(front, lines[1], 5, 9, 0.8);
      }]
    ];
    for (const [sel, fn] of pieces) {
      const p = $(sel);
      const s = $('svg.poster', p);
      const w = p.offsetWidth, h = p.offsetHeight;
      s.setAttribute('viewBox', `0 0 ${w} ${h}`);
      s.innerHTML = '';
      const g = svg('g');
      s.appendChild(g);
      fn(g, w, h);
    }
    $$('svg.splat').forEach((s) => s._fit && s._fit());
  }

  function buildBlood() {
    const b = $('#blood');
    const W = innerWidth;
    const s = EPU.layout.s;
    const H = Math.ceil(240 * s);
    b.setAttribute('viewBox', `0 0 ${W} ${H}`);
    b.style.height = H + 'px';
    b.innerHTML = '';
    const r = rng(42);
    const band = 9 * s;
    let d = `M0 0 H${W} V${band}`;
    for (let x = W; x > 0; x -= 14 * s) d += ` L${x.toFixed(1)} ${(band + r() * 5 * s).toFixed(1)}`;
    b.appendChild(svg('path', { d: d + ` L0 ${band} Z`, fill: 'url(#gBlood)' }));
    const g = svg('g', { class: 'drips top' });
    b.appendChild(g);
    const longOnes = [];
    for (let x = 6 * s; x < W; x += (22 + r() * 70) * s) {
      const long = r() < 0.18;
      const w = (5 + r() * 12) * s;
      const len = (long ? 70 + r() * 150 : 6 + r() * 40) * s;
      g.appendChild(drip(x, band - 2, w, len));
      if (long) longOnes.push([x, band + len, w]);
    }
    $('#drops').innerHTML = longOnes
      .filter((_, i) => i % 2 === 0)
      .slice(0, 5)
      .map(([x, y, w], i) => `<i style="left:${(x - w * 0.45).toFixed(1)}px;top:${y.toFixed(1)}px;width:${(w * 0.9).toFixed(1)}px;height:${(w * 1.25).toFixed(1)}px;animation-duration:${(6 + r() * 6).toFixed(1)}s;animation-delay:${(i * 1.7 + r() * 2).toFixed(1)}s"></i>`)
      .join('');
  }

  function draggable(piece, handle) {
    handle.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      if (e.target.closest('input, button, a, [data-w]')) return;
      e.preventDefault();
      const s = EPU.layout.s;
      const sx = e.clientX, sy = e.clientY;
      const ox = piece.offsetLeft, oy = piece.offsetTop;
      let moved = false, lastX = sx;
      piece.style.zIndex = ++zTop;
      handle.setPointerCapture(e.pointerId);
      const move = (ev) => {
        const dx = (ev.clientX - sx) / s, dy = (ev.clientY - sy) / s;
        if (!moved && Math.hypot(dx, dy) > 5) {
          moved = true;
          piece.classList.add('dragging');
        }
        if (!moved) return;
        const L = EPU.layout;
        piece.style.left = clamp(ox + dx, -piece.offsetWidth * 0.6, L.AW - piece.offsetWidth * 0.4) + 'px';
        piece.style.top = clamp(oy + dy, -piece.offsetHeight * 0.3, L.AH - piece.offsetHeight * 0.3) + 'px';
        piece.style.setProperty('--tilt', clamp((ev.clientX - lastX) * 0.9, -14, 14).toFixed(1) + 'deg');
        lastX = ev.clientX;
      };
      const up = () => {
        handle.removeEventListener('pointermove', move);
        handle.removeEventListener('pointerup', up);
        handle.removeEventListener('pointercancel', up);
        piece.classList.remove('dragging');
        piece.style.setProperty('--tilt', '0deg');
        if (!moved) return piece.dispatchEvent(new CustomEvent('tap'));
        piece.classList.remove('slap');
        void piece.offsetWidth;
        piece.classList.add('slap');
        EPU.audio.sfx('drop');
        const home = piece._home;
        if (piece.classList.contains('p-advisory') && home && Math.hypot(piece.offsetLeft - home[0], piece.offsetTop - home[1]) > 70) EPU.emit('sticker:peeled');
      };
      handle.addEventListener('pointermove', move);
      handle.addEventListener('pointerup', up);
      handle.addEventListener('pointercancel', up);
    });
  }

  function keygen() {
    const ctf = EPU.ctf;
    const win = $('.p-keygen');
    const name = $('#kgName'), id = $('#kgId'), mail = $('#kgMail'), phone = $('#kgPhone'), track = $('#kgTrack'), key = $('#kgKey'), status = $('#kgStatus');
    const fields = [name, id, mail, phone, track, key];
    let sent = false;
    const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const phoneOk = (v) => /^(?:\+?84|0)\d{9}$/.test(v.replace(/[\s.()-]/g, ''));

    const problem = () => {
      const b = id.value.trim(), a = name.value.trim(), m = mail.value.trim(), ph = phone.value.trim();
      if (!b) return [id, 'Input System ID!'];
      if (!a) return [name, 'Input your name!'];
      if (!m) return [mail, 'Input E-mail!'];
      if (!EMAIL.test(m)) return [mail, 'Invalid E-mail!'];
      if (!ph) return [phone, 'Input Phone No.!'];
      if (!phoneOk(ph)) return [phone, 'Invalid Phone No.!'];
      if (!track.value) return [track, 'Select a Track!'];
      return null;
    };
    const refresh = () => {
      const v = key.value.trim();
      const good = v && ctf.check(v);
      const bad = v && !good && v.length >= 4;
      key.classList.toggle('ok', !!good);
      key.classList.toggle('bad', !!bad);
      const miss = problem();
      if (bad) status.textContent = 'Invalid License Key';
      else if (miss) status.textContent = (good ? 'KEY OK ✓ ' : '') + miss[1];
      else status.textContent = good ? 'ELITE KEY ✓ press ACTIVATE' : 'Ready ✓ press ACTIVATE';
    };
    fields.forEach((inp) =>
      inp.addEventListener(inp === track ? 'change' : 'input', () => {
        EPU.audio.sfx('key');
        if (inp === key && ctf.check(key.value) && !ctf.solved) {
          ctf.solve();
          EPU.audio.sfx('ok');
          EPU.emit('celebrate');
        }
        refresh();
      })
    );

    const go = () => {
      const a = name.value.trim(), b = id.value.trim(), m = mail.value.trim(), ph = phone.value.trim(), k = key.value.trim();
      const miss = problem();
      if (miss) {
        EPU.audio.sfx('error');
        win.classList.remove('shake');
        void win.offsetWidth;
        win.classList.add('shake');
        status.textContent = miss[1];
        miss[0].focus();
        return;
      }
      if (sent) return (status.textContent = 'Already registered ✓');
      const F = S.form.fields;
      const answers = new URLSearchParams();
      const put = (k, v) => F[k] && v && answers.set(F[k], v);
      put('name', a);
      put('id', b);
      put('email', m);
      put('phone', ph);
      put('track', track.value);
      if (ctf.check(k)) put('note', 'FLAG: ' + k);
      answers.set('fvv', '1');
      answers.set('pageHistory', '0');
      const prefilled = () => {
        const u = new URL(S.form.action.replace(/formResponse$/, 'viewform'));
        u.searchParams.set('usp', 'pp_url');
        answers.forEach((v, key) => key.startsWith('entry.') || key === 'emailAddress' ? u.searchParams.set(key, v) : 0);
        return u.toString();
      };
      status.textContent = 'Sending license…';
      $('#kgGo').disabled = true;
      fetch(S.form.action, { method: 'POST', mode: 'no-cors', body: answers })
        .then(() => {
          sent = true;
          status.textContent = 'LICENSE ACCEPTED ✓ đã đăng ký';
          EPU.audio.sfx('ok');
          EPU.emit('celebrate');
          ui.say(S.pirate.registered);
        })
        .catch(() => {
          status.textContent = 'Network error: opening form…';
          window.open(prefilled(), '_blank', 'noopener');
        })
        .finally(() => ($('#kgGo').disabled = false));
    };
    $('#kgGo').addEventListener('click', go);
    fields.forEach((inp) => inp.addEventListener('keydown', (e) => e.key === 'Enter' && go()));

    const parts = $('.kg-parts');
    const paint = () => {
      $$('i', parts).forEach((el) => el.classList.toggle('got', ctf.found.has(+el.dataset.n)));
      $('#kgPartsN').textContent = `${ctf.found.size}/${ctf.total}`;
    };
    parts.addEventListener('click', (e) => {
      const n = +(e.target.dataset && e.target.dataset.n);
      if (!n || !ctf.found.has(n)) return;
      if (!ctf.isPicture(n)) return ui.say(`${n}/${ctf.total}: ${ctf.parts[n - 1]}`);
      ui.say(ui.fill(S.pirate.pictureAgain, n));
      EPU.emit('ctf:replay', Object.keys(ctf.where).find((k) => ctf.where[k] === n));
    });
    EPU.on('ctf:update', paint);
    EPU.on('ctf:solved', refresh);
    paint();

    const zoomable = () => EPU.layout.mode === 'port' && EPU.layout.s < 0.6;
    win.addEventListener('focusin', () => {
      if (!zoomable() || win.classList.contains('zoom')) return;
      const L = EPU.layout;
      win._saved = [win.style.left, win.style.top, win.style.width, win.style.fontSize];
      win.classList.add('zoom');
      document.body.classList.add('kg-typing');
      win.style.left = (10 - L.ox) / L.s + 'px';
      win.style.top = (10 - L.oy) / L.s + 'px';
      win.style.width = (innerWidth - 20) / L.s + 'px';
      win.style.fontSize = 12.5 / L.s + 'px';
      win.style.zIndex = zTop + 100;
    });
    win.addEventListener('focusout', (e) => {
      if (!win.classList.contains('zoom') || win.contains(e.relatedTarget)) return;
      win.classList.remove('zoom');
      document.body.classList.remove('kg-typing');
      [win.style.left, win.style.top, win.style.width, win.style.fontSize] = win._saved;
    });

    win.querySelector('.wb').addEventListener('click', (e) => {
      const w = e.target.dataset.w;
      if (!w) return;
      EPU.audio.sfx('blip');
      if (w === 'min') win.classList.toggle('min');
      if (w === 'max') {
        win.classList.remove('boing');
        void win.offsetWidth;
        win.classList.add('boing');
      }
      if (w === 'close') {
        win.classList.remove('shake');
        void win.offsetWidth;
        win.classList.add('shake');
        ui.say(S.pirate.closeJoke);
      }
    });

    const deadline = new Date(S.deadline).getTime();
    const trial = $('#kgTrial');
    const tick = () => {
      let s = Math.floor((deadline - Date.now()) / 1000);
      if (s <= 0) return (trial.textContent = 'EXPIRED');
      const dd = Math.floor(s / 86400);
      s %= 86400;
      const hh = Math.floor(s / 3600);
      s %= 3600;
      const mm = Math.floor(s / 60);
      s %= 60;
      trial.textContent = `${dd}d ${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };
    tick();
    setInterval(tick, 1000);
  }

  const banner = { ctx: null, img: null, acc: 1 };
  function drawBanner(t, dt) {
    banner.acc += dt;
    if (banner.acc < 1 / 15) return;
    banner.acc = 0;
    const pc = $('.kg-plasma');
    if (!banner.ctx) {
      banner.ctx = pc.getContext('2d');
      banner.img = banner.ctx.createImageData(pc.width, pc.height);
    }
    const { width: w, height: h } = pc;
    const d = banner.img.data;
    const risen = EPU.state.risen;
    const lift = 1 + EPU.audio.beat * 0.3;
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const v = Math.sin(x * 0.16 + t * 1.3) + Math.sin(y * 0.3 + t * 0.9) + Math.sin((x + y) * 0.09 + t * 1.7) + Math.sin(Math.hypot(x - w / 2, y - h / 2) * 0.22 - t * 2.2);
        const q = (v + 4) / 8;
        const i = (y * w + x) * 4;
        if (risen) {
          d[i] = Math.min(255, (120 + q * 135) * lift);
          d[i + 1] = q * 30;
          d[i + 2] = q * 20;
        } else {
          d[i] = Math.min(255, (180 + Math.sin(q * 6.28) * 75) * lift);
          d[i + 1] = Math.min(255, (70 + Math.sin(q * 6.28 + 2) * 60) * lift);
          d[i + 2] = Math.min(255, (210 + Math.sin(q * 6.28 + 4) * 45) * lift);
        }
        d[i + 3] = 255;
      }
    banner.ctx.putImageData(banner.img, 0, 0);

    const sc = $('.kg-scope');
    const c = sc.getContext('2d');
    c.clearRect(0, 0, sc.width, sc.height);
    const wv = EPU.audio.waveform(80);
    c.lineWidth = 2;
    c.strokeStyle = risen ? '#ffd23a' : '#ffffff';
    c.beginPath();
    for (let i = 0; i < wv.length; i++) {
      const x = (i / (wv.length - 1)) * sc.width;
      const y = sc.height / 2 + wv[i] * sc.height * 0.45;
      i ? c.lineTo(x, y) : c.moveTo(x, y);
    }
    c.stroke();
  }

  function tracks() {
    $$('.jc-tracks li').forEach((li) => {
      const i = +li.dataset.i;
      li.addEventListener('pointerenter', () => EPU.emit('track:hover', i));
      li.addEventListener('pointerleave', () => EPU.emit('track:hover', -1));
      li.addEventListener('click', () => EPU.emit('track:show', i));
    });
    EPU.on('star:collect', (i) => {
      const li = $(`.jc-tracks li[data-i="${i}"]`);
      if (li) li.classList.add('got');
      $('#jcCount').textContent = `${EPU.state.collected.size}/${S.tracks.length}`;
    });
    EPU.on('star:hover', (i) => $$('.jc-tracks li').forEach((li) => li.classList.toggle('lit', +li.dataset.i === i)));
  }

  function setSeam(v) {
    EPU.state.seam = clamp(v, 0, 1);
    EPU.state.seamTouched = true;
    placeSeam();
  }
  function seamHandle() {
    const h = $('#seam');
    h.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      h.setPointerCapture(e.pointerId);
      h.classList.add('grab');
      const move = (ev) => setSeam(ev.clientX / innerWidth);
      const up = () => {
        h.classList.remove('grab');
        h.removeEventListener('pointermove', move);
        h.removeEventListener('pointerup', up);
        h.removeEventListener('pointercancel', up);
      };
      h.addEventListener('pointermove', move);
      h.addEventListener('pointerup', up);
      h.addEventListener('pointercancel', up);
    });
    h.addEventListener('dblclick', () => {
      EPU.state.seamTouched = false;
      layout();
    });
    h.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 0.1 : 0.02;
      if (e.key === 'ArrowLeft') setSeam(EPU.state.seam - step);
      if (e.key === 'ArrowRight') setSeam(EPU.state.seam + step);
    });
  }
  function placeSeam() {
    const h = $('#seam');
    const W = innerWidth, H = innerHeight, L = EPU.layout;
    const y = L.oy + (SEAM_Y[L.mode] ?? L.AH * 0.4) * L.s;
    const x = (EPU.state.seam + (0.5 - y / H) * SEAM_TILT) * W;
    const half = h.offsetWidth / 2 + 8;
    h.style.left = clamp(x, half, W - half) + 'px';
    h.style.top = y + 'px';
    h.style.setProperty('--rot', ((Math.atan((SEAM_TILT * W) / H) * 180) / Math.PI).toFixed(2) + 'deg');
    h.setAttribute('aria-valuenow', Math.round(EPU.state.seam * 100));
  }
  EPU.seamTilt = SEAM_TILT;

  function layout() {
    const W = innerWidth, H = innerHeight;
    const mode = EPU.board || (W / H < 0.95 ? 'port' : 'land');
    const B = BOARDS[mode];
    const s = Math.min(W / B.w, H / B.h);
    const ox = (W - B.w * s) / 2, oy = (H - B.h * s) / 2;
    const changed = !EPU.layout || EPU.layout.mode !== mode;
    EPU.layout = { W, H, mode, AW: B.w, AH: B.h, s, ox, oy };
    for (const el of [stage, $('#stage-top')]) {
      el.className = mode;
      el.style.width = B.w + 'px';
      el.style.height = B.h + 'px';
      el.style.transform = `translate(${ox}px, ${oy}px) scale(${s})`;
    }
    document.documentElement.style.setProperty('--s', s);
    if (changed) {
      $$('.piece', stage).forEach((p) => {
        p.style.left = p.style.top = '';
        p._home = [p.offsetLeft, p.offsetTop];
      });
      fitPosters();
    }
    if (!EPU.state.seamTouched) EPU.state.seam = (ox + (SEAM_ART[mode] ?? B.w * 0.35) * s) / W;
    placeSeam();
    buildBlood();
    EPU.emit('layout', EPU.layout);
  }

  let t = 0;
  ui.frame = (dt) => {
    t += dt;
    drawBanner(t, dt);
  };

  ui.enter = () => {
    const order = ['.p-title', '.p-date', '.p-recruit', '.p-pirate', '.p-bubble', '.p-splat1', '.p-jcard', '.p-splat2', '.p-keygen', '.p-under', '.p-vhs', '.p-advisory'];
    const beat = 60000 / (S.music.bpm || 128) / 2;
    order.forEach((sel, i) => setTimeout(() => $(sel) && $(sel).classList.add('in'), 250 + i * beat));
    setTimeout(ui.sayIntro, 250 + order.indexOf('.p-bubble') * beat + 200);
    setTimeout(() => !ui.talked && ui.say(S.pirate.nudge), 25000);
  };

  ui.BOARDS = BOARDS;
  ui.build = build;
  ui.layout = layout;
  ui.fitPosters = fitPosters;
  ui.placeSeam = placeSeam;
  ui.setSeam = setSeam;
})();
