(function () {
  const EPU = window.EPU;
  const S = window.SITE;

  EPU.scene = { init };

  const COMPO = {
    land: {
      mascot: [800, 400, 0, 150],
      heart: [1456, 292, 0, 60],
      skull: [1196, 318, 0, 90],
      goal: [1343, 262, -4, 24],
      star: 24,
      heartText: [1410, 372, 1.5, 8],
      roadA: { w: 170, pts: [[-520, 1180, 2.2], [120, 940, 1.6], [520, 700, 0.6], [800, 470, -1.4], [1150, 250, -4], [1600, 40, -9], [2300, -260, -16]] },
      roadB: { w: 46, pts: [[-440, 620, -2.6], [60, 470, -3.2], [420, 250, -4], [760, -40, -6], [1000, -320, -8]] }
    },
    port: {
      mascot: [560, 790, 0, 140],
      heart: [818, 432, 0, 54],
      skull: [716, 540, 0, 80],
      goal: [130, 790, -4, 24],
      star: 22,
      heartText: [655, 664, 1.5, 10, '#1b0f33'],
      roadA: { w: 160, pts: [[-320, 1560, 2.2], [80, 1250, 1.2], [360, 1000, 0], [560, 820, -1.5], [720, 620, -3.5], [920, 340, -7], [1300, -120, -13]] },
      roadB: { w: 40, pts: [[-400, 1060, -2.6], [-40, 900, -3.2], [130, 790, -4]] }
    }
  };

  EPU.scene.COMPO = COMPO;

  async function init(canvas) {
    const THREE = await import('three');
    const [{ EffectComposer }, { RenderPass }, { UnrealBloomPass }, { ShaderPass }, { OutputPass }, { RoomEnvironment }] = await Promise.all([
      import('three/addons/postprocessing/EffectComposer.js'),
      import('three/addons/postprocessing/RenderPass.js'),
      import('three/addons/postprocessing/UnrealBloomPass.js'),
      import('three/addons/postprocessing/ShaderPass.js'),
      import('three/addons/postprocessing/OutputPass.js'),
      import('three/addons/environments/RoomEnvironment.js')
    ]);
    const { clamp, rng, coarse } = EPU.util;
    const A = EPU.audio;
    const R = rng(1337);
    const damp = THREE.MathUtils.damp;
    const small = coarse || Math.min(innerWidth, innerHeight) < 640;
    const say = (t) => EPU.ui.say(t);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1 : 1.25));
    renderer.setSize(innerWidth, innerHeight, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    const CAM_Z = 12;
    const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 500);
    camera.position.set(0, 0, CAM_Z + 6);
    scene.add(camera);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.8;
    scene.add(new THREE.HemisphereLight(0xffffff, 0x3a1a5a, 1.1));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.9);
    keyLight.position.set(-4, 6, 8);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xff4fd8, 2.4);
    rimLight.position.set(6, -2, -4);
    scene.add(rimLight);

    const U = { uTime: { value: 0 }, uBeat: { value: 0 }, uRisen: { value: 0 }, uPR: { value: renderer.getPixelRatio() } };
    const HSV = `
      vec3 hsv(float h, float s, float v) {
        vec3 p = abs(fract(vec3(h) + vec3(0.0, 2.0 / 3.0, 1.0 / 3.0)) * 6.0 - 3.0);
        return v * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), s);
      }`;
    const BASIC_VERT = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

    const halfH = (z) => (CAM_Z - z) * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    function art(ax, ay, z = 0) {
      const L = EPU.layout;
      const nx = ((L.ox + ax * L.s) / L.W) * 2 - 1;
      const ny = -(((L.oy + ay * L.s) / L.H) * 2 - 1);
      const hh = halfH(z);
      return new THREE.Vector3(nx * hh * (L.W / L.H), ny * hh, z);
    }
    const artSize = (px, z = 0) => ((px * EPU.layout.s) / EPU.layout.H) * 2 * halfH(z);

    {
      const count = small ? 2500 : 5000;
      const g = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      const size = new Float32Array(count);
      const seed = new Float32Array(count);
      const tints = ['#ffffff', '#ffffff', '#ffd6f5', '#cfe3ff', '#fff1c2'].map((c) => new THREE.Color(c));
      for (let i = 0; i < count; i++) {
        const near = i < count * 0.05;
        const z = near ? -2 - R() * 8 : -14 - R() * 90;
        const d = CAM_Z - z;
        pos.set([(R() * 2 - 1) * d * 0.95, (R() * 2 - 1) * d * 0.95, z], i * 3);
        const c = tints[(R() * tints.length) | 0];
        col.set([c.r, c.g, c.b], i * 3);
        size[i] = near ? 0.5 + R() * 0.8 : R() < 0.04 ? 2.6 + R() * 2 : 0.8 + R() * 1.4;
        seed[i] = R();
      }
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      g.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
      g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
      g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
      const m = new THREE.ShaderMaterial({
        uniforms: { uTime: U.uTime, uBeat: U.uBeat, uRisen: U.uRisen, uPR: U.uPR },
        vertexShader: `
          attribute vec3 aColor; attribute float aSize; attribute float aSeed;
          uniform float uTime, uBeat, uPR;
          varying vec3 vColor; varying float vTw;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
            vTw = 0.55 + 0.45 * sin(uTime * (0.6 + aSeed * 2.0) + aSeed * 40.0);
            vColor = aColor;
            gl_PointSize = aSize * uPR * clamp(60.0 / -mv.z, 0.8, 4.0) * (0.9 + 0.2 * vTw + uBeat * 0.25);
          }`,
        fragmentShader: `
          uniform float uRisen;
          varying vec3 vColor; varying float vTw;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, d); a *= a;
            vec3 c = mix(vColor, vec3(1.0, 0.22, 0.15), uRisen * 0.75);
            gl_FragColor = vec4(c * (0.6 + vTw * 1.5), a);
          }`,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      const pts = new THREE.Points(g, m);
      pts.frustumCulled = false;
      scene.add(pts);
    }

    const roadFrag = `
      uniform float uTime, uBeat, uRisen, uStripes;
      varying vec2 vUv;
      ${HSV}
      void main() {
        float y = vUv.y;
        vec3 rb = pow(hsv(y * 0.78, 0.92, 1.0), vec3(2.2));
        float s = pow(0.5 + 0.5 * sin(vUv.x * uStripes - uTime * 2.2), 4.0);
        float core = pow(1.0 - abs(y - 0.5) * 2.0, 5.0);
        vec3 col = rb * (0.8 + 1.2 * s + uBeat * 0.7) + core * 0.2;
        vec3 blood = mix(vec3(0.16, 0.0, 0.0), vec3(1.5, 0.05, 0.02), smoothstep(0.0, 0.9, 1.0 - abs(y - 0.5) * 2.0)) * (0.7 + s * 1.0 + uBeat * 0.6);
        col = mix(col, blood, uRisen);
        float edge = smoothstep(0.0, 0.1, y) * smoothstep(1.0, 0.9, y);
        float ends = smoothstep(0.0, 0.04, vUv.x) * smoothstep(1.0, 0.96, vUv.x);
        gl_FragColor = vec4(col, edge * ends);
      }`;
    const roadMat = (stripes) =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: U.uTime, uBeat: U.uBeat, uRisen: U.uRisen, uStripes: { value: stripes } },
        vertexShader: BASIC_VERT,
        fragmentShader: roadFrag,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide
      });
    const tiltAxis = new THREE.Vector3(0, 0.35, 1).normalize();
    function ribbon(pts, width, seg = 200) {
      const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
      const pos = new Float32Array((seg + 1) * 6);
      const uv = new Float32Array((seg + 1) * 4);
      const idx = [];
      const p = new THREE.Vector3(), tg = new THREE.Vector3(), side = new THREE.Vector3();
      for (let i = 0; i <= seg; i++) {
        const t = i / seg;
        curve.getPointAt(t, p);
        curve.getTangentAt(t, tg);
        side.crossVectors(tg, tiltAxis).normalize().multiplyScalar(width / 2);
        pos.set([p.x + side.x, p.y + side.y, p.z + side.z, p.x - side.x, p.y - side.y, p.z - side.z], i * 6);
        uv.set([t, 1, t, 0], i * 4);
        if (i < seg) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
      g.setIndex(idx);
      return g;
    }
    const roadA = new THREE.Mesh(new THREE.BufferGeometry(), roadMat(70));
    const roadB = new THREE.Mesh(new THREE.BufferGeometry(), roadMat(40));
    roadA.renderOrder = roadB.renderOrder = -1;
    roadA.frustumCulled = roadB.frustumCulled = false;
    scene.add(roadA, roadB);

    function starShape(n, ro, ri) {
      const s = new THREE.Shape();
      for (let i = 0; i < n * 2; i++) {
        const r = i % 2 ? ri : ro;
        const a = (i / (n * 2)) * Math.PI * 2 + Math.PI / 2;
        i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      s.closePath();
      return s;
    }
    const puffy = new THREE.ExtrudeGeometry(starShape(5, 1, 0.52), { depth: 0.25, bevelEnabled: true, bevelThickness: 0.28, bevelSize: 0.22, bevelSegments: 4, curveSegments: 1 });
    puffy.center();
    puffy.computeVertexNormals();
    const glowTex = (() => {
      const c = document.createElement('canvas');
      c.width = c.height = 128;
      const x = c.getContext('2d');
      const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.25, 'rgba(255,255,255,.4)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g;
      x.fillRect(0, 0, 128, 128);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    })();
    const glowSprite = (color, opacity = 0.6) =>
      new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false }));
    const PINK = new THREE.Color(0xff9ad5), PINK_E = new THREE.Color(0xff3fa8), BLOOD = new THREE.Color(0xff2a14), BLOOD_E = new THREE.Color(0x7a0000);

    const proxyGeo = new THREE.SphereGeometry(1, 12, 8);
    const proxyMat = new THREE.MeshBasicMaterial({ visible: false });
    const proxies = [];
    function proxy(owner, r, parent = owner) {
      const m = new THREE.Mesh(proxyGeo, proxyMat);
      m.scale.setScalar(r);
      m.userData.owner = owner;
      parent.add(m);
      proxies.push(m);
    }

    const mascot = new THREE.Group();
    mascot.userData.kind = 'mascot';
    const inner = new THREE.Group();
    const face = new THREE.Group();
    mascot.add(inner);
    inner.add(face);
    const YELLOW = new THREE.Color(0xffd21a), YELLOW_E = new THREE.Color(0x6a4200);
    const ballMat = new THREE.MeshStandardMaterial({ color: YELLOW, roughness: 0.22, metalness: 0, emissive: YELLOW_E, emissiveIntensity: 0.2 });
    face.add(new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), ballMat));
    const inkMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.22, metalness: 0.1 });
    const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyes = [];
    const blushes = [];
    for (const sx of [-1, 1]) {
      const p = new THREE.Vector3(sx * 0.3, 0.2, Math.sqrt(1 - 0.09 - 0.04));
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 14), inkMat);
      eye.position.copy(p).multiplyScalar(0.99);
      eye.lookAt(p.clone().multiplyScalar(2));
      eye.scale.set(0.85, 1.45, 0.55);
      face.add(eye);
      eyes.push(eye);
      const hl = new THREE.Mesh(new THREE.SphereGeometry(0.038, 10, 8), whiteMat);
      hl.position.copy(p).add(new THREE.Vector3(0.035, 0.08, 0.07));
      face.add(hl);
      const blush = new THREE.Mesh(new THREE.CircleGeometry(0.12, 20), new THREE.MeshBasicMaterial({ color: 0xff5fa8, transparent: true, opacity: 0 }));
      const bp = new THREE.Vector3(sx * 0.56, -0.1, 0);
      bp.z = Math.sqrt(1 - bp.x * bp.x - bp.y * bp.y) + 0.01;
      blush.position.copy(bp);
      blush.lookAt(bp.clone().multiplyScalar(2));
      face.add(blush);
      blushes.push(blush);
    }
    function surfacePatch(cx, cy, fn, segX, segY, lift, mat) {
      const g = new THREE.PlaneGeometry(1, 1, segX, segY);
      const p = g.attributes.position;
      const v = new THREE.Vector3();
      for (let i = 0; i < p.count; i++) {
        const [x, y] = fn(p.getX(i) + 0.5, 0.5 - p.getY(i));
        v.set(x + cx, y + cy, 0);
        v.z = Math.sqrt(Math.max(0, 1 - v.x * v.x - v.y * v.y));
        v.multiplyScalar(1 + lift);
        p.setXYZ(i, v.x, v.y, v.z);
      }
      g.computeVertexNormals();
      return new THREE.Mesh(g, mat);
    }
    face.add(surfacePatch(0, -0.16, (u, v) => [(u * 2 - 1) * 0.42 * Math.sqrt(1 - v * v), -v * 0.3], 28, 12, 0.004, inkMat));
    face.add(
      surfacePatch(0, -0.37, (u, v) => [(u * 2 - 1) * 0.18 * Math.sqrt(Math.max(0, 1 - (2 * v - 1) ** 2)), -(2 * v - 1) * 0.085], 16, 10, 0.009,
        new THREE.MeshStandardMaterial({ color: 0xff3d6e, roughness: 0.4 }))
    );
    const hexMat = new THREE.MeshStandardMaterial({ color: 0xff5cbf, emissive: 0xff1f9a, emissiveIntensity: 0.55, roughness: 0.45 });
    const hex = new THREE.Mesh(
      new THREE.ExtrudeGeometry(starShape(6, 1.85, 1.05), { depth: 0.3, bevelEnabled: true, bevelThickness: 0.14, bevelSize: 0.12, bevelSegments: 3, curveSegments: 1 }),
      hexMat
    );
    hex.geometry.center();
    hex.position.z = -0.4;
    inner.add(hex);
    const halo = glowSprite(0xff4fd8, 0.32);
    halo.scale.setScalar(2.9);
    halo.position.z = -0.8;
    inner.add(halo);
    const horns = [-1, 1].map((sx) => {
      const h = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.75, 16), new THREE.MeshStandardMaterial({ color: 0xc40000, emissive: 0x550000, roughness: 0.35 }));
      h.position.set(sx * 0.5, 0.86, 0.12);
      h.rotation.z = -sx * 0.45;
      h.scale.setScalar(0.001);
      face.add(h);
      return h;
    });
    const backPic = EPU.ctf.picture('back');
    if (backPic) {
      const on = [];
      for (let r = 0; r < backPic.h; r++) for (let c = 0; c < backPic.w; c++) if (backPic.bits[r * backPic.w + c]) on.push([c, r]);
      const cell = 1.2 / backPic.w;
      const ink = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), inkMat, on.length);
      const d = new THREE.Object3D();
      on.forEach(([c, r], i) => {
        const x = -(c + 0.5 - backPic.w / 2) * cell, y = -(r + 0.5 - backPic.h / 2) * cell + 0.05;
        const z = -Math.sqrt(Math.max(0, 1 - x * x - y * y));
        d.position.set(x, y, z).multiplyScalar(1.004);
        d.lookAt(x * 2, y * 2, z * 2);
        d.scale.set(cell * 0.96, cell * 0.96, 0.012);
        d.updateMatrix();
        ink.setMatrixAt(i, d.matrix);
      });
      face.add(ink);
    }
    proxy(mascot, 1.45);
    scene.add(mascot);

    const heart = new THREE.Group();
    heart.userData.kind = 'heart';
    const N = small ? 10 : 12, SPAN = 1.3, STEP = (2 * SPAN) / (N - 1);
    const homes = [];
    for (let ix = 0; ix < N; ix++)
      for (let iy = 0; iy < N; iy++)
        for (let iz = 0; iz < N; iz++) {
          const x = (ix / (N - 1)) * 2 * SPAN - SPAN, y = (iy / (N - 1)) * 2 * SPAN - SPAN, z = (iz / (N - 1)) * 2 * SPAN - SPAN;
          const a = x * x + 2.25 * z * z + y * y - 1;
          if (a * a * a - x * x * y * y * y - 0.1125 * z * z * y * y * y < 0) homes.push(new THREE.Vector3(x, y, z));
        }
    const vox = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.05, emissive: 0x1a0020 }), homes.length);
    vox.raycast = () => {};
    const cA = new THREE.Color('#4a2bff'), cB = new THREE.Color('#c23cff'), cC = new THREE.Color('#ff3f9a'), cHi = new THREE.Color('#ffc2ec');
    const dummy = new THREE.Object3D();
    const hv = { off: new Float32Array(homes.length * 3), vel: new Float32Array(homes.length * 3), rot: new Float32Array(homes.length * 3), sc: new Float32Array(homes.length).fill(1), form: null, active: false, t: 0 };
    const voxColor = [];
    homes.forEach((h, i) => {
      const k = clamp((h.y + h.x * 0.35 + 1.1) / 2.4, 0, 1);
      const c = k < 0.5 ? cA.clone().lerp(cB, k * 2) : cB.clone().lerp(cC, (k - 0.5) * 2);
      if (h.x < -0.25 && h.y > 0.25 && h.z > 0.1) c.lerp(cHi, 0.6);
      if (R() < 0.08) c.multiplyScalar(0.6);
      vox.setColorAt(i, c);
      voxColor.push(c);
    });
    function setVoxels() {
      for (let i = 0; i < homes.length; i++) {
        const j = i * 3;
        dummy.position.set(homes[i].x + hv.off[j], homes[i].y + hv.off[j + 1], homes[i].z + hv.off[j + 2]);
        dummy.rotation.set(hv.rot[j], hv.rot[j + 1], hv.rot[j + 2]);
        dummy.scale.setScalar(STEP * 0.9 * hv.sc[i]);
        dummy.updateMatrix();
        vox.setMatrixAt(i, dummy.matrix);
      }
      vox.instanceMatrix.needsUpdate = true;
    }
    setVoxels();
    heart.add(vox);
    proxy(heart, 1.25);
    scene.add(heart);

    const skull = new THREE.Group();
    skull.userData.kind = 'skull';
    const skullMat = new THREE.MeshStandardMaterial({ color: 0xe0140b, emissive: 0x3a0000, roughness: 0.5, metalness: 0.05 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffc83d, metalness: 1, roughness: 0.2, emissive: 0x2a1a00 });
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x080000 });
    const pupilMat = new THREE.MeshStandardMaterial({ color: 0xffb000, emissive: 0xff6a00, emissiveIntensity: 2 });
    const cranium = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 28), skullMat);
    cranium.scale.set(0.95, 0.92, 0.98);
    cranium.position.y = 0.18;
    const cheeks = new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 24), skullMat);
    cheeks.scale.set(1.2, 0.72, 1);
    cheeks.position.set(0, -0.42, 0.26);
    skull.add(cranium, cheeks);
    for (const sx of [-1, 1]) {
      const sock = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 18), holeMat);
      sock.scale.set(1.05, 0.9, 0.55);
      sock.position.set(sx * 0.36, -0.06, 0.74);
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), pupilMat);
      pupil.position.set(sx * 0.36, -0.06, 0.9);
      skull.add(sock, pupil);
    }
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.24, 3), holeMat);
    nose.position.set(0, -0.33, 0.92);
    nose.scale.z = 0.5;
    skull.add(nose);
    const toothGeo = new THREE.BoxGeometry(0.13, 0.19, 0.08);
    const teeth = (parent, cy, cz, r, n, spread) => {
      for (let i = 0; i < n; i++) {
        const a = (i / (n - 1) - 0.5) * spread;
        const tth = new THREE.Mesh(toothGeo, goldMat);
        tth.position.set(Math.sin(a) * r, cy, cz + Math.cos(a) * r);
        tth.rotation.y = a;
        parent.add(tth);
      }
    };
    teeth(skull, -0.66, 0.2, 0.62, 7, 1.25);
    const jaw = new THREE.Group();
    jaw.position.set(0, -0.55, -0.15);
    const jawMesh = new THREE.Mesh(new THREE.SphereGeometry(0.55, 28, 20), skullMat);
    jawMesh.scale.set(1.1, 0.42, 0.95);
    jawMesh.position.set(0, -0.3, 0.3);
    jaw.add(jawMesh);
    teeth(jaw, -0.31, 0.35, 0.58, 6, 1.15);
    skull.add(jaw);
    function hornGeo(sx) {
      const path = new THREE.CatmullRomCurve3([new THREE.Vector3(sx * 0.5, 0.78, 0.05), new THREE.Vector3(sx * 0.95, 1.25, 0), new THREE.Vector3(sx * 0.88, 1.78, 0.12)]);
      const g = new THREE.TubeGeometry(path, 20, 0.21, 12, false);
      const pos = g.attributes.position, uv = g.attributes.uv;
      const c = new THREE.Vector3(), v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        const u = uv.getX(i);
        path.getPointAt(u, c);
        v.fromBufferAttribute(pos, i).sub(c).multiplyScalar(1 - u * 0.93).add(c);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      g.computeVertexNormals();
      return g;
    }
    const hornMat = new THREE.MeshStandardMaterial({ color: 0x9a0000, emissive: 0x220000, roughness: 0.4 });
    skull.add(new THREE.Mesh(hornGeo(-1), hornMat), new THREE.Mesh(hornGeo(1), hornMat));
    proxy(skull, 1.25);
    scene.add(skull);

    const goal = new THREE.Group();
    goal.userData.kind = 'goal';
    const goalMat = new THREE.MeshStandardMaterial({ color: PINK, emissive: PINK_E, emissiveIntensity: 0.9, roughness: 0.6 });
    goal.add(new THREE.Mesh(puffy, goalMat));
    const goalGlow = glowSprite(0xff5fc8, 0.7);
    goalGlow.scale.setScalar(4);
    goal.add(goalGlow);
    proxy(goal, 1.7);
    scene.add(goal);

    const trackStars = S.tracks.map((tr, i) => {
      const g = new THREE.Group();
      const mat = new THREE.MeshStandardMaterial({ color: PINK, emissive: PINK_E, emissiveIntensity: 0.9, roughness: 0.6 });
      g.add(new THREE.Mesh(puffy, mat));
      const glow = glowSprite(0xff5fc8, 0.5);
      glow.scale.setScalar(3.4);
      g.add(glow);
      g.userData = { kind: 'star', index: i, mat, glow, phase: (i / S.tracks.length) * Math.PI * 2, spin: 0.4 + R() * 0.6, vis: 1, gone: 0, lit: 0 };
      proxy(g, 2);
      scene.add(g);
      return g;
    });

    const PMAX = 600;
    const pPos = new Float32Array(PMAX * 3), pVel = new Float32Array(PMAX * 3), pCol = new Float32Array(PMAX * 3);
    const pLife = new Float32Array(PMAX), pDur = new Float32Array(PMAX).fill(1), pSize = new Float32Array(PMAX);
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3).setUsage(THREE.DynamicDrawUsage));
    pGeo.setAttribute('aColor', new THREE.BufferAttribute(pCol, 3).setUsage(THREE.DynamicDrawUsage));
    pGeo.setAttribute('aLife', new THREE.BufferAttribute(pLife, 1).setUsage(THREE.DynamicDrawUsage));
    pGeo.setAttribute('aSize', new THREE.BufferAttribute(pSize, 1).setUsage(THREE.DynamicDrawUsage));
    const particles = new THREE.Points(
      pGeo,
      new THREE.ShaderMaterial({
        uniforms: { uPR: U.uPR },
        vertexShader: `
          attribute vec3 aColor; attribute float aLife; attribute float aSize;
          uniform float uPR; varying vec3 vC; varying float vL;
          void main() {
            vC = aColor; vL = aLife;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = aSize * uPR * (40.0 / -mv.z) * (0.3 + aLife);
          }`,
        fragmentShader: `
          varying vec3 vC; varying float vL;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float cr = max(0.0, 1.0 - abs(c.x) * 9.0) * max(0.0, 1.0 - abs(c.y) * 2.1)
                     + max(0.0, 1.0 - abs(c.y) * 9.0) * max(0.0, 1.0 - abs(c.x) * 2.1);
            float a = clamp(cr + smoothstep(0.5, 0.0, length(c)) * 0.6, 0.0, 1.0) * vL;
            if (a < 0.01) discard;
            gl_FragColor = vec4(vC * 2.2, a);
          }`,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
    particles.frustumCulled = false;
    scene.add(particles);
    let pHead = 0, alive = 0;
    const SPARK = ['#ff9ad5', '#ffe14f', '#ffffff', '#b98cff'].map((c) => new THREE.Color(c));
    const EMBER = ['#ff2a14', '#ffb000', '#ffffff'].map((c) => new THREE.Color(c));
    function burst(at, n, colors = SPARK, speed = 4, size = 1) {
      if (EPU.state.risen) colors = EMBER;
      for (let k = 0; k < n; k++) {
        const i = pHead;
        pHead = (pHead + 1) % PMAX;
        const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, sp = speed * (0.25 + Math.random() * 0.9);
        const q = Math.sqrt(1 - u * u);
        pPos.set([at.x, at.y, at.z], i * 3);
        pVel.set([q * Math.cos(th) * sp, q * Math.sin(th) * sp + speed * 0.3, u * sp], i * 3);
        const c = colors[(Math.random() * colors.length) | 0];
        pCol.set([c.r, c.g, c.b], i * 3);
        pLife[i] = 1;
        pDur[i] = 0.6 + Math.random() * 0.8;
        pSize[i] = (2.5 + Math.random() * 5) * size;
      }
      alive = PMAX;
    }

    const TRAIL = 44, TRAIL_Z = 2.2, TRAIL_AGE = 0.55;
    const trail = [];
    const tPos = new Float32Array(TRAIL * 6), tUv = new Float32Array(TRAIL * 4);
    const tIdx = [];
    for (let i = 0; i < TRAIL - 1; i++) tIdx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2);
    const tGeo = new THREE.BufferGeometry();
    tGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3).setUsage(THREE.DynamicDrawUsage));
    tGeo.setAttribute('uv', new THREE.BufferAttribute(tUv, 2).setUsage(THREE.DynamicDrawUsage));
    tGeo.setIndex(tIdx);
    const trailMesh = new THREE.Mesh(
      tGeo,
      new THREE.ShaderMaterial({
        uniforms: { uRisen: U.uRisen },
        vertexShader: BASIC_VERT,
        fragmentShader: `
          uniform float uRisen; varying vec2 vUv;
          ${HSV}
          void main() {
            float band = floor(vUv.y * 6.0) / 5.0;
            vec3 c = pow(hsv(band * 0.78, 0.95, 1.0), vec3(2.2)) * 1.9;
            c = mix(c, vec3(1.5, 0.04, 0.02) * (1.2 - abs(vUv.y - 0.5)), uRisen);
            float a = (1.0 - vUv.x) * step(0.02, vUv.y) * step(vUv.y, 0.98);
            gl_FragColor = vec4(c, a);
          }`,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide
      })
    );
    trailMesh.frustumCulled = false;
    trailMesh.visible = false;
    scene.add(trailMesh);
    const trailPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -TRAIL_Z);
    const trailHit = new THREE.Vector3();

    function updateTrail(dt) {
      if (!trail.length) return (trailMesh.visible = false);
      for (const pt of trail) pt.age += dt;
      while (trail.length && trail[trail.length - 1].age > TRAIL_AGE) trail.pop();
      const n = trail.length;
      trailMesh.visible = n > 1;
      if (n < 2) return;
      const w = artSize(28, TRAIL_Z);
      for (let i = 0; i < TRAIL; i++) {
        const k = Math.min(i, n - 1);
        const a = trail[Math.max(0, k - 1)].p, b = trail[Math.min(n - 1, k + 1)].p;
        const dx = a.x - b.x, dy = a.y - b.y, len = Math.hypot(dx, dy) || 1;
        const life = i < n ? 1 - trail[k].age / TRAIL_AGE : 0;
        const hw = (w / 2) * Math.sqrt(Math.max(0, life));
        const px = (-dy / len) * hw, py = (dx / len) * hw;
        const pt = trail[k].p;
        tPos.set([pt.x + px, pt.y + py, pt.z, pt.x - px, pt.y - py, pt.z], i * 6);
        const u = k / (n - 1);
        tUv.set([u, 1, u, 0], i * 4);
      }
      tGeo.attributes.position.needsUpdate = true;
      tGeo.attributes.uv.needsUpdate = true;
    }

    const eraPic = EPU.ctf.picture('era');
    const secretTex = (() => {
      const w = eraPic ? eraPic.w : 1, h = eraPic ? eraPic.h : 1;
      const data = new Uint8Array(w * h * 4);
      for (let i = 0; i < w * h; i++) data.set(eraPic && eraPic.bits[i] ? [255, 255, 255, 255] : [0, 0, 0, 255], i * 4);
      const tx = new THREE.DataTexture(data, w, h);
      tx.magFilter = tx.minFilter = THREE.NearestFilter;
      tx.needsUpdate = true;
      return tx;
    })();
    const ERA = {
      uniforms: {
        tDiffuse: { value: null },
        uRes: { value: new THREE.Vector2(1, 1) },
        uSeam: { value: 0.35 },
        uTilt: { value: EPU.seamTilt || 0.06 },
        uTime: { value: 0 },
        uRisen: { value: 0 },
        uPixel: { value: 3 },
        uGlitch: { value: 0 },
        uFade: { value: 0 },
        tSecret: { value: secretTex },
        uSecret: { value: new THREE.Vector4(0, 0, 0, 0) },
        uSecretTexel: { value: new THREE.Vector2(0.5 / (eraPic ? eraPic.w : 1), 0.5 / (eraPic ? eraPic.h : 1)) }
      },
      vertexShader: BASIC_VERT,
      fragmentShader: `
        uniform sampler2D tDiffuse, tSecret;
        uniform vec4 uSecret;
        uniform vec2 uSecretTexel;
        uniform vec2 uRes;
        uniform float uSeam, uTilt, uTime, uRisen, uPixel, uGlitch, uFade;
        varying vec2 vUv;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float bayer2(vec2 a) { a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
        #define bayer4(a) (bayer2(0.5 * (a)) * 0.25 + bayer2(a))
        #define bayer8(a) (bayer4(0.5 * (a)) * 0.25 + bayer2(a))
        vec3 grade(vec3 c) {
          float l = dot(c, vec3(0.299, 0.587, 0.114));
          vec3 a = vec3(0.03, 0.0, 0.0), b = vec3(0.82, 0.03, 0.02), w = vec3(1.0, 0.9, 0.82);
          return l < 0.5 ? mix(a, b, l * 2.0) : mix(b, w, (l - 0.5) * 2.0);
        }
        void main() {
          vec2 uv = vUv;
          vec2 frag = uv * uRes;
          float band = floor(frag.y / 18.0);
          uv.x += (hash(vec2(band, floor(uTime * 20.0))) - 0.5) * 0.03 * uGlitch * step(0.75, hash(vec2(band, 3.0)));
          float row = floor(frag.y / (uPixel * 3.0));
          float seamX = uSeam + (uv.y - 0.5) * uTilt + (hash(vec2(row, 7.0)) - 0.5) * 0.012;
          vec3 col;
          if (uv.x < seamX) {
            vec2 cell = floor(frag / uPixel);
            vec3 c = texture2D(tDiffuse, (cell + 0.5) * uPixel / uRes).rgb;
            float l = dot(c, vec3(0.299, 0.587, 0.114));
            float sat = max(c.r, max(c.g, c.b)) - min(c.r, min(c.g, c.b));
            float th = bayer8(cell);
            float paper = step(th, 1.0 - clamp(l * 1.35, 0.0, 1.0));
            vec3 mono = mix(vec3(0.03, 0.0, 0.07), vec3(0.97, 0.95, 1.0), paper);
            vec3 pal = step(vec3(th), c);
            col = mix(mono, pal, smoothstep(0.18, 0.4, sat));
            col = mix(col, grade(col), uRisen);
            if (uSecret.z > 0.0) {
              vec2 su = (uv - uSecret.xy) / uSecret.zw;
              if (su.x >= 0.0 && su.x <= 1.0 && su.y >= 0.0 && su.y <= 1.0) {
                vec2 st = vec2(su.x, 1.0 - su.y);
                float m = texture2D(tSecret, st).r;
                float o = max(max(texture2D(tSecret, st + vec2(uSecretTexel.x, 0.0)).r, texture2D(tSecret, st - vec2(uSecretTexel.x, 0.0)).r),
                              max(texture2D(tSecret, st + vec2(0.0, uSecretTexel.y)).r, texture2D(tSecret, st - vec2(0.0, uSecretTexel.y)).r));
                col = mix(col, vec3(0.97, 0.95, 1.0), clamp(o - m, 0.0, 1.0));
                col = mix(col, mix(vec3(0.05, 0.0, 0.12), vec3(0.45, 0.0, 0.0), uRisen), m);
              }
            }
          } else {
            vec2 d = (uv - 0.5) * 0.0018;
            col = vec3(texture2D(tDiffuse, uv + d).r, texture2D(tDiffuse, uv).g, texture2D(tDiffuse, uv - d).b);
            col = mix(col, grade(col) * 1.1, uRisen);
            col += (hash(frag + fract(uTime) * 100.0) - 0.5) * 0.03;
            float vig = smoothstep(1.25, 0.35, length((uv - 0.5) * vec2(uRes.x / uRes.y, 1.0)));
            col *= mix(0.6, 1.0, vig);
          }
          float e = abs(uv.x - seamX) * uRes.x;
          col = mix(col, mix(vec3(1.0, 0.35, 0.85), vec3(1.0, 0.1, 0.05), uRisen), smoothstep(uPixel * 0.9, 0.0, e));
          gl_FragColor = vec4(col * uFade, 1.0);
        }`
    };
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const BLOOM = small ? { s: 0.4, r: 0.12 } : { s: 0.6, r: 0.3 };
    const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), BLOOM.s, BLOOM.r, 1.4);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    const era = new ShaderPass(ERA);
    composer.addPass(era);

    function place() {
      const C = COMPO[EPU.layout.mode];
      const put = (obj, [x, y, z, r], unit) => {
        obj.position.copy(art(x, y, z));
        obj.userData.home = obj.position.clone();
        obj.userData.base = artSize(r, z) / unit;
        obj.scale.setScalar(obj.userData.base);
      };
      put(mascot, C.mascot, 1);
      put(heart, C.heart, 1.15);
      put(skull, C.skull, 1.05);
      put(goal, C.goal, 1);
      trackStars.forEach((g) => (g.userData.base = artSize(C.star, 0)));
      const road = (mesh, def) => {
        mesh.geometry.dispose();
        mesh.visible = !!def;
        if (def) mesh.geometry = ribbon(def.pts.map(([x, y, z]) => art(x, y, z)), artSize(def.w, 0));
      };
      road(roadA, C.roadA);
      road(roadB, C.roadB);
      if (eraPic) {
        const L = EPU.layout, [mx, my, , mr] = C.mascot;
        const wpx = mr * 1.75 * L.s, hpx = (wpx * eraPic.h) / eraPic.w;
        era.uniforms.uSecret.value.set((L.ox + mx * L.s - wpx / 2) / L.W, 1 - (L.oy + my * L.s + hpx / 2) / L.H, wpx / L.W, hpx / L.H);
      }
    }
    function resize() {
      const w = innerWidth, h = innerHeight;
      renderer.setSize(w, h, false);
      composer.setPixelRatio(renderer.getPixelRatio());
      composer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      era.uniforms.uRes.value.copy(renderer.getDrawingBufferSize(new THREE.Vector2()));
      era.uniforms.uPixel.value = Math.max(2, Math.round(2.5 * renderer.getPixelRatio()));
      U.uPR.value = renderer.getPixelRatio();
      place();
    }
    EPU.on('layout', resize);
    resize();

    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2(9, 9);
    const ndcAll = new THREE.Vector2(9, 9);
    const tmp = new THREE.Vector3();
    let hover = null, hoverTrack = -1, pickDirty = true, pickAge = 0;
    const pointer = { down: false, x: 0, y: 0, moved: false, target: null, lx: 0, ly: 0 };
    let spinV = 0, holdT = 9, turnTo = null, backT = 0, eraT = 0, jumpT = 1, blinkT = 2, glitch = 0, risenAmt = 0, fade = 0, dolly = 0;

    function pick() {
      if (Math.abs(ndc.x) > 1.5) return null;
      ray.setFromCamera(ndc, camera);
      for (const hit of ray.intersectObjects(proxies, false)) {
        const o = hit.object.userData.owner;
        if (o.userData.kind === 'star' && o.userData.gone) continue;
        return o;
      }
      return null;
    }
    function project(v) {
      tmp.copy(v).project(camera);
      return { x: ((tmp.x + 1) / 2) * innerWidth, y: ((1 - tmp.y) / 2) * innerHeight };
    }
    const nn = (i) => String(i + 1).padStart(2, '0');
    const trackLine = (i) => S.pirate.track.replace('{name}', `${nn(i)} · ${S.tracks[i].name}`).replace('{blurb}', S.tracks[i].blurb);

    addEventListener(
      'pointermove',
      (e) => {
        ndcAll.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
        if (e.target === canvas) ndc.copy(ndcAll);
        else ndc.set(9, 9);
        pickDirty = true;
        ray.setFromCamera(ndcAll, camera);
        if (ray.ray.intersectPlane(trailPlane, trailHit) && (!trail.length || trail[0].p.distanceToSquared(trailHit) > 0.0004)) {
          trail.unshift({ p: trailHit.clone(), age: 0 });
          if (trail.length > TRAIL) trail.pop();
        }
        if (pointer.down && pointer.target && pointer.target.userData.kind === 'mascot') {
          const dx = e.clientX - pointer.lx, dy = e.clientY - pointer.ly;
          inner.rotation.y += dx * 0.012;
          inner.rotation.x = clamp(inner.rotation.x + dy * 0.008, -0.7, 0.7);
          spinV = clamp(dx * 0.3, -8, 8);
          holdT = 0;
          turnTo = null;
        }
        if (pointer.down && Math.hypot(e.clientX - pointer.x, e.clientY - pointer.y) > 6) pointer.moved = true;
        pointer.lx = e.clientX;
        pointer.ly = e.clientY;
      },
      { passive: true }
    );
    canvas.addEventListener('pointerdown', (e) => {
      ndcAll.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
      ndc.copy(ndcAll);
      Object.assign(pointer, { down: true, x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, moved: false, target: pick() });
      if (pointer.target) canvas.setPointerCapture(e.pointerId);
    });
    const release = () => {
      if (!pointer.down) return;
      pointer.down = false;
      if (pointer.target && !pointer.moved) click(pointer.target);
      pointer.target = null;
    };
    addEventListener('pointerup', release);
    addEventListener('pointercancel', release);

    function click(o) {
      const k = o.userData.kind;
      const at = o.getWorldPosition(new THREE.Vector3());
      if (k === 'star') collect(o.userData.index);
      if (k === 'mascot') {
        jumpT = 0;
        spinV += 16;
        holdT = 9;
        burst(at, 40, SPARK, 5, 1.2);
        A.sfx('boing');
        EPU.emit('mascot:click');
      }
      if (k === 'heart') popHeart(at);
      if (k === 'skull') {
        EPU.setRisen(!EPU.state.risen);
        skull.userData.punch = 1;
        glitch = 1;
        burst(at, 50, EMBER, 6, 1.3);
        A.sfx('risen');
      }
      if (k === 'goal') {
        burst(at, 40, SPARK, 5);
        A.sfx('wish');
        say(nextWish());
      }
    }

    const WHITE = new THREE.Color(0xffffff);
    function popHeart(at) {
      if (hv.active) return;
      hv.active = true;
      hv.t = 0;
      hv.shown = false;
      for (let i = 0; i < homes.length; i++) {
        const j = i * 3, h = homes[i];
        const s = 3 + Math.random() * 5;
        hv.vel[j] = (h.x + (Math.random() - 0.5) * 0.6) * s;
        hv.vel[j + 1] = (h.y + (Math.random() - 0.3) * 0.8) * s;
        hv.vel[j + 2] = (h.z + (Math.random() - 0.5) * 0.6) * s + 2;
        hv.rot[j] = hv.rot[j + 1] = hv.rot[j + 2] = 0;
      }
      hv.form = planHeartText();
      if (!hv.form) EPU.ctf.reveal('heart');
      burst(at, 40, ['#ff3f9a', '#c23cff', '#ffffff'].map((c) => new THREE.Color(c)), 4);
      A.sfx('boom');
    }
    function planHeartText() {
      const pic = EPU.ctf.picture('heart');
      if (!pic) return null;
      const [ax, ay, az, cellPx, ink = '#ffffff'] = COMPO[EPU.layout.mode].heartText;
      const center = art(ax, ay, az), pitch = artSize(cellPx, az);
      heart.scale.setScalar(heart.userData.base);
      heart.updateMatrixWorld(true);
      const on = [];
      for (let r = 0; r < pic.h; r++) for (let c = 0; c < pic.w; c++) if (pic.bits[r * pic.w + c]) on.push([c, r]);
      const order = homes.map((_, i) => i).sort(() => Math.random() - 0.5);
      const form = new Float32Array(homes.length * 4);
      const cellScale = ((pitch / heart.userData.base) * 0.92) / (STEP * 0.9);
      const v = new THREE.Vector3();
      order.forEach((i, k) => {
        if (k < on.length) {
          const [c, r] = on[k];
          v.set(center.x + (c + 0.5 - pic.w / 2) * pitch, center.y - (r + 0.5 - pic.h / 2) * pitch, center.z);
          heart.worldToLocal(v);
          form.set([v.x - homes[i].x, v.y - homes[i].y, v.z - homes[i].z, cellScale], i * 4);
          vox.setColorAt(i, WHITE.set(ink));
        } else form.set([0, 0, 0, 0.001], i * 4);
      });
      vox.instanceColor.needsUpdate = true;
      return form;
    }

    // wishes come out in a shuffled order, and never the same one twice in a row
    let wishBag = [], lastWish = '';
    function nextWish() {
      const all = S.pirate.wishes || ['✨'];
      if (!wishBag.length) {
        wishBag = all.slice().sort(() => Math.random() - 0.5);
        if (wishBag.length > 1 && wishBag[wishBag.length - 1] === lastWish) wishBag.unshift(wishBag.pop());
      }
      return (lastWish = wishBag.pop());
    }

    function collect(i) {
      const g = trackStars[i];
      if (g.userData.gone) return;
      burst(g.getWorldPosition(new THREE.Vector3()), 40, SPARK, 5);
      g.userData.gone = 7;
      A.sfx('star');
      EPU.state.collected.add(i);
      EPU.emit('star:collect', i);
      say(trackLine(i));
      if (EPU.state.collected.size === S.tracks.length) EPU.emit('stars:all');
    }

    EPU.on('track:hover', (i) => (hoverTrack = i));
    EPU.on('track:show', (i) => {
      trackStars[i].userData.lit = 1.5;
      say(trackLine(i));
      A.sfx('blip');
    });
    EPU.on('celebrate', () => {
      jumpT = 0;
      spinV += 20;
      for (let k = 0; k < 4; k++) setTimeout(() => burst(mascot.position, 50, SPARK, 6, 1.3), k * 150);
    });
    EPU.on('beat', (n) => {
      if (n % 32 === 0) glitch = 0.6;
    });
    EPU.on('enter', () => (dolly = 1));
    EPU.on('ctf:replay', (place) => {
      if (place === 'heart') popHeart(heart.getWorldPosition(new THREE.Vector3()));
      if (place === 'back') turnTo = Math.round(inner.rotation.y / (Math.PI * 2)) * Math.PI * 2 + Math.PI;
      if (place === 'era') EPU.ui.setSeam(1);
    });

    let slowFor = 0, quality = 0;
    function adapt(dt) {
      if (!dolly || quality >= 2 || EPU.scene.fixedQuality) return;
      slowFor = dt > 1 / 40 ? slowFor + dt : Math.max(0, slowFor - dt);
      if (slowFor < 3) return;
      slowFor = 0;
      quality++;
      if (quality === 1 && renderer.getPixelRatio() > 1) {
        renderer.setPixelRatio(1);
        resize();
      } else {
        quality = 2;
        bloom.enabled = false;
      }
    }

    const colTmp = new THREE.Color();
    let orbitT = 0, lastStar = -1;
    function frame(dt, t) {
      dt = Math.min(dt, 0.05);
      adapt(dt);
      const beat = A.beat;
      U.uTime.value = t;
      U.uBeat.value = beat;
      risenAmt = damp(risenAmt, EPU.state.risen ? 1 : 0, 3, dt);
      U.uRisen.value = risenAmt;
      scene.background.setRGB(0.012 * risenAmt, 0, 0);

      if (dolly) fade = damp(fade, 1, 2.2, dt);
      camera.position.x = damp(camera.position.x, EPU.state.mx * 0.35, 3, dt);
      camera.position.y = damp(camera.position.y, -EPU.state.my * 0.2, 3, dt);
      camera.position.z = damp(camera.position.z, dolly ? CAM_Z : CAM_Z + 6, 1.6, dt);
      camera.lookAt(0, 0, 0);

      pickAge += dt;
      if (pointer.down) hover = pointer.target;
      else if (pickDirty || pickAge > 0.2) {
        hover = pick();
        pickDirty = false;
        pickAge = 0;
      }
      document.body.classList.toggle('hot', !!hover);
      const hk = hover ? hover.userData.kind : null;
      const hoverStar = hk === 'star' ? hover.userData.index : hoverTrack;
      const curStar = hk === 'star' || hoverTrack >= 0 ? hoverStar : -1;
      if (curStar !== lastStar) {
        lastStar = curStar;
        EPU.emit('star:hover', curStar);
      }

      const mb = mascot.userData.base;
      jumpT = Math.min(1, jumpT + dt * 1.6);
      mascot.position.y = mascot.userData.home.y + Math.sin(jumpT * Math.PI) * mb * 0.9 + Math.sin(t * 1.2) * mb * 0.03;
      const hoverM = hk === 'mascot' ? 1 : 0;
      const squash = 1 + (jumpT < 1 ? Math.sin(jumpT * Math.PI * 2) * 0.12 : 0);
      const ms = mb * (1 + beat * 0.035 + hoverM * 0.04);
      mascot.scale.set(ms / Math.sqrt(squash), ms * squash, mb);
      const dragging = pointer.down && pointer.target === mascot && pointer.moved;
      if (dragging) spinV *= Math.exp(-dt * 10);
      else if (turnTo !== null) {
        spinV = 0;
        holdT = 0;
        inner.rotation.y = damp(inner.rotation.y, turnTo, 4, dt);
        if (Math.abs(inner.rotation.y - turnTo) < 0.01) turnTo = null;
      } else {
        inner.rotation.y += spinV * dt;
        spinV *= Math.exp(-dt * 2.4);
        holdT += dt;
        if (holdT > 6 && Math.abs(spinV) < 0.6) {
          inner.rotation.y = damp(inner.rotation.y, Math.round(inner.rotation.y / (Math.PI * 2)) * Math.PI * 2, 3, dt);
          inner.rotation.x = damp(inner.rotation.x, 0, 2.5, dt);
        }
      }
      const facing = Math.cos(inner.rotation.y) * Math.cos(inner.rotation.x);
      backT = backPic && facing < -0.8 && Math.abs(spinV) < 0.8 ? backT + dt : 0;
      if (backT > 0.6) EPU.ctf.reveal('back');
      if (eraPic) {
        const r = era.uniforms.uSecret.value, tilt = EPU.seamTilt || 0.06;
        const seamLow = EPU.state.seam + (Math.min(r.y, r.y + r.w) - 0.5) * tilt;
        eraT = seamLow - 0.008 > r.x + r.z ? eraT + dt : 0;
        if (eraT > 0.6) EPU.ctf.reveal('era');
      }
      const mp = project(mascot.userData.home);
      const off = Math.abs(ndcAll.x) > 2;
      const lx = clamp((ndcAll.x - ((mp.x / innerWidth) * 2 - 1)) * 1.3, -1, 1);
      const ly = clamp((ndcAll.y - (1 - (mp.y / innerHeight) * 2)) * 1.3, -1, 1);
      face.rotation.y = damp(face.rotation.y, off ? 0 : lx * 0.5, 5, dt);
      face.rotation.x = damp(face.rotation.x, off ? 0 : -ly * 0.35, 5, dt);
      hex.rotation.z += dt * (0.2 + beat * 1.2);
      blinkT -= dt;
      const blink = blinkT < 0.12 && blinkT > 0 ? 0.12 : 1;
      if (blinkT < 0) blinkT = 2 + Math.random() * 4;
      eyes.forEach((e) => (e.scale.y = damp(e.scale.y, 1.45 * blink, 30, dt)));
      blushes.forEach((b) => (b.material.opacity = damp(b.material.opacity, hoverM * 0.75, 6, dt)));
      ballMat.color.copy(YELLOW).lerp(colTmp.set(0xff3b1f), risenAmt);
      ballMat.emissive.copy(YELLOW_E).lerp(colTmp.set(0x5a0000), risenAmt);
      hexMat.color.set(0xff5cbf).lerp(colTmp.set(0x7a0000), risenAmt);
      hexMat.emissive.set(0xff1f9a).lerp(colTmp.set(0xb00000), risenAmt);
      halo.material.color.set(0xff4fd8).lerp(colTmp.set(0xff1a00), risenAmt);
      horns.forEach((hn) => hn.scale.setScalar(Math.max(0.001, risenAmt)));

      orbitT += dt * (hoverStar >= 0 ? 0.15 : 1);
      const [ringK, ringTilt] = COMPO[EPU.layout.mode].orbit || [1.72, 0.28];
      const Ro = mb * ringK;
      const home = mascot.userData.home;
      trackStars.forEach((g, i) => {
        const u = g.userData;
        const a = u.phase + orbitT * 0.22;
        g.position.set(home.x + Math.cos(a) * Ro, home.y - Math.sin(a) * Ro * ringTilt + Math.sin(t + i) * mb * 0.05, home.z + Math.sin(a) * Ro * 0.6);
        g.rotation.z += dt * u.spin;
        g.rotation.y = Math.sin(t * 0.8 + i) * 0.5;
        if (u.gone) u.gone = Math.max(0, u.gone - dt);
        u.vis = damp(u.vis, u.gone ? 0 : 1, u.gone ? 10 : 6, dt);
        u.lit = Math.max(0, u.lit - dt);
        const on = hoverStar === i ? 1 : 0;
        g.scale.setScalar(u.base * Math.max(0.001, u.vis) * (1 + on * 0.45 + beat * 0.08 + u.lit * 0.3));
        u.mat.color.copy(PINK).lerp(BLOOD, risenAmt);
        u.mat.emissive.copy(PINK_E).lerp(BLOOD_E, risenAmt);
        u.mat.emissiveIntensity = 0.9 + on * 1.2 + beat * 0.4;
        u.glow.material.opacity = 0.45 + on * 0.4;
        u.glow.material.color.set(0xff5fc8).lerp(colTmp.set(0xff1a00), risenAmt);
      });

      goal.rotation.z += dt * 0.3;
      goal.scale.setScalar(goal.userData.base * (1 + beat * 0.1 + (hk === 'goal' ? 0.25 : 0)));
      goalMat.color.copy(PINK).lerp(BLOOD, risenAmt);
      goalMat.emissive.copy(PINK_E).lerp(BLOOD_E, risenAmt);

      const hoverH = hk === 'heart' ? 1 : 0;
      if (!hv.form) heart.rotation.y += dt * (0.5 + hoverH * 2);
      heart.scale.setScalar(heart.userData.base * (hv.form ? 1 : 1 + beat * 0.12 + hoverH * 0.06));
      if (hv.active) {
        hv.t += dt;
        const fly = hv.t < 0.45;
        const forming = !!hv.form && hv.t < 5.4;
        if (forming && !hv.shown && hv.t > 1.4) {
          hv.shown = true;
          EPU.ctf.reveal('heart');
        }
        if (hv.form && !forming) {
          hv.form = null;
          voxColor.forEach((c, i) => vox.setColorAt(i, c));
          vox.instanceColor.needsUpdate = true;
        }
        let energy = 0;
        for (let i = 0; i < homes.length; i++) {
          const j = i * 3, f = i * 4;
          for (let c = 0; c < 3; c++) {
            const target = forming ? hv.form[f + c] : 0;
            if (fly) hv.vel[j + c] *= Math.exp(-dt * 2.2);
            else hv.vel[j + c] += (-(hv.off[j + c] - target) * 40 - hv.vel[j + c] * 7) * dt;
            hv.off[j + c] += hv.vel[j + c] * dt;
            hv.rot[j + c] = fly ? hv.rot[j + c] + dt * (c + 2) * 3 : hv.rot[j + c] * Math.exp(-dt * 6);
            energy += Math.abs(hv.off[j + c]);
          }
          hv.sc[i] = damp(hv.sc[i], forming && !fly ? hv.form[f + 3] : 1, 8, dt);
        }
        if (!fly && !hv.form && energy < 0.002 * homes.length) {
          hv.active = false;
          hv.off.fill(0);
          hv.vel.fill(0);
          hv.rot.fill(0);
          hv.sc.fill(1);
        }
        setVoxels();
      }

      const hoverS = hk === 'skull' ? 1 : 0;
      const sp = project(skull.userData.home);
      const sx = clamp((ndcAll.x - ((sp.x / innerWidth) * 2 - 1)) * 1.2, -1, 1);
      skull.rotation.y = damp(skull.rotation.y, (off ? 0 : sx * 0.4) + Math.sin(t * 0.6) * 0.1, 4, dt);
      skull.rotation.z = Math.sin(t * 0.8) * 0.04;
      skull.position.y = skull.userData.home.y + Math.sin(t * 1.0) * skull.userData.base * 0.05;
      skull.userData.punch = Math.max(0, (skull.userData.punch || 0) - dt * 2.5);
      skull.scale.setScalar(skull.userData.base * (1 + skull.userData.punch * 0.25 + hoverS * 0.05));
      jaw.rotation.x = hoverS ? 0.1 + 0.2 * Math.abs(Math.sin(t * 22)) : 0.04 + beat * 0.25;
      pupilMat.emissiveIntensity = 2 + beat * 2 + risenAmt * 4 + hoverS * 3;

      if (alive > 0) {
        let n = 0;
        const dmp = Math.exp(-dt * 1.8);
        for (let i = 0; i < PMAX; i++) {
          if (pLife[i] <= 0) continue;
          pLife[i] = Math.max(0, pLife[i] - dt / pDur[i]);
          if (pLife[i] > 0) n++;
          const j = i * 3;
          pVel[j] *= dmp;
          pVel[j + 1] = pVel[j + 1] * dmp - dt * 2.2;
          pVel[j + 2] *= dmp;
          pPos[j] += pVel[j] * dt;
          pPos[j + 1] += pVel[j + 1] * dt;
          pPos[j + 2] += pVel[j + 2] * dt;
        }
        alive = n;
        for (const a of ['position', 'aColor', 'aLife', 'aSize']) pGeo.attributes[a].needsUpdate = true;
      }

      updateTrail(dt);

      glitch = Math.max(0, glitch - dt * 2.5);
      era.uniforms.uSeam.value = EPU.state.seam;
      era.uniforms.uTime.value = t;
      era.uniforms.uRisen.value = risenAmt;
      era.uniforms.uGlitch.value = glitch;
      era.uniforms.uFade.value = 0.08 + fade * 0.92;
      bloom.strength = BLOOM.s + beat * 0.35 + risenAmt * 0.3;
      composer.render(dt);
    }

    Object.assign(EPU.scene, { frame, project, ready: true, debug: { THREE, renderer, scene, camera, composer, bloom, era, art, artSize } });
  }
})();
