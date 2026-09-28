(function () {
  const EPU = (window.EPU = window.EPU || {});
  const handlers = {};

  EPU.on = (name, fn) => (handlers[name] = handlers[name] || []).push(fn);
  EPU.emit = (name, data) => (handlers[name] || []).forEach((fn) => fn(data));

  EPU.state = {
    entered: false,
    risen: false,
    collected: new Set(),
    seam: 0.35,
    seamTouched: false,
    mx: 0, my: 0
  };

  EPU.util = {
    $: (sel, root = document) => root.querySelector(sel),
    $$: (sel, root = document) => [...root.querySelectorAll(sel)],
    el(tag, cls, html) {
      const e = document.createElement(tag);
      if (cls) e.className = cls;
      if (html != null) e.innerHTML = html;
      return e;
    },
    svg(tag, attrs = {}) {
      const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
      for (const k in attrs) e.setAttribute(k, attrs[k]);
      return e;
    },
    esc: (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
    clamp: (v, a, b) => Math.min(b, Math.max(a, v)),
    lerp: (a, b, t) => a + (b - a) * t,
    rng(seed) {
      return () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    },
    reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
    coarse: matchMedia('(pointer: coarse)').matches
  };

  EPU.setRisen = (on) => {
    if (EPU.state.risen === on) return;
    EPU.state.risen = on;
    document.body.classList.toggle('risen', on);
    EPU.emit('risen', on);
  };
})();
