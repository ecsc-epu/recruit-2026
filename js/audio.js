(function () {
  const EPU = window.EPU;
  const M = window.SITE.music;

  const A = (EPU.audio = {
    mode: 'file',
    el: null,
    ctx: null,
    analyser: null,
    playing: false,
    beat: 0,
    level: 0,
    beats: 0
  });

  let freq, wave, fxGain, noiseBuf;
  let lastBeatAt = 0, avg = 0.08, lastWhole = -1, rateAnim = 0;

  A.load = () =>
    new Promise((resolve) => {
      const el = new Audio();
      el.preload = 'auto';
      el.loop = true;
      el.volume = M.volume ?? 0.75;
      el.src = M.src;
      A.el = el;
      let done = false;
      const finish = (ok) => {
        if (done) return;
        done = true;
        if (!ok) {
          A.mode = M.soundcloudUrl ? 'soundcloud' : 'none';
          A.el = null;
        }
        resolve(ok);
      };
      el.addEventListener('canplaythrough', () => finish(true), { once: true });
      el.addEventListener('error', () => finish(false), { once: true });
      setTimeout(() => finish(!el.error), 9000);
      el.load();
    });

  A.progress = () => {
    const el = A.el;
    if (!el || !el.duration || !el.buffered.length) return 0;
    return Math.min(1, el.buffered.end(el.buffered.length - 1) / el.duration);
  };

  A.start = async () => {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!A.ctx && Ctx) {
      A.ctx = new Ctx();
      fxGain = A.ctx.createGain();
      fxGain.gain.value = 0.16;
      fxGain.connect(A.ctx.destination);
    }
    if (A.mode === 'file') {
      const sameOrigin = new URL(M.src, location.href).origin === location.origin;
      if (!A.analyser && A.ctx && location.protocol !== 'file:' && sameOrigin) {
        try {
          const src = A.ctx.createMediaElementSource(A.el);
          A.analyser = A.ctx.createAnalyser();
          A.analyser.fftSize = 1024;
          A.analyser.smoothingTimeConstant = 0.55;
          src.connect(A.analyser);
          A.analyser.connect(A.ctx.destination);
          freq = new Uint8Array(A.analyser.frequencyBinCount);
          wave = new Uint8Array(A.analyser.fftSize);
        } catch (e) {
          A.analyser = null;
        }
      }
      const p = A.el.play();
      if (A.ctx && A.ctx.state === 'suspended') A.ctx.resume();
      await p;
    } else if (A.mode === 'soundcloud') {
      if (A.ctx && A.ctx.state === 'suspended') A.ctx.resume();
      const holder = document.getElementById('sc');
      const url =
        'https://w.soundcloud.com/player/?url=' + encodeURIComponent(M.soundcloudUrl) +
        '&auto_play=true&hide_related=true&show_comments=false&visual=false';
      holder.innerHTML = `<iframe title="soundtrack" allow="autoplay" src="${url}" width="300" height="120"></iframe>`;
      holder.hidden = false;
    }
    A.playing = true;
    A.t0 = performance.now();
  };

  A.update = (dt) => {
    const now = performance.now();
    if (A.playing && A.analyser) {
      A.analyser.getByteFrequencyData(freq);
      A.analyser.getByteTimeDomainData(wave);
      let bass = 0;
      for (let i = 1; i < 9; i++) bass += freq[i];
      bass /= 8 * 255;
      let all = 0;
      for (let i = 0; i < 256; i++) all += freq[i];
      A.level = all / (256 * 255);
      if (bass > avg * 1.2 + 0.03 && now - lastBeatAt > 190) {
        A.beat = 1;
        lastBeatAt = now;
        EPU.emit('beat', ++A.beats);
      }
      avg = avg * 0.93 + bass * 0.07;
    } else if (A.playing) {
      const t = A.el ? A.el.currentTime : (now - A.t0) / 1000;
      const ph = (t * (M.bpm || 128)) / 60;
      const whole = Math.floor(ph);
      if (whole !== lastWhole) {
        lastWhole = whole;
        A.beat = 1;
        EPU.emit('beat', ++A.beats);
      }
      A.level = 0.32 + 0.1 * Math.sin(ph * Math.PI * 2);
    }
    A.beat *= Math.exp(-dt * 7);
  };

  A.waveform = (n) => {
    const out = new Float32Array(n);
    if (A.analyser && wave) {
      const step = wave.length / n;
      for (let i = 0; i < n; i++) out[i] = (wave[Math.floor(i * step)] - 128) / 128;
    } else {
      const t = performance.now() / 1000;
      const amp = A.playing ? 0.35 + A.beat * 0.5 : 0.05;
      for (let i = 0; i < n; i++) {
        const x = i / n;
        out[i] = amp * (Math.sin(x * 38 + t * 9) * 0.6 + Math.sin(x * 91 - t * 13) * 0.3 + (Math.random() - 0.5) * 0.2);
      }
    }
    return out;
  };

  function tone(freqHz, dur, type = 'square', vol = 0.5, slide = 0, delay = 0) {
    const c = A.ctx;
    const t = c.currentTime + delay;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freqHz, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freqHz * slide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(fxGain);
    o.start(t);
    o.stop(t + dur + 0.03);
  }

  function noise(dur, cutoff, vol) {
    const c = A.ctx;
    if (!noiseBuf) {
      noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const s = c.createBufferSource();
    const f = c.createBiquadFilter();
    const g = c.createGain();
    s.buffer = noiseBuf;
    f.type = 'lowpass';
    f.frequency.value = cutoff;
    g.gain.setValueAtTime(vol, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    s.connect(f);
    f.connect(g);
    g.connect(fxGain);
    s.start();
    s.stop(c.currentTime + dur);
  }

  A.sfx = (name) => {
    if (!A.ctx || A.ctx.state !== 'running') return;
    const semis = (base, list, gap, len, type = 'square') =>
      list.forEach((n, i) => tone(base * 2 ** (n / 12), len, type, 0.45, 0, i * gap));
    switch (name) {
      case 'key':   tone(1100 + Math.random() * 700, 0.035, 'square', 0.3); break;
      case 'blip':  tone(880, 0.05, 'square', 0.35); break;
      case 'talk':  tone(300 + Math.random() * 260, 0.04, 'triangle', 0.35); break;
      case 'star':  semis(880, [0, 4, 7, 12, 16], 0.045, 0.09); break;
      case 'boing': tone(180, 0.4, 'sine', 0.9, 3.2); break;
      case 'boom':  noise(0.45, 900, 1.2); tone(90, 0.3, 'sine', 0.9, 0.4); break;
      case 'drop':  tone(260, 0.08, 'triangle', 0.6, 0.55); break;
      case 'ok':    semis(523.25, [0, 7, 12, 19, 24], 0.07, 0.14); break;
      case 'error': tone(150, 0.22, 'sawtooth', 0.45, 0.7); tone(110, 0.3, 'sawtooth', 0.45, 0.7, 0.13); break;
      case 'risen': tone(110, 1.3, 'sawtooth', 0.7, 0.35); noise(0.9, 400, 0.8); break;
      case 'wish':  semis(1318.5, [0, 3, 7, 10, 14, 19], 0.06, 0.12, 'triangle'); break;
    }
  };

  EPU.on('risen', (on) => {
    const el = A.el;
    if (!el) return;
    el.preservesPitch = el.mozPreservesPitch = el.webkitPreservesPitch = false;
    const from = el.playbackRate;
    const to = on ? 0.8 : 1;
    const t0 = performance.now();
    cancelAnimationFrame(rateAnim);
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / 700);
      try { el.playbackRate = from + (to - from) * (1 - (1 - k) ** 3); } catch (e) { }
      if (k < 1) rateAnim = requestAnimationFrame(step);
    };
    step();
  });
})();
