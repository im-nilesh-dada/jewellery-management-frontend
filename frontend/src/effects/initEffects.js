/**
 * JMS · Effects engine
 * ---------------------------------------------------------------------------
 * Zero dependencies. Pure DOM + CSS variables. Does NOT touch React.
 *
 * Pure CSS can't read the mouse, so this file does the few things CSS can't:
 *   - builds the fixed backdrop (aurora, light rays, 3D gems, gold dust)
 *   - custom cursor (jewel + orbiting ring that morphs over links / inputs)
 *   - sparkle trail + click burst + button ripple
 *   - 3D card tilt, spotlight & parallax (writes --rx --ry --mx --my --nx --ny)
 *   - magnetic buttons
 *   - scroll progress thread
 *
 * Everything is attached with event delegation on `document`, so React
 * re-renders, route changes and modals just work. Every pointer effect is
 * skipped for touch devices and for people who prefer reduced motion.
 */

const SPARK_COLORS = ["#fff3c4", "#f3e2b0", "#e8cd85", "#d9b45a", "#fff9e6", "#f2b8a8", "#bcd0ff", "#b9f0d6"];

/** Elements that behave as "cards" (tilt + spotlight). */
const CARD_SELECTOR = [
  "#root main article",
  '#root main :is(section, div)[class*="bg-white"][class*="border-[#ebe8e1]"][class*="rounded-"]',
  '#root main div[class*="border-[#eeeae2]"][class*="rounded-[11px]"]',
  '#root main[class*="h-dvh"] > div', // login card
].join(",");

const INTERACTIVE_SELECTOR =
  'a, button, select, summary, [role="button"], [role="tab"], input[type="checkbox"], input[type="radio"], [class*="cursor-pointer"]';
const TEXT_SELECTOR =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="button"]):not([type="submit"]), textarea, [contenteditable="true"]';

const rand = (min, max) => min + Math.random() * (max - min);
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/* =========================================================================
   Backdrop layers
   ========================================================================= */
const GEMS = [
  // x, y (viewport %), size, colour, parallax depth, spin seconds, opacity, float s, delay s
  { x: "27%", y: "5%",  s: 1.1,  c: "#d6245a", depth: 0.9, spin: 26, o: 0.85, float: 10, delay: 0 },
  { x: "90%", y: "24%", s: 0.9,  c: "#2f62e0", depth: 0.6, spin: 32, o: 0.8, float: 12, delay: -3 },
  { x: "80%", y: "80%", s: 1.5,  c: "#e3c46f", depth: 1.0, spin: 38, o: 0.85, float: 11, delay: -6 },
  { x: "13%", y: "76%", s: 1.0,  c: "#1fa874", depth: 0.7, spin: 29, o: 0.78, float: 13, delay: -2 },
  { x: "47%", y: "92%", s: 0.6,  c: "#8b4fd6", depth: 0.4, spin: 22, o: 0.6, float: 9,  delay: -5 },
  { x: "60%", y: "9%",  s: 0.6,  c: "#eaa595", depth: 0.4, spin: 24, o: 0.62, float: 14, delay: -8 },
];

function buildLayers() {
  const root = document.createElement("div");
  root.className = "fx-root";
  root.setAttribute("aria-hidden", "true");

  const gems = GEMS.map((g) => {
    const faces = "<i></i>".repeat(8);
    return `
      <div class="fx-gem" style="--x:${g.x};--y:${g.y};--depth:${g.depth};--o:${g.o}">
        <div class="fx-gem-body" style="--c:${g.c};--s:${g.s};--float:${g.float}s;--delay:${g.delay}s">
          <div class="fx-gem-spin" style="--s:${g.s};--spin:${g.spin}s;--delay:${g.delay}s">${faces}</div>
        </div>
      </div>`;
  }).join("");

  root.innerHTML = `
    <div class="fx-aurora"><i></i><i></i><i></i><i></i></div>
    <div class="fx-rays"></div>
    <div class="fx-gems">${gems}</div>
    <canvas class="fx-dust"></canvas>
    <div class="fx-grain"></div>`;
  document.body.prepend(root);

  const progress = document.createElement("div");
  progress.className = "fx-progress";
  progress.setAttribute("aria-hidden", "true");
  progress.innerHTML = "<b></b>";
  document.body.append(progress);

  return { root, canvas: root.querySelector(".fx-dust"), progressBar: progress.firstElementChild };
}

/* =========================================================================
   Scroll progress
   ========================================================================= */
function startScrollProgress(bar) {
  let ticking = false;
  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    bar.style.setProperty("--p", max > 0 ? String(clamp(doc.scrollTop / max, 0, 1)) : "0");
    ticking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", update, { passive: true });
  update();
}

/* =========================================================================
   Gold dust: drifting motes that scatter away from the pointer
   ========================================================================= */
function startDust(canvas, pointer) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const COLORS = ["196,150,52", "232,205,133", "236,160,145", "255,255,255", "160,184,240"];
  let w = 0;
  let h = 0;
  const motes = [];

  const make = (initial) => ({
    x: rand(0, w),
    y: initial ? rand(0, h) : h + 12,
    r: rand(0.7, 2.6),
    vy: -rand(0.1, 0.38),
    vx: rand(-0.1, 0.1),
    ph: rand(0, Math.PI * 2),
    tw: rand(0.012, 0.035),
    star: Math.random() < 0.2,
    c: pick(COLORS),
  });

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const target = Math.round(clamp((w * h) / 17000, 24, 100));
    while (motes.length < target) motes.push(make(true));
    motes.length = target;
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const drawStar = (x, y, r, fill) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(x, y - r * 2.4);
    ctx.quadraticCurveTo(x, y, x + r * 2.4, y);
    ctx.quadraticCurveTo(x, y, x, y + r * 2.4);
    ctx.quadraticCurveTo(x, y, x - r * 2.4, y);
    ctx.quadraticCurveTo(x, y, x, y - r * 2.4);
    ctx.fill();
  };

  const loop = () => {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < motes.length; i++) {
      const p = motes[i];
      p.ph += p.tw;
      p.x += p.vx + Math.sin(p.ph) * 0.14;
      p.y += p.vy;

      // scatter from the pointer
      const dx = p.x - pointer.x;
      const dy = p.y - pointer.y;
      const d2 = dx * dx + dy * dy;
      let glow = 0;
      if (d2 < 16900) {
        const d = Math.sqrt(d2) || 1;
        const force = (130 - d) / 130;
        p.x += (dx / d) * force * 2.4;
        p.y += (dy / d) * force * 2.4;
        glow = force;
      }

      if (p.y < -14 || p.x < -14 || p.x > w + 14) {
        motes[i] = make(false);
        continue;
      }

      const twinkle = 0.5 + 0.5 * Math.sin(p.ph * 3);
      const alpha = clamp(0.22 + twinkle * 0.5 + glow * 0.4, 0, 1);
      const fill = `rgba(${p.c},${alpha})`;
      if (p.star) {
        drawStar(p.x, p.y, p.r * (0.8 + twinkle * 0.6), fill);
      } else {
        ctx.fillStyle = `rgba(${p.c},${alpha * 0.18})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

/* =========================================================================
   Pointer effects
   ========================================================================= */
function startPointerFX({ root, fine }) {
  const html = document.documentElement;

  // --- cursor DOM --------------------------------------------------------
  // wrapper = positioned by JS; inner <i> = all visuals (see fx.css for why)
  const ring = document.createElement("div");
  ring.className = "fx-cursor-ring";
  ring.innerHTML = "<i></i>";
  const dot = document.createElement("div");
  dot.className = "fx-cursor-dot";
  dot.innerHTML = "<i></i>";
  const sparks = document.createElement("div");
  sparks.className = "fx-sparks";
  [ring, dot, sparks].forEach((el) => el.setAttribute("aria-hidden", "true"));
  document.body.append(sparks, ring, dot);

  // --- shared state ------------------------------------------------------
  const pointer = startPointerFX.pointer;
  const state = {
    ringX: -200,
    ringY: -200,
    px: 0, // parallax, eased
    py: 0,
    target: null,
    moved: false,
    running: false,
    lastSpark: { x: -999, y: -999 },
    mode: "default",
    cards: new Set(),
    button: null,
    aside: null,
    live: false,
  };

  // --- sparkles ----------------------------------------------------------
  const MAX_SPARKS = 46;
  const spawnSpark = (x, y, { spread = 34, size = [7, 15], life = [0.7, 1.2] } = {}) => {
    if (sparks.childElementCount > MAX_SPARKS) return;
    const el = document.createElement("i");
    el.className = "fx-spark";
    const angle = rand(0, Math.PI * 2);
    const dist = rand(spread * 0.4, spread);
    el.style.cssText =
      `--x:${x}px;--y:${y}px;--dx:${Math.cos(angle) * dist}px;--dy:${Math.sin(angle) * dist + rand(8, 26)}px;` +
      `--sz:${rand(size[0], size[1]).toFixed(1)}px;--sc:${pick(SPARK_COLORS)};--dur:${rand(life[0], life[1]).toFixed(2)}s`;
    el.addEventListener("animationend", () => el.remove(), { once: true });
    sparks.append(el);
  };
  const burst = (x, y) => {
    const wave = document.createElement("i");
    wave.className = "fx-wave";
    wave.style.cssText = `--x:${x}px;--y:${y}px`;
    wave.addEventListener("animationend", () => wave.remove(), { once: true });
    sparks.append(wave);
    for (let i = 0; i < 12; i++) spawnSpark(x, y, { spread: 84, size: [8, 18], life: [0.7, 1.3] });
  };

  // --- cursor context ----------------------------------------------------
  const modeFor = (t) => {
    if (!t || !t.closest) return "default";
    if (t.closest(TEXT_SELECTOR)) return "text";
    if (t.closest("button:disabled, [aria-disabled='true']")) return "disabled";
    if (t.closest(INTERACTIVE_SELECTOR)) return "link";
    return "default";
  };

  // --- 3D tilt / spotlight on cards -------------------------------------
  const resetCard = (el) => {
    ["--rx", "--ry", "--mx", "--my", "--nx", "--ny"].forEach((p) => el.style.removeProperty(p));
    el.classList.remove("fx-tilting");
  };
  const cardChain = (target) => {
    const chain = [];
    let el = target && target.closest ? target.closest(CARD_SELECTOR) : null;
    while (el && chain.length < 2) {
      // transforms/backdrop on an ancestor of a fixed overlay would re-anchor it
      const ok = !el.closest(".fixed") && !el.querySelector(".fixed.inset-0");
      if (ok) chain.push(el);
      el = el.parentElement ? el.parentElement.closest(CARD_SELECTOR) : null;
    }
    return chain;
  };
  const maxTilt = (el, rect, target) => {
    if (el.matches('main[class*="h-dvh"] > div')) return 2.4;
    if (target.closest("table, input, select, textarea, [role='dialog']")) return 0;
    const area = rect.width * rect.height;
    return area < 90000 ? 10 : area < 260000 ? 5 : 1.6;
  };
  const updateCards = () => {
    const chain = cardChain(state.target);
    for (const el of [...state.cards]) {
      if (!chain.includes(el)) {
        resetCard(el);
        state.cards.delete(el);
      }
    }
    for (const el of chain) {
      const rect = el.getBoundingClientRect();
      const nx = clamp((pointer.x - rect.left) / rect.width, 0, 1);
      const ny = clamp((pointer.y - rect.top) / rect.height, 0, 1);
      const max = maxTilt(el, rect, state.target);
      el.classList.add("fx-tilting");
      el.style.setProperty("--mx", `${(pointer.x - rect.left).toFixed(1)}px`);
      el.style.setProperty("--my", `${(pointer.y - rect.top).toFixed(1)}px`);
      el.style.setProperty("--nx", (nx * 2 - 1).toFixed(3));
      el.style.setProperty("--ny", (ny * 2 - 1).toFixed(3));
      el.style.setProperty("--rx", `${((0.5 - ny) * 2 * max).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${((nx - 0.5) * 2 * max).toFixed(2)}deg`);
      state.cards.add(el);
    }
  };

  // --- magnetic buttons + highlight -------------------------------------
  const resetButton = (el) => {
    ["--tx", "--ty", "--mx", "--my"].forEach((p) => el.style.removeProperty(p));
  };
  const updateButton = () => {
    const t = state.target;
    const btn =
      t && t.closest ? t.closest('button:not(:disabled), a[class*="rounded"]') : null;
    const el = btn && !btn.closest("aside") ? btn : null;
    if (state.button && state.button !== el) {
      resetButton(state.button);
      state.button = null;
    }
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width > 280) return; // don't drag huge full-width buttons around
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    el.style.setProperty("--tx", `${clamp((pointer.x - cx) * 0.2, -7, 7).toFixed(2)}px`);
    el.style.setProperty("--ty", `${clamp((pointer.y - cy) * 0.28, -5, 5).toFixed(2)}px`);
    el.style.setProperty("--mx", `${(pointer.x - rect.left).toFixed(1)}px`);
    el.style.setProperty("--my", `${(pointer.y - rect.top).toFixed(1)}px`);
    state.button = el;
  };

  // --- sidebar spotlight -------------------------------------------------
  const updateAside = () => {
    const t = state.target;
    const el = t && t.closest ? t.closest("aside") : null;
    if (state.aside && state.aside !== el) {
      state.aside.style.removeProperty("--mx");
      state.aside.style.removeProperty("--my");
      state.aside = null;
    }
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${(pointer.x - rect.left).toFixed(1)}px`);
    el.style.setProperty("--my", `${(pointer.y - rect.top).toFixed(1)}px`);
    state.aside = el;
  };

  // --- the frame loop (only runs while something is moving) --------------
  const frame = () => {
    // ring follows with inertia
    state.ringX += (pointer.x - state.ringX) * 0.2;
    state.ringY += (pointer.y - state.ringY) * 0.2;
    ring.style.transform = `translate3d(${state.ringX}px, ${state.ringY}px, 0)`;
    dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;

    // eased parallax for backdrop (-1..1)
    const tx = (pointer.x / window.innerWidth) * 2 - 1;
    const ty = (pointer.y / window.innerHeight) * 2 - 1;
    state.px += (tx - state.px) * 0.06;
    state.py += (ty - state.py) * 0.06;
    root.style.setProperty("--px", state.px.toFixed(4));
    root.style.setProperty("--py", state.py.toFixed(4));

    if (state.moved) {
      state.moved = false;

      const mode = modeFor(state.target);
      if (mode !== state.mode) {
        state.mode = mode;
        html.dataset.fxCursor = mode;
      }

      updateCards();
      updateButton();
      updateAside();

      // sparkle trail
      const dx = pointer.x - state.lastSpark.x;
      const dy = pointer.y - state.lastSpark.y;
      if (dx * dx + dy * dy > 700 && mode !== "text") {
        state.lastSpark = { x: pointer.x, y: pointer.y };
        spawnSpark(pointer.x, pointer.y, { spread: 30, size: [6, 13] });
      }
    }

    const settling =
      Math.abs(pointer.x - state.ringX) > 0.2 ||
      Math.abs(pointer.y - state.ringY) > 0.2 ||
      Math.abs(state.px - tx) > 0.0015 ||
      Math.abs(state.py - ty) > 0.0015;

    if (settling || state.moved) {
      requestAnimationFrame(frame);
    } else {
      state.running = false;
    }
  };
  const wake = () => {
    if (!state.running) {
      state.running = true;
      requestAnimationFrame(frame);
    }
  };

  // --- events ------------------------------------------------------------
  document.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType === "touch") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      state.target = e.target;
      state.moved = true;
      if (!state.live && fine) {
        // first real movement: reveal the custom cursor, hide the native one
        state.live = true;
        state.ringX = e.clientX;
        state.ringY = e.clientY;
        html.classList.add("fx-cursor-on");
      }
      html.classList.remove("fx-cursor-away");
      wake();
    },
    { passive: true }
  );

  document.documentElement.addEventListener("mouseleave", () => {
    html.classList.add("fx-cursor-away");
    state.target = null;
    state.moved = true;
    wake();
  });
  document.documentElement.addEventListener("mouseenter", () => html.classList.remove("fx-cursor-away"));

  document.addEventListener(
    "pointerdown",
    (e) => {
      html.setAttribute("data-fx-press", "");
      burst(e.clientX, e.clientY);

      // button ripple
      const btn = e.target.closest && e.target.closest("button:not(:disabled), a[class*='rounded']");
      if (btn && !btn.closest("aside")) {
        const rect = btn.getBoundingClientRect();
        btn.style.setProperty("--rx", `${e.clientX - rect.left}px`);
        btn.style.setProperty("--ry", `${e.clientY - rect.top}px`);
        btn.classList.add("fx-ripple-host");
        btn.classList.remove("fx-ripple");
        void btn.offsetWidth; // restart the animation
        btn.classList.add("fx-ripple");
        const done = (ev) => {
          if (ev.animationName !== "ripple") return;
          btn.classList.remove("fx-ripple", "fx-ripple-host");
          btn.removeEventListener("animationend", done);
        };
        btn.addEventListener("animationend", done);
      }
    },
    { passive: true }
  );
  const release = () => html.removeAttribute("data-fx-press");
  document.addEventListener("pointerup", release, { passive: true });
  document.addEventListener("pointercancel", release, { passive: true });
  window.addEventListener("blur", release);
}
startPointerFX.pointer = { x: -200, y: -200 };

/* =========================================================================
   Performance guard: if early frames are slow, switch on the lite mode
   ========================================================================= */
function watchPerformance() {
  const sample = () => {
    let frames = 0;
    let start = 0;
    const tick = (t) => {
      if (!start) start = t;
      frames++;
      if (t - start < 1800) {
        requestAnimationFrame(tick);
      } else if (frames / ((t - start) / 1000) < 28) {
        document.documentElement.classList.add("fx-lite");
      }
    };
    requestAnimationFrame(tick);
  };
  // wait for the entrance choreography to finish before measuring steady state
  window.setTimeout(() => {
    if (document.hidden) return;
    sample();
  }, 3500);
}

/* =========================================================================
   Public entry
   ========================================================================= */
export function initEffects() {
  if (typeof window === "undefined" || window.__jmsFx) return;
  window.__jmsFx = true;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return; // static, calm UI for people who asked for it

  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const mount = () => {
    const { root, canvas, progressBar } = buildLayers();
    startScrollProgress(progressBar);
    startDust(canvas, startPointerFX.pointer);
    startPointerFX({ root, fine });
    watchPerformance();
  };

  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount, { once: true });
}
