(function () {
  const EPU = window.EPU;
  const S = window.SITE;
  const { $ } = EPU.util;

  EPU.ui.build();
  EPU.ctf.plant();
  EPU.ui.layout();
  addEventListener('resize', () => EPU.ui.layout());

  const cv = $('#intro');
  const cx = cv.getContext('2d');
  let introOn = true;
  const stars = Array.from({ length: 240 }, () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() }));
  let scrollX = 0;
  const sizeIntro = () => {
    cv.width = innerWidth;
    cv.height = innerHeight;
  };
  sizeIntro();
  addEventListener('resize', sizeIntro);

  function drawIntro(t, dt) {
    const W = cv.width, H = cv.height;
    cx.fillStyle = 'rgba(0,0,0,.35)';
    cx.fillRect(0, 0, W, H);
    for (const s of stars) {
      s.z -= dt * 0.22;
      if (s.z <= 0.02) Object.assign(s, { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: 1 });
      const r = (1 - s.z) * 3;
      cx.fillStyle = `rgba(255,255,255,${1 - s.z})`;
      cx.fillRect(W / 2 + (s.x / s.z) * W * 0.3, H / 2 + (s.y / s.z) * H * 0.3, r, r);
    }
    for (let i = 0; i < 6; i++) {
      const y = H * 0.5 + Math.sin(t * 1.5 + i * 0.5) * H * 0.32;
      const hue = (i * 55 + t * 50) % 360;
      const g = cx.createLinearGradient(0, y - 16, 0, y + 16);
      g.addColorStop(0, `hsla(${hue},100%,25%,0)`);
      g.addColorStop(0.5, `hsla(${hue},100%,65%,.5)`);
      g.addColorStop(1, `hsla(${hue},100%,25%,0)`);
      cx.fillStyle = g;
      cx.fillRect(0, y - 16, W, 32);
    }
    const fs = Math.round(Math.max(16, Math.min(40, W / 24)));
    const cw = fs * 1.02;
    const text = S.intro.scroller;
    cx.font = `${fs}px "Press Start 2P", monospace`;
    scrollX += dt * fs * 5.5;
    if (scrollX > text.length * cw + W) scrollX = 0;
    for (let i = 0; i < text.length; i++) {
      const x = W - scrollX + i * cw;
      if (x < -cw || x > W) continue;
      cx.fillStyle = `hsl(${(x * 0.3 + t * 140) % 360},100%,66%)`;
      cx.fillText(text[i], x, H * 0.88 + Math.sin(x * 0.012 + t * 3.2) * fs * 0.9);
    }
  }

  const bar = $('#introBar'), stateEl = $('#introState'), go = $('#introGo');
  $('#introLine').textContent = S.intro.line;
  const done = { fonts: 0, audio: 0, scene: 0 };
  const showProgress = () => (bar.style.width = (((done.fonts + done.audio + done.scene) / 3) * 100).toFixed(0) + '%');
  const timeout = (p, ms) => Promise.race([p, new Promise((r) => setTimeout(r, ms))]);

  const sample = [...S.title.landscape, ...S.title.portrait, S.recruit.big, S.recruit.small, S.dateLine, S.intro.line].join(' ');
  const fontsP = timeout(
    Promise.all(['Anton', 'Nosifer', 'Patrick Hand', 'Press Start 2P', 'Space Mono', 'VT323'].map((f) => document.fonts.load(`40px "${f}"`, sample))).catch(() => {}),
    8000
  ).then(() => {
    done.fonts = 1;
    showProgress();
    EPU.ui.fitPosters();
    document.fonts.addEventListener('loadingdone', () => EPU.ui.fitPosters());
  });

  const audioP = EPU.audio.load().then(() => {
    done.audio = 1;
    showProgress();
  });
  const poll = setInterval(() => {
    done.audio = Math.max(done.audio, EPU.audio.progress());
    showProgress();
  }, 200);

  const sceneP = EPU.scene
    .init($('#gl'))
    .catch((e) => {
      console.warn('3D disabled:', e);
      document.body.classList.add('no3d');
    })
    .then(() => {
      done.scene = 1;
      showProgress();
    });

  let ready = false, entering = false;
  Promise.all([fontsP, audioP, timeout(sceneP, 20000)]).then(() => {
    clearInterval(poll);
    bar.style.width = '100%';
    stateEl.textContent = EPU.audio.mode === 'none' ? 'soundtrack missing (check config.js)' : 'loaded. crack it.';
    go.disabled = false;
    go.classList.add('blink');
    ready = true;
  });

  async function enter() {
    if (!ready || entering) return;
    entering = true;
    try {
      await EPU.audio.start();
    } catch (e) {
      entering = false;
      stateEl.textContent = 'sound was blocked: press again';
      return;
    }
    EPU.state.entered = true;
    $('#splash').classList.add('off');
    setTimeout(() => {
      introOn = false;
      $('#splash').remove();
    }, 900);
    document.body.classList.add('entered');
    EPU.emit('enter');
    EPU.ui.enter();
  }
  $('#splash').addEventListener('pointerdown', enter);
  go.addEventListener('click', enter);

  let typed = '';
  addEventListener('keydown', (e) => {
    if (!EPU.state.entered) {
      if (!e.repeat && !['Shift', 'Control', 'Alt', 'Meta', 'Tab'].includes(e.key)) enter();
      return;
    }
    if (e.target.closest && e.target.closest('input, textarea, [role="slider"]')) return;
    typed = (typed + (e.key.length === 1 ? e.key.toLowerCase() : '')).slice(-12);
    if (typed.endsWith('risen')) {
      EPU.setRisen(!EPU.state.risen);
      EPU.audio.sfx('risen');
    }
    if (typed.endsWith('1998') || typed.endsWith('2026')) {
      EPU.ui.setSeam(typed.endsWith('1998') ? 1 : 0);
      EPU.audio.sfx('blip');
    }
  });

  const aim = { x: 0, y: 0 };
  addEventListener(
    'pointermove',
    (e) => {
      aim.x = (e.clientX / innerWidth) * 2 - 1;
      aim.y = (e.clientY / innerHeight) * 2 - 1;
    },
    { passive: true }
  );
  let last = performance.now(), T = 0;
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    T += dt;
    const k = Math.min(1, dt * 4);
    EPU.state.mx += (aim.x - EPU.state.mx) * k;
    EPU.state.my += (aim.y - EPU.state.my) * k;
    EPU.audio.update(dt);
    if (introOn) drawIntro(T, dt);
    EPU.ui.frame(dt);
    if (EPU.scene.ready) EPU.scene.frame(dt, T);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  console.log(
    '%c EPU CYBERSECURITY CLUB ',
    'font: 28px Anton, Impact, sans-serif; color: #fff; background: linear-gradient(90deg,#ff2a2a,#ffe600,#22d3ff,#ff4fd8); padding: 6px 14px; text-shadow: 2px 2px 0 #000'
  );
  console.log('%cyo, curious one ☠  there are 10 flag pieces. one of them is right here ↓', 'color: #ff9ad5; font: 13px monospace');
})();
